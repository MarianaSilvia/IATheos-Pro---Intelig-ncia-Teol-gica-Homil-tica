import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
export function useResource<T>(path: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const request = useRef(0);
  const reload = useCallback(async () => {
    const seq = ++request.current;
    setLoading(true);
    setError("");
    try {
      const result = await api<T>(path);
      if (seq === request.current) setData(result);
    } catch (e) {
      if (seq === request.current) setError((e as Error).message);
    } finally {
      if (seq === request.current) setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    void reload();
    return () => {
      request.current++;
    };
  }, [reload]);
  return { data, setData, error, loading, reload };
}
