"use client";
import { useEffect, useRef, useState } from "react";

type Res = { data?: any } | any;

export function useHomeData(url?: string, enabled = false) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchedOnce = useRef(false);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !url) {
      return;
    }

    // reset guard kalau URL berubah
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
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [enabled, url]);

  return { data, loading, error };
}
