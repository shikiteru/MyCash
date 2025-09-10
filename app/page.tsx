"use client";

import HomeLoading from "@/components/HomeLoading";
import { useStorage } from "@/src/context/StorageProvider";
import { checkUrlSpreadSheet } from "@/src/libs/checkUrl";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/alert";
import { AddUrl } from "@/src/libs/localstorage";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true); // ← AKTIFKAN LAGI
  const [error, setError] = useState<string | null>(null); // ← AKTIFKAN LAGI
  const [url, setUrl] = useState("");

  const router = useRouter();
  const { haveUrl, setHaveUrl, setUrlSheet } = useStorage();

  useEffect(() => {
    (async () => {
      try {
        if (!haveUrl) router.replace("/");
        if (haveUrl) router.replace("/home");
      } finally {
        setLoading(false);
      }
    })();
  }, [haveUrl]);

  const handleSubmit = useCallback(() => {
    const ok = checkUrlSpreadSheet(url);
    if (!ok) {
      setError("URL Spreadsheet tidak valid");
      return;
    }
    setError(null);
    AddUrl(url);
    setUrlSheet(url);
    setHaveUrl(true);
    router.push("/home");
  }, [url, setHaveUrl, router]);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }

  // Jika sudah punya URL, tampilkan loading singkat saat redirect
  if (haveUrl) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }

  // Form connect spreadsheet
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="w-[90%] md:w-[50%] mx-auto text-center">
        <h1 className="text-xl font-bold">Selamat Datang di</h1>
        <h2 className="text-2xl font-bold text-green-400">MyCash</h2>
        <p className="text-xs md:text-sm mt-4 font-semibold">
          Aplikasi yang membantu kamu dalam mengelola keuangan dengan mudah.
        </p>

        <div className="mt-16">
          <Card className="w-full md:w-[60%] mx-auto shadow-lg rounded-2xl">
            <CardBody className="p-4">
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="url" className="text-xs font-medium">
                  Masukkan URL SpreadSheet Kamu
                </label>
                <Input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="https://docs.google.com/spreadsheets/d/1Ielw3pi..."
                  size="lg"
                />
              </div>
              <div className="flex w-full justify-center mt-5">
                <Button
                  variant="shadow"
                  color="success"
                  onPress={handleSubmit}
                  className="w-[70%] font-semibold"
                  isDisabled={!url}
                >
                  Access Dashboard
                </Button>
              </div>
              {error && (
                <div className="w-full flex items-center mt-5">
                  <Alert color="danger" title={error} />
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="mt-16 flex flex-col gap-4">
          <Card>
            <CardBody className="p-4 flex flex-col gap-2">
              <h1 className="text-lg font-bold">📄 Connect Spreadsheet</h1>
              <p className="text-sm">
                Sinkron otomatis ke Google Sheets. Data aman, gampang di-export
                & dibagikan.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex flex-col gap-2">
              <h1 className="text-lg font-bold">⚡ Super gampang</h1>
              <p className="text-sm">
                Antarmuka sederhana, 0 ribet. Catat transaksi {"<"} 10 detik.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex flex-col gap-2">
              <h1 className="text-lg font-bold">✅ Laporan keuangan rapi</h1>
              <p className="text-sm">
                Grafik & ringkasan harian / mingguan / bulanan siap pakai.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
