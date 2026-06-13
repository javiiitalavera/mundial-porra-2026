"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatUpdatedAt, formatUpdatedTime } from "@/lib/lastUpdated";

export type UpdateStatusPayload = {
  updatedAt?: string;
  error?: string;
  stale?: boolean;
};

const MIN_CHECK_INTERVAL_MS = 10 * 60 * 1000;

export function UpdateStatus({ payload }: { payload: UpdateStatusPayload }) {
  const router = useRouter();
  const lastCheckRef = useRef(0);
  const [checking, setChecking] = useState(false);

  const checkForUpdates = useCallback(
    async (force = false) => {
      const now = Date.now();

      if (!force && now - lastCheckRef.current < MIN_CHECK_INTERVAL_MS) {
        return;
      }

      lastCheckRef.current = now;
      setChecking(true);

      try {
        const response = await fetch("/api/results");
        const data = await response.json().catch(() => null);

        if (data?.updatedAt && data.updatedAt !== payload.updatedAt) {
          router.refresh();
          return;
        }
      } catch {
        // No enseñamos errores técnicos al usuario.
      } finally {
        window.setTimeout(() => setChecking(false), 450);
      }
    },
    [payload.updatedAt, router]
  );

  useEffect(() => {
    const onFocus = () => void checkForUpdates(false);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkForUpdates(false);
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [checkForUpdates]);

  if (checking) {
    return (
      <button type="button" className="update-status checking" onClick={() => void checkForUpdates(true)}>
        <span aria-hidden="true" />
        <strong>Buscando actualización...</strong>
      </button>
    );
  }

  if (!payload.updatedAt) {
    return (
      <button type="button" className="update-status neutral" onClick={() => void checkForUpdates(true)}>
        <span aria-hidden="true" />
        <strong>Esperando actualización</strong>
      </button>
    );
  }

  if (payload.error || payload.stale) {
    return (
      <button type="button" className="update-status warning" onClick={() => void checkForUpdates(true)}>
        <span aria-hidden="true" />
        <strong>Últimos datos disponibles</strong>
        <small>{formatUpdatedTime(payload.updatedAt)}</small>
      </button>
    );
  }

  return (
    <button type="button" className="update-status ok" onClick={() => void checkForUpdates(true)}>
      <span aria-hidden="true" />
      <strong>{formatUpdatedAt(payload.updatedAt)}</strong>
    </button>
  );
}
