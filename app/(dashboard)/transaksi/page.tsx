"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";

import { useStorage } from "@/src/context/StorageProvider";
import HomeLoading from "@/components/HomeLoading";
import { useTransaksi } from "@/src/hooks/useTransaksi";
import { getCustomData } from "@/src/libs/localstorage";

type Opt = { key: string; label: string };

const DEFAULT_KATEGORI = [
  "Gaji",
  "Makanan",
  "Tagihan",
  "Transportasi",
  "Belanja",
];
const DEFAULT_METODE = ["Cash", "Transfer Bank", "E-wallet"];

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b),
  );
}

export default function TransaksiDashboard() {
  const router = useRouter();
  const { haveUrl } = useStorage();
  const [loading, setLoading] = useState(true);
  const {
    formValue,
    handleChange,
    handleSelect,
    handleSubmit,
    handleTanggalChange,
    pending,
    showAlert,
    isSuccess,
    message,
  } = useTransaksi();
  const [kategoriOptions, setKategoriOptions] =
    useState<string[]>(DEFAULT_KATEGORI);
  const [metodeOptions, setMetodeOptions] = useState<string[]>(DEFAULT_METODE);

  useEffect(() => {
    if (!haveUrl) router.replace("/");
    const t = setTimeout(() => setLoading(false), 1500);

    return () => clearTimeout(t);
  }, [haveUrl, router]);

  useEffect(() => {
    try {
      const customKategori = getCustomData("kategori") ?? [];
      const customMetode = getCustomData("metode") ?? [];

      setKategoriOptions(uniqSorted([...DEFAULT_KATEGORI, ...customKategori]));
      setMetodeOptions(uniqSorted([...DEFAULT_METODE, ...customMetode]));
    } catch {}
  }, []);

  const kategoriItems: Opt[] = useMemo(
    () => kategoriOptions.map((k) => ({ key: k, label: k })),
    [kategoriOptions],
  );
  const metodeItems: Opt[] = useMemo(
    () => metodeOptions.map((m) => ({ key: m, label: m })),
    [metodeOptions],
  );

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 pb-16 md:py-10">
      <div className="w-full h-full mt-4">
        <form onSubmit={handleSubmit}>
          <Card className="p-2 w-[90%] md:w-[50%] mx-auto">
            <CardHeader>
              <h2 className="text-lg font-semibold">Transaksi</h2>
            </CardHeader>

            <CardBody className="flex flex-col gap-3">
              <DatePicker
                defaultValue={today(getLocalTimeZone())}
                granularity="day"
                label="Tanggal"
                value={formValue.tanggal}
                onChange={handleTanggalChange}
              />

              <Input
                label="Deskripsi"
                name="deskripsi"
                placeholder="Masukkan Deskripsi"
                value={formValue.deskripsi}
                onChange={handleChange}
              />

              <Select
                isDisabled={kategoriItems.length === 0}
                items={kategoriItems}
                label="Kategori"
                placeholder="Pilih Kategori"
                selectedKeys={
                  formValue.kategori ? new Set([formValue.kategori]) : new Set()
                }
                onSelectionChange={handleSelect("kategori")}
              >
                {(item: Opt) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                )}
              </Select>

              <Select
                label="Jenis"
                placeholder="Pilih Jenis"
                selectedKeys={
                  formValue.jenis ? new Set([formValue.jenis]) : new Set()
                }
                onSelectionChange={handleSelect("jenis")}
              >
                <SelectItem key="Pemasukan">Pemasukan</SelectItem>
                <SelectItem key="Pengeluaran">Pengeluaran</SelectItem>
              </Select>

              <Input
                label="Jumlah"
                name="jumlah"
                placeholder="0"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">Rp</span>
                  </div>
                }
                type="number"
                value={formValue.jumlah}
                onChange={handleChange}
              />

              <Select
                isDisabled={metodeItems.length === 0}
                items={metodeItems}
                label="Metode Pembayaran"
                placeholder="Pilih Metode Pembayaran"
                selectedKeys={
                  formValue.metode ? new Set([formValue.metode]) : new Set()
                }
                onSelectionChange={handleSelect("metode")}
              >
                {(item: Opt) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                )}
              </Select>

              <Input
                label="Catatan"
                name="catatan"
                placeholder="Masukkan Catatan"
                value={formValue.catatan}
                onChange={handleChange}
              />
            </CardBody>

            <CardFooter className="flex flex-col justify-between gap-2">
              <Button
                className="w-full font-semibold"
                color="success"
                disabled={pending}
                type="submit"
                variant="solid"
              >
                {pending ? (
                  <Spinner
                    className="mb-2"
                    color="white"
                    size="lg"
                    variant="dots"
                  />
                ) : (
                  "Simpan"
                )}
              </Button>
              {showAlert && (
                <Alert
                  color={isSuccess ? "success" : "danger"}
                  description={message}
                  title={isSuccess ? "Berhasil" : "Gagal"}
                  variant="flat"
                />
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </section>
  );
}
