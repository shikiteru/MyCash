import { ChangeEvent, useState } from "react";
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";

import { useStorage } from "../context/StorageProvider";

function toDDMMYYYY(d: CalendarDate | null): string {
  if (!d) return "";
  const js = d.toDate(getLocalTimeZone());
  const dd = String(js.getDate()).padStart(2, "0");
  const mm = String(js.getMonth() + 1).padStart(2, "0");
  const yyyy = js.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

function fromYYYYMMDD(s: string): CalendarDate | null {
  if (!s) return null;
  try {
    return parseDate(s);
  } catch {
    return null;
  }
}

export function useTransaksi() {
  const [pending, setPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const { url } = useStorage();
  const [formValue, setFormValue] = useState({
    tanggal: null as CalendarDate | null,
    deskripsi: "",
    kategori: "",
    jenis: "",
    jumlah: "",
    metode: "",
    catatan: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormValue((p) => ({
      ...p,
      [name]:
        name === "jumlah"
          ? Number((e.target as HTMLInputElement).value)
          : value,
    }));
  };

  const handleTanggalChange = (val: DateValue | null) => {
    setFormValue((p) => ({ ...p, tanggal: (val as CalendarDate) ?? null }));
  };

  const handleSelect =
    (name: "kategori" | "jenis" | "metode") =>
    (keys: "all" | Set<React.Key>) => {
      const first = keys === "all" ? "" : String(Array.from(keys)[0] ?? "");

      setFormValue((p) => ({ ...p, [name]: first }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);
    setPending(true);

    const payload = {
      tanggal: toDDMMYYYY(formValue.tanggal),
      deskripsi: formValue.deskripsi.trim(),
      kategori: formValue.kategori,
      jenis: formValue.jenis,
      jumlah: formValue.jumlah,
      metode: formValue.metode,
      catatan: formValue.catatan.trim(),
      url,
    };

    try {
      const res = await fetch("/api/actionsheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const success = json?.success === true || res.ok;

      setIsSuccess(success);
      setMessage(
        json?.message ||
          (success ? "Berhasil menyimpan data." : "Gagal menyimpan data."),
      );
      setShowAlert(true);

      if (success) {
        setFormValue((p) => ({
          ...p,
          deskripsi: "",
          kategori: "",
          jenis: "",
          jumlah: "",
          metode: "",
          catatan: "",
        }));
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Terjadi kesalahan jaringan.");
      setShowAlert(true);
    } finally {
      setPending(false);
    }
  };

  return {
    formValue,
    handleChange,
    handleSelect,
    handleSubmit,
    handleTanggalChange,
    pending,
    showAlert,
    isSuccess,
    message,
  };
}
