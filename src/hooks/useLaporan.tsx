import { useCallback, useEffect, useMemo, useState } from "react";
import { getSpreadSheetId } from "../libs/checkUrl";

type Row = any;

export function useLaporan(url?: string, enabled = false) {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!enabled || !url) return;

    const ac = new AbortController();
    (async () => {
      try {
        if (initialLoad) setLoading(true);
        setError(null);

        const spreadsheetId = getSpreadSheetId(url);
        if (!spreadsheetId) throw new Error("Spreadsheet ID tidak valid");

        const res = await fetch(`/api/laporan?id=${spreadsheetId}`, {
          signal: ac.signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`);
        const json = await res.json();

        if (ac.signal.aborted) return;
        const rows: Row[] = Array.isArray(json) ? json : (json.data ?? []);
        setData(rows ?? []);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError"))
          setError(e);
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    })();

    return () => ac.abort();
  }, [enabled, url, refreshKey]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refetch,
      setData,
      initialLoad,
    }),
    [data, loading, error, refetch, initialLoad]
  );
}
