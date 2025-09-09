import { useEffect, useRef, useState } from "react";
import { getSpreadSheetId } from "../libs/checkUrl";
type Res = { data?: any } | any;

export function useLaporan(url?: string, enabled = false) {
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
        const id = getSpreadSheetId(url);
        fetchedOnce.current = true;
        lastUrlRef.current = url;
        setLoading(true);
        setError(null);
        const res = await fetch("/api/laporan?id=" + id);
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

  return {
    data,
    loading,
    error,
  };
}
