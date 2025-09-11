import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { checkUrlSpreadSheet, getSpreadSheetId } from "@/src/libs/checkUrl";
import { ReadAll } from "@/src/libs/sheets";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const url = typeof body?.url === "string" ? body.url.trim() : "";

  if (!url) {
    return NextResponse.json(
      { error: "Body harus JSON dengan field 'url' (string)" },
      { status: 400 }
    );
  }

  try {
    if (!checkUrlSpreadSheet(url)) {
      return NextResponse.json({ error: "Url tidak valid" }, { status: 400 });
    }

    const spreadsheetId = getSpreadSheetId(url);
    if (!spreadsheetId) {
      return NextResponse.json({ error: "Url tidak valid" }, { status: 400 });
    }
    const data = await ReadAll(spreadsheetId);
    const dataSpreadseet = [...data].reverse().slice(0, 5);
    const toNum = (v: any) =>
      Number(String(v ?? 0).replace(/[^\d.-]/g, "")) || 0;
    const totalPemasukan = data
      .filter((i: any) => i.jenis === "Pemasukan")
      .reduce((acc: number, i: any) => acc + toNum(i.jumlah), 0);
    const totalPengeluaran = data
      .filter((i: any) => i.jenis === "Pengeluaran")
      .reduce((acc: number, i: any) => acc + toNum(i.jumlah), 0);
    const saldo = totalPemasukan - totalPengeluaran;
    const now = moment();
    const dataBulanIni = data.filter((i: any) => {
      const m = moment(String(i.tanggal), "DD-MM-YYYY", true);
      return (
        m.isValid() && m.month() === now.month() && m.year() === now.year()
      );
    });

    const totalPemasukanBulanIni = dataBulanIni
      .filter((i: any) => i.jenis === "Pemasukan")
      .reduce((acc: number, i: any) => acc + toNum(i.jumlah), 0);

    const totalPengeluaranBulanIni = dataBulanIni
      .filter((i: any) => i.jenis === "Pengeluaran")
      .reduce((acc: number, i: any) => acc + toNum(i.jumlah), 0);

    return NextResponse.json({
      message: "Data berhasil diambil",
      data: {
        dataSpreadseet,
        totalPemasukan,
        totalPengeluaran,
        saldo,
        totalPemasukanBulanIni,
        totalPengeluaranBulanIni,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
