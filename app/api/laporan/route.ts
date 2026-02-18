import { NextResponse } from "next/server";

import { ReadAll } from "@/src/libs/sheets";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id tidak ditemukan" },
        { status: 400 },
      );
    }
    const data = await ReadAll(id);

    return NextResponse.json({
      message: "success get data",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "terjadi kesalahan", data: [] },
      { status: 400 },
    );
  }
}
