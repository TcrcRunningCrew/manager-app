"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface PushNotificationProviderProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

export function PushNotificationProvider({
  isAdmin,
  children,
}: PushNotificationProviderProps) {
  const { status } = useSession();

  const subscribeToPush = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
    } catch (e) {
      console.error("[push] subscribe failed:", e);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      subscribeToPush();
    }
  }, [status, isAdmin, subscribeToPush]);

  return <>{children}</>;
}
