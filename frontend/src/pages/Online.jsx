import React,{ useState, useEffect } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && (
        <div style={{ background: "red", color: "white", padding: "10px", textAlign: "center" }}>
          🚨 Network is not connected!
        </div>
      )}
      <h1>{isOnline ? "You are online ✅" : "You are offline ❌"}</h1>
    </div>
  );
}
