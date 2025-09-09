import { z } from "zod";

export const AppendNewDataSchema = z.object({
  tanggal: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Format tanggal harus DD-MM-YYYY")
    .superRefine((val, ctx) => {
      const [dd, mm, yyyy] = val.split("-").map(Number);
      const d = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1);
      const valid =
        d.getFullYear() === yyyy &&
        d.getMonth() === (mm ?? 1) - 1 &&
        d.getDate() === dd;
      if (!valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal tidak valid",
        });
      }
    }),

  deskripsi: z.string().trim().min(1, "Deskripsi wajib diisi"),
  kategori: z.string().trim().min(1, "Kategori wajib diisi"),
  jenis: z.enum(["Pemasukan", "Pengeluaran"], {
    message: "Jenis harus Pemasukan atau Pengeluaran",
  }),

  jumlah: z
    .union([z.string(), z.number()])
    .transform((v) => String(v))
    .transform((s) => s.replace(/[^\d.-]/g, ""))
    .refine((s) => /^-?\d+(\.\d+)?$/.test(s), {
      message: "Jumlah harus angka",
    }),

  metode: z.string().trim().min(1, "Metode pembayaran wajib diisi"),
  catatan: z.string().trim().optional().default(""),
  url: z.string().trim().min(1, "URL spreadsheet wajib diisi"),
});
