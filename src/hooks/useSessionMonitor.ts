/**
 * useSessionMonitor Hook
 * Monitors user session and redirects if not logged in
 */
import { useEffect } from "react";
import { startSessionMonitor, stopSessionMonitor } from "../api";

export function useSessionMonitor() {
  useEffect(() => {
    const intervalId = startSessionMonitor();

    return () => {
      stopSessionMonitor(intervalId);
    };
  }, []);
}
