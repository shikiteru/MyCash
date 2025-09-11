"use client";
import HomeLoading from "@/components/HomeLoading";
import { useStorage } from "@/src/context/StorageProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileNavigation from "@/components/mobilenavigation";
import { Card, CardBody } from "@heroui/card";
import { CoinIcon, DownGrafikIcon, UpGrafikIcon } from "@/components/icons";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useHomeData } from "@/src/hooks/useHome";

export default function HomeDashboard() {
  const router = useRouter();
  const { url, haveUrl, hydrated, key } = useStorage();
  const enabled = hydrated && haveUrl && Boolean(url);
  const { data, loading, error } = useHomeData(url, enabled);

  async function updateUsed() {
    if (!key) return;
    const res = await fetch(`/api/verify?key=${key}`, {
      method: "GET",
    });
    const data = await res.json();
    if (!data.success) {
      router.replace("/");
    }
  }

  useEffect(() => {
    updateUsed();
    if (!haveUrl) router.replace("/");
  }, [haveUrl, router]);

  if (!haveUrl)
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  if (loading || !data)
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  if (error) return <p className="p-6 text-red-600">Gagal memuat data.</p>;

  const totalPemasukan = data?.totalPemasukan?.toLocaleString("id") ?? 0;
  const totalPengeluaran = data?.totalPengeluaran?.toLocaleString("id") ?? 0;
  const totalPemasukanBulanIni =
    data?.totalPemasukanBulanIni?.toLocaleString("id") ?? 0;
  const totalPengeluaranBulanIni =
    data?.totalPengeluaranBulanIni?.toLocaleString("id") ?? 0;
  const saldo = data?.saldo?.toLocaleString("id") ?? 0;

  return (
    <section className="flex flex-col items-center justify-center gap-4 my-12 pb-6 px-1 md:py-10">
      <div className="w-full h-full">
        <div className="flex flex-col items-center justify-around">
          {/* Total All */}
          <div className="flex flex-row justify-between gap-2">
            <Card className="min-w-[160px] md:min-w-[230px] p-1">
              <CardBody>
                <UpGrafikIcon />
                <p className="text-xs text-green-600">Total Pemasukan</p>
                <p className="text-sm font-semibold">Rp {totalPemasukan}</p>
              </CardBody>
            </Card>
            <Card className="min-w-[160px] md:min-w-[230px] p-1">
              <CardBody>
                <DownGrafikIcon />
                <p className="text-xs text-red-500">Total Pengeluaran</p>
                <p className="text-sm font-semibold">Rp {totalPengeluaran}</p>
              </CardBody>
            </Card>
          </div>
          {/* Total Bulanan */}
          <div className="flex flex-row justify-between gap-2 mt-2">
            <Card className="min-w-[160px] md:min-w-[230px] p-2">
              <CardBody>
                <UpGrafikIcon />
                <p className="text-xs text-green-600">Masukan Bulan ini</p>
                <p className="text-sm font-semibold">
                  Rp {totalPemasukanBulanIni}
                </p>
              </CardBody>
            </Card>
            <Card className="min-w-[160px] md:min-w-[230px] p-2">
              <CardBody>
                <DownGrafikIcon />
                <p className="text-xs text-red-500">Keluaran Bulan ini</p>
                <p className="text-sm font-semibold">
                  Rp {totalPengeluaranBulanIni}
                </p>
              </CardBody>
            </Card>
          </div>
          <Card className="mt-6 w-full md:w-[50%] mx-auto">
            <CardBody>
              <div className="flex gap-2 items-center">
                <CoinIcon />
                <p className="text-sm ">Cashflow Bersih</p>
              </div>
              <p className="text-sm font-semibold p-3">Rp {saldo}</p>
            </CardBody>
          </Card>
          <p className="text-md font-semibold p-2 mb-3">Transaksi Terakhir</p>
          <Table
            aria-label="Example static collection table"
            className="md:w-[50%]"
          >
            <TableHeader>
              <TableColumn>Tanggal</TableColumn>
              <TableColumn>Jenis</TableColumn>
              <TableColumn>Jumlah</TableColumn>
              <TableColumn>Kategori</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada data">
              {(data?.dataSpreadseet ?? []).map((i: any) => {
                const isPemasukan = i.jenis === "Pemasukan";
                return (
                  <TableRow key={i.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {i.tanggal}
                    </TableCell>
                    <TableCell
                      className={`text-xs whitespace-nowrap ${isPemasukan ? "text-success" : "text-danger"}`}
                    >
                      {i.jenis}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {Number(i.jumlah)?.toLocaleString("id")}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {i.kategori}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
