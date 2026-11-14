import { useState, useEffect, useCallback } from "react";

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!res.ok) {
        let msg = `Server replied HTTP ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody.error) msg = errBody.error;
        } catch {
          // fallback to status text
        }
        throw new Error(msg);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to fetch data.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, loading, error, refetch: fetchData };
}
