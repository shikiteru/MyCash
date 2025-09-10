import { getSpreadSheetId } from "@/src/libs/checkUrl";
import { appendRow, deleteRowById } from "@/src/libs/sheets";
import { AppendNewDataSchema } from "@/src/utils/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let json: any;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Body harus JSON yang valid" },
      { status: 400 }
    );
  }

  const parsed = AppendNewDataSchema.safeParse(json);
  if (!parsed.success) {
    const errs = parsed.error.flatten();
    return NextResponse.json(
      {
        success: false,
        message: "Form Input Tidak Lengkap Harap Isi Semua Field",
        errors: errs,
      },
      { status: 400 }
    );
  }

  const { tanggal, deskripsi, kategori, jenis, jumlah, metode, catatan, url } =
    parsed.data;

  const spreadsheetId = getSpreadSheetId(url);
  if (!spreadsheetId) {
    return NextResponse.json(
      { success: false, message: "URL Spreadsheet tidak valid" },
      { status: 400 }
    );
  }

  try {
    await appendRow({
      tanggal,
      deskripsi,
      kategori,
      jenis,
      jumlah,
      metode,
      catatan,
      spreadsheetId,
    });

    return NextResponse.json(
      { success: true, message: "Success menambahkan data baru" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah data baru" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const sheetsid = searchParams.get("sheetsid");
  const idrow = searchParams.get("idrow");
  try {
    if (!idrow || !sheetsid)
      return NextResponse.json({ message: "Id Required" }, { status: 400 });
    await deleteRowById(sheetsid, idrow);
    return NextResponse.json(
      { message: "success hapus data" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Error Delete Data" }, { status: 400 });
  }
}
