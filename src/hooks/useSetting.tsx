import { useEffect, useMemo, useState } from "react";
import {
  AddCustomData,
  getCustomData,
  removeCustomData,
} from "../libs/localstorage";

type SaveKey = "kategori" | "metode";

function readList(key: SaveKey): string[] {
  const raw = getCustomData(key);
  // pastikan array of string
  return Array.isArray(raw) ? raw.map(String) : [];
}

function writeList(key: SaveKey, list: string[]) {
  AddCustomData(key, list);
}

export function useSetting() {
  const [kategori, setKategori] = useState("");
  const [metode, setMetode] = useState("");
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [metodeList, setMetodeList] = useState<string[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingMetode, setLoadingMetode] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleKategori = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKategori(e.target.value);
  const handleMetode = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMetode(e.target.value);
  function capitalizeWords(str: string) {
    return str
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const normalize = (s: string) => s.trim();
  const existsInsensitive = (list: string[], val: string) =>
    list.some((x) => x.toLowerCase() === val.toLowerCase());

  async function SaveKategori() {
    const val = normalize(kategori);
    if (!val) return;

    setLoadingKategori(true);
    try {
      const current = readList("kategori");
      if (!existsInsensitive(current, val)) {
        const next = [...current, capitalizeWords(val)].sort((a, b) =>
          a.localeCompare(b)
        );
        writeList("kategori", next);
        setKategoriList(next);
      }
      setKategori("");
    } finally {
      setLoadingKategori(false);
    }
  }

  async function SaveMetode() {
    const val = normalize(metode);
    if (!val) return;

    setLoadingMetode(true);
    try {
      const current = readList("metode");
      if (!existsInsensitive(current, capitalizeWords(val))) {
        const next = [...current, capitalizeWords(val)].sort((a, b) =>
          a.localeCompare(b)
        );
        writeList("metode", next);
        setMetodeList(next);
      }
      setMetode("");
    } finally {
      setLoadingMetode(false);
    }
  }

  function RemoveKategori(value: string) {
    removeCustomData("kategori", value);
    setKategoriList(getCustomData("kategori"));
  }

  function RemoveMetode(value: string) {
    removeCustomData("metode", value);
    setMetodeList(getCustomData("metode"));
  }

  async function ResetUrl(doReset: () => void) {
    setLoadingReset(true);
    try {
      doReset();
    } finally {
      setLoadingReset(false);
    }
  }

  useEffect(() => {
    setKategoriList(readList("kategori"));
    setMetodeList(readList("metode"));
  }, []);

  // Untuk men-disable tombol jika duplikat / kosong
  const canSaveKategori = useMemo(() => {
    const v = normalize(kategori);
    return !!v && !existsInsensitive(kategoriList, v);
  }, [kategori, kategoriList]);

  const canSaveMetode = useMemo(() => {
    const v = normalize(metode);
    return !!v && !existsInsensitive(metodeList, v);
  }, [metode, metodeList]);

  return {
    // values
    kategori,
    metode,
    kategoriList,
    metodeList,

    // setters
    setKategori,
    setMetode,

    // handlers
    handleKategori,
    handleMetode,
    SaveKategori,
    SaveMetode,
    RemoveKategori,
    RemoveMetode,

    // loading flags per button
    loadingKategori,
    loadingMetode,
    loadingReset,

    // helpers
    canSaveKategori,
    canSaveMetode,
    ResetUrl,
  };
}
