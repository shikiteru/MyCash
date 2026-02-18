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
    range: `Sheet1!A1:H`,
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

async function findRowIndexById(spreadsheetId: string, idrow: string) {
  const sheets = await getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `Sheet1!A1:H`,
  });
  const col = res.data.values || [];

  for (let i = 1; i < col.length; i++) {
    if ((col[i][0] || "") === idrow) return i + 1;
  }

  return null;
}

export async function deleteRowById(spreadsheetId: string, idrow: string) {
  const rowIndex = await findRowIndexById(spreadsheetId, idrow);

  if (!rowIndex) throw new Error("ID tidak ditemukan");

  const sheets = await getClient();

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: await getSheetIdByName("Sheet1", spreadsheetId),
              dimension: "ROWS",
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

async function getSheetIdByName(title: string, spreadsheetId: string) {
  const sheets = await getClient();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId });
  const sheet = meta.data.sheets?.find((s) => s.properties?.title === title);

  if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
    throw new Error("Sheet tidak ditemukan");
  }

  return sheet.properties.sheetId!;
}

export async function getSecretSheet(spreadsheetId: string) {
  const sheets = await getClient();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId });
  const sheet = meta.data?.properties?.title === process.env.SECRET_SHEETS;

  if (!sheet) return false;

  return true;
}
