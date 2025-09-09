"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUrl } from "../libs/localstorage";

type Ctx = {
  url: string;
  setUrlSheet: (v: string) => void;
  haveUrl: boolean;
  setHaveUrl: (v: boolean) => void;
  hydrated: boolean; // ← tambahkan
};

const StorageContext = createContext<Ctx | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [url, setUrlSheet] = useState("");
  const [haveUrl, setHaveUrl] = useState(false);
  const [hydrated, setHydrated] = useState(false); // ← tambahkan

  useEffect(() => {
    const u = getUrl(); // baca dari localStorage
    if (u) {
      setUrlSheet(u);
      setHaveUrl(true);
    }
    setHydrated(true); // ← tandai sudah siap
  }, []);

  return (
    <StorageContext.Provider
      value={{ url, setUrlSheet, haveUrl, setHaveUrl, hydrated }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export const useStorage = () => {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage must be used within StorageProvider");
  return ctx;
};
