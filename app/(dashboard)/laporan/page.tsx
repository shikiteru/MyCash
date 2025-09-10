"use client";
import HomeLoading from "@/components/HomeLoading";
import { useStorage } from "@/src/context/StorageProvider";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { DatePicker } from "@heroui/date-picker";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLaporan } from "@/src/hooks/useLaporan";
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { getSpreadSheetId } from "@/src/libs/checkUrl";

function ddmmyyyyToTime(t: string): number {
  const [dd, mm, yyyy] = t.split("-").map(Number);
  return new Date(yyyy, (mm ?? 1) - 1, dd ?? 1).getTime();
}
function calDateToDDMMYYYY(d: CalendarDate | null): string {
  if (!d) return "";
  const js = d.toDate(getLocalTimeZone());
  const dd = String(js.getDate()).padStart(2, "0");
  const mm = String(js.getMonth() + 1).padStart(2, "0");
  const yy = js.getFullYear();
  return `${dd}-${mm}-${yy}`;
}

type Opt = { key: string; label: string };

export default function LaporanDashboard() {
  const { url, haveUrl, hydrated } = useStorage();
  const enabled = hydrated && haveUrl && Boolean(url);
  const { data, loading, error, refetch, setData, initialLoad } = useLaporan(
    url,
    enabled
  );
  const router = useRouter();
  const [jenis, setJenis] = useState<"" | "Pemasukan" | "Pengeluaran">("");
  const [urut, setUrut] = useState<"" | "Terbaru" | "Terlama">("Terbaru");
  const [kategori, setKategori] = useState<string>("");
  const [tanggal, setTanggal] = useState<CalendarDate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(row: any) {
    if (!row?.id) return;
    const prev = data;
    setDeletingId(row.id);
    setData(prev.filter((x: any) => x.id !== row.id));

    try {
      const spreadsheetId = getSpreadSheetId(url!);
      const qs = new URLSearchParams({
        sheetsid: spreadsheetId,
        idrow: String(row.id),
      }).toString();
      const res = await fetch(`/api/actionsheet?${qs}`, { method: "DELETE" });
      if (!res.ok) {
        setData(prev);
      }
      refetch();
    } catch (err) {
      setData(prev);
      refetch();
    } finally {
      setDeletingId(null);
    }
  }
  useEffect(() => {
    if (!haveUrl) router.push("/");
  }, [haveUrl, router]);

  const defaultKategori = [
    "Gaji",
    "Makanan",
    "Tagihan",
    "Transportasi",
    "Belanja",
  ];
  const kategoriOptions = useMemo(() => {
    const set = new Set(defaultKategori); // default dulu
    if (Array.isArray(data)) {
      data.forEach((r) => {
        const k = String(r?.kategori ?? "").trim();
        if (k) set.add(k);
      });
    }
    return Array.from(set).sort();
  }, [data]);

  const kategoriItems = useMemo(
    () => [
      { key: "", label: "Semua" },
      ...kategoriOptions.map((k) => ({ key: k, label: k })),
    ],
    [kategoriOptions]
  );

  const filteredData = useMemo(() => {
    const rows: any[] = Array.isArray(data) ? [...data] : [];

    if (jenis)
      rows.splice(0, rows.length, ...rows.filter((r) => r.jenis === jenis));
    if (kategori)
      rows.splice(
        0,
        rows.length,
        ...rows.filter((r) => r.kategori === kategori)
      );
    if (tanggal) {
      const target = calDateToDDMMYYYY(tanggal);
      rows.splice(
        0,
        rows.length,
        ...rows.filter((r) => String(r.tanggal) === target)
      );
    }

    rows.sort((a, b) => {
      const ta = ddmmyyyyToTime(String(a.tanggal));
      const tb = ddmmyyyyToTime(String(b.tanggal));
      return ta - tb; // selalu ascending dulu (Terlama → Terbaru)
    });

    if (urut === "Terbaru") {
      rows.reverse(); // balik kalau Terbaru
    }

    return rows;
  }, [data, jenis, kategori, tanggal, urut]);

  if (initialLoad || !data) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }
  if (error) return <p className="p-6 text-red-600">Gagal memuat data.</p>;

  return (
    <section className="flex flex-col items-center justify-center gap-4 pb-20 pt-6 md:py-10">
      <div className="w-full h-full">
        <h2 className="text-xl font-bold text-center mb-2">Laporan</h2>

        <Card className="md:w-[50%] mx-auto mb-3">
          <CardBody>
            <div className="flex flex-row flex-wrap justify-around items-center gap-2">
              <Select
                size="sm"
                label="Jenis Laporan"
                placeholder="Pilih Jenis"
                className="w-[45%]"
                selectedKeys={jenis ? new Set([jenis]) : new Set()}
                onSelectionChange={(keys) => {
                  const val =
                    keys === "all" ? "" : String(Array.from(keys)[0] ?? "");
                  setJenis(val as "" | "Pemasukan" | "Pengeluaran");
                }}
              >
                <SelectItem key="">Semua</SelectItem>
                <SelectItem key="Pengeluaran">Pengeluaran</SelectItem>
                <SelectItem key="Pemasukan">Pemasukan</SelectItem>
              </Select>

              <Select
                size="sm"
                label="Urutan Laporan"
                placeholder="Pilih Urutan"
                className="w-[45%]"
                selectedKeys={urut ? new Set([urut]) : new Set()}
                onSelectionChange={(keys) => {
                  const val =
                    keys === "all" ? "" : String(Array.from(keys)[0] ?? "");
                  setUrut((val as "" | "Terbaru" | "Terlama") || "Terbaru");
                }}
              >
                <SelectItem key="Terbaru">Terbaru</SelectItem>
                <SelectItem key="Terlama">Terlama</SelectItem>
              </Select>

              <Select
                size="sm"
                label="Kategori"
                placeholder="Pilih Kategori"
                className="w-[45%]"
                items={kategoriItems}
                selectedKeys={kategori ? new Set([kategori]) : new Set()}
                onSelectionChange={(keys) => {
                  const val =
                    keys === "all" ? "" : String(Array.from(keys)[0] ?? "");
                  setKategori(val);
                }}
              >
                {(item: Opt) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                )}
              </Select>

              <DatePicker
                showMonthAndYearPickers
                className="w-[45%]"
                label="Pilih Tanggal"
                value={tanggal}
                onChange={(val: DateValue | null) =>
                  setTanggal((val as CalendarDate) ?? null)
                }
              />
            </div>
          </CardBody>
        </Card>

        <Table
          aria-label="Tabel Laporan"
          className="md:w-[50%] mx-auto"
          radius="sm"
          maxTableHeight={data.length <= 3 ? 250 : 400}
          isVirtualized={true}
          rowHeight={40}
        >
          <TableHeader>
            <TableColumn>Tanggal</TableColumn>
            <TableColumn>Jumlah</TableColumn>
            <TableColumn>Jenis</TableColumn>
            <TableColumn>Deskripsi</TableColumn>
            <TableColumn>Kategori</TableColumn>
            <TableColumn>Metode</TableColumn>
            <TableColumn>Catatan</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Tidak ada data">
            {filteredData.map((item: any, idx: number) => (
              <TableRow key={item.id ?? idx}>
                <TableCell className="whitespace-nowrap">
                  {item.tanggal}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {Number(item.jumlah ?? 0).toLocaleString("id")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.jenis}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.deskripsi}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.kategori}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.metode}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.catatan}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(item)}
                    isLoading={deletingId === item.id}
                    isDisabled={deletingId === item.id}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
