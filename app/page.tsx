"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/alert";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { AddUrl } from "@/src/libs/localstorage";
import { checkUrlSpreadSheet } from "@/src/libs/checkUrl";
import { useStorage } from "@/src/context/StorageProvider";
import HomeLoading from "@/components/HomeLoading";
import ContactDev from "@/components/contact";

export type metadataType = {
  user_agent: string;
  device: string;
  os: string;
  browser: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true); // ← AKTIFKAN LAGI
  const [error, setError] = useState<string | null>(null); // ← AKTIFKAN LAGI
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<metadataType>({
    user_agent: "",
    device: "",
    os: "",
    browser: "",
  });

  const router = useRouter();
  const { haveUrl, setHaveUrl, setUrlSheet, key, setKey } = useStorage();

  useEffect(() => {
    setMetadata({
      user_agent: navigator.userAgent,
      device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      os: navigator.platform,
      browser: navigator.userAgent.includes("Chrome") ? "Chrome" : "Other",
    });
    (async () => {
      try {
        if (!haveUrl) router.replace("/");
        if (haveUrl) router.replace("/home");
      } finally {
        setLoading(false);
      }
    })();
  }, [haveUrl]);

  const handleSubmit = useCallback(async () => {
    const ok = checkUrlSpreadSheet(url);

    if (!ok) {
      setError("URL Spreadsheet tidak valid");

      return;
    }
    if (!key) {
      setError("Key Access tidak valid");

      return;
    }
    try {
      const res = await fetch(`/api/verify`, {
        method: "PATCH",
        body: JSON.stringify({
          key,
          metadata,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);

        return;
      }
      if (data.success) {
        setError(null);
        AddUrl("url", url);
        AddUrl("key", key);
        setUrlSheet(url);
        setHaveUrl(true);
        setKey(key);
        router.push("/home");
      }
    } catch (error) {
      setError("Network Error Please Try Again");
    }
  }, [url, setHaveUrl, router, key]);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }

  if (haveUrl) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }

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
            <CardBody className="p-4 flext flex-col gap-4">
              <div className="w-full flex flex-col gap-4">
                <Input
                  id="url"
                  label="Masukkan URL SpreadSheet"
                  placeholder="https://docs.google.com/spreadsheets/d/1Ielw3pi..."
                  size="md"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <div className="w-full flex flex-col gap-4">
                <Input
                  id="key"
                  label="Masukkan Key Access Kamu"
                  placeholder="ACCESS808"
                  size="md"
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <div className="flex w-full justify-center mt-2">
                <Button
                  className="w-[70%] font-semibold"
                  color="success"
                  isDisabled={!url || !key}
                  variant="shadow"
                  onPress={handleSubmit}
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

        <div className="mt-2 flex flex-col gap-4">
          <ContactDev />
        </div>
      </div>
    </section>
  );
}
