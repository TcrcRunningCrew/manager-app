"use client";

import { useState, useEffect, useTransition } from "react";
import { sendTestPushAction } from "../actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const out = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) out[i] = rawData.charCodeAt(i);
  return out;
}

interface AdminPushStatus {
  accountId: string;
  name: string;
  hasSub: boolean;
}

interface Props {
  adminPushStatus: AdminPushStatus[];
}

export function AdminPushSettings({ adminPushStatus }: Props) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testPending, startTest] = useTransition();
  const [testMsg, setTestMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) return;
    setPermission(Notification.permission);
    navigator.serviceWorker?.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setIsSubscribed(!!sub))
    );
  }, []);

  const handleEnable = async () => {
    if (!VAPID_PUBLIC_KEY) {
      alert("VAPID 키가 설정되지 않았습니다. SETUP_PUSH.md를 확인해주세요.");
      return;
    }
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") { setLoading(false); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });
      setIsSubscribed(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker?.ready;
      const sub = await reg?.pushManager.getSubscription();
      await sub?.unsubscribe();
      await fetch("/api/push/unsubscribe", { method: "POST" });
      setIsSubscribed(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleTest = () => {
    startTest(async () => {
      setTestMsg(null);
      const res = await sendTestPushAction();
      setTestMsg(res.ok ? "✅ 전송 완료!" : "❌ 실패");
      setTimeout(() => setTestMsg(null), 4000);
    });
  };

  const permLabel = { granted: "✅ 허용됨", denied: "🚫 차단됨", default: "⚪ 미설정" }[permission];

  const cardStyle = {
    background: "var(--tcrc-bg-surface)",
    border: "1px solid var(--tcrc-line)",
    borderRadius: 12,
    padding: 16,
  };
  const sectionTitle = {
    fontWeight: 700, color: "var(--tcrc-text-primary)", fontSize: 14, marginBottom: 12,
  };
  const row = { display: "flex", justifyContent: "space-between" as const, alignItems: "center" as const, marginBottom: 10 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 내 알림 상태 */}
      <div style={cardStyle}>
        <div style={sectionTitle}>내 알림 설정</div>
        <div style={row}>
          <span style={{ color: "var(--tcrc-text-secondary)", fontSize: 13 }}>권한</span>
          <span style={{ color: "var(--tcrc-text-primary)", fontSize: 13, fontWeight: 600 }}>{permLabel}</span>
        </div>
        <div style={{ ...row, marginBottom: 14 }}>
          <span style={{ color: "var(--tcrc-text-secondary)", fontSize: 13 }}>구독</span>
          <span style={{ color: "var(--tcrc-text-primary)", fontSize: 13, fontWeight: 600 }}>
            {isSubscribed ? "🔔 구독 중" : "🔕 미구독"}
          </span>
        </div>
        {permission === "denied" ? (
          <div style={{
            background: "rgba(255,92,77,0.1)", border: "1px solid rgba(255,92,77,0.3)",
            borderRadius: 8, padding: "10px 12px", color: "var(--tcrc-accent-red)", fontSize: 13,
          }}>
            브라우저 설정에서 알림 권한을 허용해주세요.
          </div>
        ) : (
          <button
            onClick={isSubscribed ? handleDisable : handleEnable}
            disabled={loading}
            style={{
              width: "100%", padding: 12, borderRadius: 10, border: "none",
              background: isSubscribed ? "var(--tcrc-bg-muted)" : "#C8FF3E",
              color: isSubscribed ? "var(--tcrc-text-primary)" : "#0B0D10",
              fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "처리 중..." : isSubscribed ? "알림 끄기" : "알림 켜기"}
          </button>
        )}
      </div>

      {/* 테스트 발송 */}
      <div style={cardStyle}>
        <div style={sectionTitle}>테스트 발송</div>
        <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 13, marginBottom: 12 }}>
          구독 중인 모든 운영진에게 테스트 푸시를 발송합니다.
        </div>
        {testMsg && (
          <div style={{ marginBottom: 10, fontSize: 14, fontWeight: 600, color: "var(--tcrc-text-primary)" }}>
            {testMsg}
          </div>
        )}
        <button
          onClick={handleTest}
          disabled={testPending}
          style={{
            width: "100%", padding: 12, borderRadius: 10,
            border: "1px solid var(--tcrc-line)", background: "var(--tcrc-bg-muted)",
            color: "var(--tcrc-text-primary)", fontWeight: 700, fontSize: 14,
            cursor: testPending ? "not-allowed" : "pointer", opacity: testPending ? 0.7 : 1,
          }}
        >
          {testPending ? "발송 중..." : "테스트 푸시 전송"}
        </button>
      </div>

      {/* 운영진 현황 */}
      <div style={cardStyle}>
        <div style={sectionTitle}>운영진 수신 현황</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {adminPushStatus.length === 0 ? (
            <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 13 }}>운영진이 없습니다.</div>
          ) : (
            adminPushStatus.map((a) => (
              <div key={a.accountId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--tcrc-text-secondary)", fontSize: 14 }}>{a.name}</span>
                <span style={{ fontSize: 13 }}>{a.hasSub ? "🔔 수신 중" : "🔕 미설정"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
