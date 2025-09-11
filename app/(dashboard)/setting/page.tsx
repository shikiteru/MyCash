"use client";

import HomeLoading from "@/components/HomeLoading";
import { DeleteIcon, ListIcon } from "@/components/icons";
import { useStorage } from "@/src/context/StorageProvider";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { useSetting } from "@/src/hooks/useSetting";
import { clearCustomData } from "@/src/libs/localstorage";
import ContactDev from "@/components/contact";

export default function SettingDashboard() {
  const { haveUrl, setHaveUrl } = useStorage();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    kategori,
    metode,
    SaveKategori,
    SaveMetode,
    kategoriList,
    metodeList,
    loadingKategori,
    loadingMetode,
    loadingReset,
    handleKategori,
    handleMetode,
    RemoveKategori,
    RemoveMetode,
    canSaveKategori,
    canSaveMetode,
    ResetUrl,
  } = useSetting();

  const doResetUrl = () => {
    try {
      clearCustomData();
      setHaveUrl?.(false);
      router.push("/");
    } catch {}
  };

  useEffect(() => {
    if (!haveUrl) {
      router.push("/");
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [haveUrl, router]);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <HomeLoading />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="w-full h-full mt-16">
        <Card className="p-2 w-full md:w-[50%] mx-auto">
          <CardHeader>
            <h2 className="text-xl font-semibold ">Setting</h2>
          </CardHeader>
          <CardBody className="flex gap-6">
            <div className="flex flex-row gap-2 items-center">
              <Input
                className="max-w-full"
                label="Tambah Kategori baru"
                size="md"
                placeholder="Masukkan Kategori baru"
                value={kategori}
                onChange={handleKategori}
              />
              <Button
                variant="shadow"
                color="success"
                className="font-semibold"
                onPress={SaveKategori}
                isLoading={loadingKategori}
                isDisabled={!canSaveKategori}
              >
                Tambah
              </Button>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Input
                className="max-w-full"
                label="Tambah pembayaran baru"
                size="md"
                placeholder="Masukkan Metode baru"
                value={metode}
                onChange={handleMetode}
              />
              <Button
                variant="solid"
                color="success"
                className="font-semibold"
                onPress={SaveMetode}
                isLoading={loadingMetode}
                isDisabled={!canSaveMetode}
              >
                Tambah
              </Button>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Button
                endContent={<DeleteIcon />}
                type="submit"
                variant="solid"
                color="danger"
                className="w-full font-semibold"
                onPress={() => ResetUrl(doResetUrl)}
                isLoading={loadingReset}
              >
                Reset Url Spreadsheet
              </Button>
            </div>
          </CardBody>
        </Card>

        <Accordion variant="shadow" className="w-[90%] md:w-[50%] mx-auto mt-4">
          <AccordionItem
            key="1"
            aria-label="List Kategori Baru"
            title="List Kategori Baru"
            startContent={<ListIcon />}
          >
            {kategoriList.length === 0 ? (
              <p className="text-sm text-default-500">
                Belum ada kategori custom.
              </p>
            ) : (
              <ul className="space-y-2">
                {kategoriList.map((k, idx) => (
                  <li
                    key={`${k}-${idx}`}
                    className="flex items-center justify-between"
                  >
                    <span>{k}</span>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => RemoveKategori(k)}
                    >
                      Hapus
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </AccordionItem>

          <AccordionItem
            key="2"
            aria-label="List Metode Pembayaran"
            title="List Metode Pembayaran"
            startContent={<ListIcon />}
          >
            {metodeList.length === 0 ? (
              <p className="text-sm text-default-500">
                Belum ada metode pembayaran custom.
              </p>
            ) : (
              <ul className="space-y-2">
                {metodeList.map((m, idx) => (
                  <li
                    key={`${m}-${idx}`}
                    className="flex items-center justify-between"
                  >
                    <span>{m}</span>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => RemoveMetode(m)}
                    >
                      Hapus
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </AccordionItem>
        </Accordion>
        <div className="mt-4 flex flex-col gap-4">
          <ContactDev />
        </div>
      </div>
    </section>
  );
}
