import { google } from "googleapis";
import { nanoid } from "nanoid";

export async function getClient() {
  const jwt = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({
    version: "v4",
    auth: jwt,
  });
}

export async function ReadAll(spreadsheetId: string) {
  const sheets = await getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `Sheet1!A1:H`,
  });
  const rows = res.data.values || [];
  if (rows.length <= 1) return [];
  const header = rows[0];
  return rows.slice(1).map((r) => ({
    id: r[0],
    tanggal: r[1],
    deskripsi: r[2],
    kategori: r[3],
    jenis: r[4],
    jumlah: r[5],
    metode: r[6],
    catatan: r[7],
  }));
}

export async function appendRow(row: {
  tanggal: string;
  deskripsi: string;
  kategori: string;
  jenis: string;
  jumlah: string;
  metode: string;
  catatan: string;
  spreadsheetId: string;
}) {
  const sheets = await getClient();
  const id = nanoid();
  await sheets.spreadsheets.values.append({
    spreadsheetId: row.spreadsheetId,
    range: `Sheet1!A1:G`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          id,
          row.tanggal,
          row.deskripsi,
          row.kategori,
          row.jenis,
          row.jumlah,
          row.metode,
          row.catatan,
        ],
      ],
    },
  });
}
