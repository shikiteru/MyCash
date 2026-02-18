"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useStorage } from "../context/StorageProvider";
type Res = { data?: any } | any;

export function useHomeData(url?: string, enabled = false) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const router = useRouter();
  const fetchedOnce = useRef(false);
  const lastUrlRef = useRef<string | null>(null);
  const { setHaveUrl, setUrlSheet } = useStorage();

  useEffect(() => {
    if (!enabled || !url) {
      return;
    }

    if (lastUrlRef.current !== url) {
      fetchedOnce.current = false;
    }

    if (fetchedOnce.current) return;
    const run = async () => {
      try {
        fetchedOnce.current = true;
        lastUrlRef.current = url;
        setLoading(true);
        setError(null);

        const res = await fetch("/api/homesheets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          cache: "no-store",
        });

        const json: Res = await res.json();
        const rows = Array.isArray(json) ? json : (json.data ?? null);

        setData(rows);
      } catch (e: any) {
        setError(e);
        localStorage.clear();
        setHaveUrl(false);
        setUrlSheet("");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [enabled, url]);

  return { data, loading, error };
}
