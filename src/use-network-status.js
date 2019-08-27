import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const toggleNetworkState = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", toggleNetworkState);
    window.addEventListener("offline", toggleNetworkState);

    return () => {
      window.removeEventListener("online", toggleNetworkState);
      window.removeEventListener("offline", toggleNetworkState);
    };
  }, []);

  return { isOnline };
}
