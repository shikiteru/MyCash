"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getUrl } from "../libs/localstorage";

type Ctx = {
  url: string;
  setUrlSheet: (v: string) => void;
  haveUrl: boolean;
  setHaveUrl: (v: boolean) => void;
  hydrated: boolean;
  key: string;
  setKey: (v: string) => void;
};

const StorageContext = createContext<Ctx | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [url, setUrlSheet] = useState("");
  const [haveUrl, setHaveUrl] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    const u = getUrl("url");
    const k = getUrl("key");

    if (u) {
      setUrlSheet(u);
      setHaveUrl(true);
    }
    if (k) {
      setKey(k);
    }
    setHydrated(true); //
  }, []);

  return (
    <StorageContext.Provider
      value={{ url, setUrlSheet, haveUrl, setHaveUrl, hydrated, key, setKey }}
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
