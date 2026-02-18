"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";

import { useStorage } from "@/src/context/StorageProvider";
import { DeleteIcon, ListIcon } from "@/components/icons";
import HomeLoading from "@/components/HomeLoading";
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
                placeholder="Masukkan Kategori baru"
                size="md"
                value={kategori}
                onChange={handleKategori}
              />
              <Button
                className="font-semibold"
                color="success"
                isDisabled={!canSaveKategori}
                isLoading={loadingKategori}
                variant="shadow"
                onPress={SaveKategori}
              >
                Tambah
              </Button>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Input
                className="max-w-full"
                label="Tambah pembayaran baru"
                placeholder="Masukkan Metode baru"
                size="md"
                value={metode}
                onChange={handleMetode}
              />
              <Button
                className="font-semibold"
                color="success"
                isDisabled={!canSaveMetode}
                isLoading={loadingMetode}
                variant="solid"
                onPress={SaveMetode}
              >
                Tambah
              </Button>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Button
                className="w-full font-semibold"
                color="danger"
                endContent={<DeleteIcon />}
                isLoading={loadingReset}
                type="submit"
                variant="solid"
                onPress={() => ResetUrl(doResetUrl)}
              >
                Reset Url Spreadsheet
              </Button>
            </div>
          </CardBody>
        </Card>

        <Accordion className="w-[90%] md:w-[50%] mx-auto mt-4" variant="shadow">
          <AccordionItem
            key="1"
            aria-label="List Kategori Baru"
            startContent={<ListIcon />}
            title="List Kategori Baru"
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
                      color="danger"
                      size="sm"
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
            startContent={<ListIcon />}
            title="List Metode Pembayaran"
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
                      color="danger"
                      size="sm"
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
        <div className="my-4 flex flex-col gap-4">
          <ContactDev />
        </div>
      </div>
    </section>
  );
}
