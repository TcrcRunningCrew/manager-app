# PWA + Push Notifications + Admin Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** PWA 설치 유도 + 운영진 전용 출석 푸시 알림 + 관리자 페이지 구현

**Architecture:** `next-pwa` 없이 Next.js 14 App Router 기본 기능으로 PWA 구성 (manifest.ts, icon.tsx), Web Push API + `web-push` npm으로 서버 측 푸시 발송, Supabase `push_subscriptions` 테이블에 구독 저장. 관리자 페이지는 `/admin` RSC + Server Actions 패턴.

**Tech Stack:** Next.js 14 App Router, web-push, next/og ImageResponse, Supabase (tcrc schema), next-auth v4

---

## Task 1: 패키지 설치

**Files:**
- Modify: `package.json`

**Step 1: web-push 설치**

```bash
cd /Users/whs-95/Desktop/tcrc/manager-app
npm install web-push
npm install --save-dev @types/web-push
```

Expected: `package.json`에 `web-push` 추가됨

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install web-push for push notifications"
```

---

## Task 2: PWA Manifest + 아이콘 생성

**Files:**
- Create: `src/app/manifest.ts`
- Create: `src/app/icon.tsx`
- Create: `src/app/apple-icon.tsx`
- Create: `src/app/api/icons/[size]/route.tsx`

**Step 1: Dynamic Manifest 생성**

`src/app/manifest.ts`:
```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "T.C.R.C 러닝크루",
    short_name: "TCRC",
    description: "T.C.R.C 러닝크루 출석 및 관리",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0D10",
    theme_color: "#C8FF3E",
    orientation: "portrait",
    categories: ["sports", "fitness"],
    icons: [
      {
        src: "/api/icons/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
  };
}
```

**Step 2: Icon API Route (192 & 512)**

`src/app/api/icons/[size]/route.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(
  _req: NextRequest,
  { params }: { params: { size: string } }
) {
  const size = params.size === "512" ? 512 : 192;
  const fontSize = size === 512 ? 140 : 52;
  const subFontSize = size === 512 ? 56 : 20;
  const circleSize = size * 0.72;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10",
        }}
      >
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1A1F27 0%, #0B0D10 100%)",
            border: `${size * 0.025}px solid #C8FF3E`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: size * 0.02,
          }}
        >
          <div
            style={{
              color: "#C8FF3E",
              fontSize: fontSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            TCRC
          </div>
          <div
            style={{
              color: "#6B7480",
              fontSize: subFontSize,
              fontWeight: 600,
              letterSpacing: "0.1em",
            }}
          >
            러닝크루
          </div>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
```

**Step 3: App icon.tsx (favicon)**

`src/app/icon.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10",
          borderRadius: 8,
          border: "1.5px solid #C8FF3E",
        }}
      >
        <div
          style={{
            color: "#C8FF3E",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "-0.5px",
          }}
        >
          TC
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "-0.5px",
          }}
        >
          RC
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Step 4: Apple icon.tsx (iOS 홈화면 아이콘)**

`src/app/apple-icon.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "#0B0D10",
            border: "4px solid #C8FF3E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              color: "#C8FF3E",
              fontSize: 46,
              fontWeight: 900,
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            TCRC
          </div>
          <div
            style={{
              color: "#6B7480",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            러닝크루
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Step 5: layout.tsx PWA 메타 태그 추가**

`src/app/layout.tsx` metadata 오브젝트에 다음 추가:
```ts
export const metadata: Metadata = {
  // ... 기존 내용 유지 ...
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TCRC",
  },
  formatDetection: {
    telephone: false,
  },
};
```

viewport에 `themeColor` 추가:
```ts
export const viewport: Viewport = {
  // ... 기존 ...
  themeColor: "#C8FF3E",
};
```

**Step 6: Commit**

```bash
git add src/app/manifest.ts src/app/icon.tsx src/app/apple-icon.tsx src/app/api/icons/ src/app/layout.tsx
git commit -m "feat: add PWA manifest and app icons"
```

---

## Task 3: Service Worker 생성

**Files:**
- Create: `public/sw.js`

**Step 1: Service Worker 파일 생성**

`public/sw.js`:
```js
// T.C.R.C Service Worker
const CACHE_NAME = "tcrc-v1";
const OFFLINE_URLS = ["/", "/checkout", "/ranking"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // navigation 요청만 캐시 폴백 처리 (API/Supabase는 항상 네트워크)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((r) => r || caches.match("/"))
      )
    );
  }
});

// 푸시 알림 수신
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "T.C.R.C", body: event.data.text() };
  }

  const options = {
    body: data.body,
    icon: "/api/icons/192",
    badge: "/api/icons/192",
    tag: "tcrc-attendance",
    renotify: true,
    data: { url: data.url || "/" },
    actions: [{ action: "open", title: "앱 열기" }],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "T.C.R.C", options)
  );
});

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
```

**Step 2: Commit**

```bash
git add public/sw.js
git commit -m "feat: add service worker for PWA and push notifications"
```

---

## Task 4: VAPID 환경변수 설정 + web-push 초기화

**Files:**
- Create: `src/lib/push/vapid.ts`
- Create: `scripts/generate-vapid-keys.mjs`

**Step 1: VAPID 키 생성 스크립트**

`scripts/generate-vapid-keys.mjs`:
```mjs
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log("\n=== VAPID Keys Generated ===\n");
console.log("Add to your .env.local:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@tcrc.com`);
console.log("\n=============================\n");
```

**Step 2: web-push 서버 초기화 모듈**

`src/lib/push/vapid.ts`:
```ts
import webpush from "web-push";
import { getAdminSubscriptions } from "@/lib/domain/push/subscriptions";

const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@tcrc.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  if (!publicKey || !privateKey) {
    console.warn("[push] VAPID keys not configured; skipping push");
    return;
  }

  const subscriptions = await getAdminSubscriptions();
  if (subscriptions.length === 0) return;

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        sub.subscription as webpush.PushSubscription,
        JSON.stringify(payload)
      )
    )
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.warn(`[push] ${failed.length}/${subscriptions.length} push(es) failed`);
  }
}
```

**Step 3: Commit**

```bash
git add src/lib/push/ scripts/
git commit -m "feat: add web-push VAPID setup and sendPushToAdmins"
```

---

## Task 5: Supabase Domain Layer — Push Subscriptions

**Files:**
- Create: `src/lib/domain/push/subscriptions.ts`

**Step 1: DB 쿼리 함수 작성**

`src/lib/domain/push/subscriptions.ts`:
```ts
import { supabaseServer } from "@/lib/supabase/server";

export type PushSubscriptionRow = {
  account_id: string;
  subscription: object;
};

// 운영진의 푸시 구독 목록 조회
export async function getAdminSubscriptions(): Promise<PushSubscriptionRow[]> {
  const { data, error } = await supabaseServer
    .from("user")
    .select('accountId, push_subscriptions!inner(subscription)')
    .eq("isAdmin", true);

  if (error) {
    console.error("[push] getAdminSubscriptions error:", error);
    return [];
  }

  // join 결과 플랫하게 변환
  return (data ?? []).flatMap((row: any) => {
    const subs = Array.isArray(row.push_subscriptions)
      ? row.push_subscriptions
      : [row.push_subscriptions];
    return subs
      .filter(Boolean)
      .map((s: any) => ({ account_id: row.accountId, subscription: s.subscription }));
  });
}

// 구독 저장 (upsert — 기기당 1개)
export async function upsertPushSubscription(
  accountId: string,
  subscription: object
): Promise<void> {
  const { error } = await supabaseServer
    .from("push_subscriptions")
    .upsert(
      { account_id: accountId, subscription },
      { onConflict: "account_id" }
    );

  if (error) throw error;
}

// 구독 삭제
export async function deletePushSubscription(accountId: string): Promise<void> {
  const { error } = await supabaseServer
    .from("push_subscriptions")
    .delete()
    .eq("account_id", accountId);

  if (error) throw error;
}

// 특정 유저의 구독 여부 확인
export async function hasPushSubscription(accountId: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from("push_subscriptions")
    .select("account_id")
    .eq("account_id", accountId)
    .limit(1);

  if (error) return false;
  return (data?.length ?? 0) > 0;
}
```

**Step 2: Commit**

```bash
git add src/lib/domain/push/
git commit -m "feat: add push subscription domain layer"
```

---

## Task 6: Push API Routes

**Files:**
- Create: `src/app/api/push/subscribe/route.ts`
- Create: `src/app/api/push/unsubscribe/route.ts`

**Step 1: Subscribe route**

`src/app/api/push/subscribe/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { upsertPushSubscription } from "@/lib/domain/push/subscriptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscription } = await request.json();
  if (!subscription?.endpoint) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await upsertPushSubscription(session.user.id, subscription);
  return NextResponse.json({ ok: true });
}
```

**Step 2: Unsubscribe route**

`src/app/api/push/unsubscribe/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { deletePushSubscription } from "@/lib/domain/push/subscriptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deletePushSubscription(session.user.id);
  return NextResponse.json({ ok: true });
}
```

**Step 3: Commit**

```bash
git add src/app/api/push/
git commit -m "feat: add push subscribe/unsubscribe API routes"
```

---

## Task 7: checkoutAction에 푸시 알림 연동

**Files:**
- Modify: `src/app/(main)/checkout/actions.ts`

**Step 1: LOCATION_MAP 정의 및 sendPushToAdmins 호출 추가**

`src/app/(main)/checkout/actions.ts` 파일 상단에 import 추가:
```ts
import { sendPushToAdmins } from "@/lib/push/vapid";
```

`LOCATION_MAP` 상수를 파일 상단 (ALLOWED_LOCATION 근처)에 추가:
```ts
const LOCATION_MAP: Record<string, string> = {
  "1": "태평_탄천",
  "2": "서현_황새울공원",
  "3": "야탑_탄천종합운동장",
  "4": "모란_성남종합운동장",
  "5": "위례",
  "6": "정자",
  "7": "판교",
  "8": "그 외",
};
```

Slack 알림 바로 아래 (try/catch 블록 후)에 푸시 알림 추가:
```ts
// 푸시 알림 (운영진 전용, 비치명적)
try {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const locationLabel = LOCATION_MAP[location] ?? location;

  await sendPushToAdmins({
    title: "🏃 출석 알림",
    body: `${username}님이 ${locationLabel}에서 ${month}월 ${day}일 ${hour}:${minute} 출석했습니다`,
    url: "/admin",
  });
} catch (e) {
  console.error("[checkout] push notification failed:", e);
}
```

**Step 2: Commit**

```bash
git add src/app/(main)/checkout/actions.ts
git commit -m "feat: send push notification to admins on checkout"
```

---

## Task 8: PWA Install Banner 컴포넌트

**Files:**
- Create: `src/components/molecules/PwaInstallBanner.tsx`

**Step 1: 배너 컴포넌트 생성**

`src/components/molecules/PwaInstallBanner.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 이미 설치됐으면 숨김
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }
    // localStorage에 dismiss 기록 있으면 숨김
    if (localStorage.getItem("pwa-banner-dismissed")) {
      setDismissed(true);
      return;
    }

    // iOS 감지
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-banner-dismissed", "1");
    setDismissed(true);
    setDeferredPrompt(null);
  };

  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 20px 32px",
        background: "var(--tcrc-bg-surface)",
        borderTop: "1px solid var(--tcrc-line)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {/* 앱 아이콘 */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#0B0D10",
            border: "1.5px solid #C8FF3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{ color: "#C8FF3E", fontWeight: 900, fontSize: 13, letterSpacing: "-0.5px" }}
          >
            TCRC
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "var(--tcrc-text-primary)",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 2,
            }}
          >
            홈화면에 추가하기
          </div>
          <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 13 }}>
            {isIOS
              ? "Safari 하단 공유 버튼 → 홈 화면에 추가"
              : "앱처럼 빠르게 출석체크"}
          </div>
        </div>
        {/* 닫기 */}
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            color: "var(--tcrc-text-tertiary)",
            fontSize: 22,
            cursor: "pointer",
            padding: "4px 8px",
          }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {!isIOS && (
        <button
          onClick={handleInstall}
          style={{
            background: "#C8FF3E",
            color: "#0B0D10",
            border: "none",
            borderRadius: 10,
            padding: "13px",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            letterSpacing: "-0.01em",
          }}
        >
          지금 설치
        </button>
      )}
    </div>
  );
}
```

**Step 2: layout.tsx에 PwaInstallBanner 추가**

`src/app/layout.tsx` body에 PwaInstallBanner 추가:
```tsx
import { PwaInstallBanner } from "@/components/molecules/PwaInstallBanner";

// body 내 SessionProvider 안에 추가:
<PwaInstallBanner />
```

**Step 3: Service Worker 등록을 layout.tsx에 스크립트로 추가**

`src/app/layout.tsx` `<head>` 안에 추가:
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').catch(console.error);
        });
      }
    `,
  }}
/>
```

**Step 4: Commit**

```bash
git add src/components/molecules/PwaInstallBanner.tsx src/app/layout.tsx
git commit -m "feat: add PWA install banner and service worker registration"
```

---

## Task 9: PushNotificationProvider (운영진 구독 관리)

**Files:**
- Create: `src/components/providers/PushNotificationProvider.tsx`

**Step 1: Provider 생성**

`src/components/providers/PushNotificationProvider.tsx`:
```tsx
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
      if (existing) return; // 이미 구독 중

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
    // 운영진이 로그인된 경우에만 자동 구독 시도
    if (status === "authenticated" && isAdmin) {
      subscribeToPush();
    }
  }, [status, isAdmin, subscribeToPush]);

  return <>{children}</>;
}
```

**Note:** 이 Provider는 Admin 페이지에서 사용자의 isAdmin 상태를 가져온 후 클라이언트로 넘겨야 함. layout.tsx가 아닌 admin page에서만 사용.

**Step 2: Commit**

```bash
git add src/components/providers/PushNotificationProvider.tsx
git commit -m "feat: add PushNotificationProvider for admin auto-subscribe"
```

---

## Task 10: Admin Domain Layer

**Files:**
- Create: `src/lib/domain/admin/queries.ts`
- Create: `src/lib/domain/admin/mutations.ts`

**Step 1: Admin 쿼리 함수**

`src/lib/domain/admin/queries.ts`:
```ts
import { supabaseServer } from "@/lib/supabase/server";

export type AdminUser = {
  accountId: string;
  name: string;
  email: string;
  birthYear: string;
  activation: boolean;
  isAdmin: boolean;
};

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabaseServer
    .from("user")
    .select("accountId, name, email, birthYear, activation, isAdmin")
    .order("name");

  if (error) throw error;
  return (data ?? []) as AdminUser[];
}

export async function isAdminUser(accountId: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from("user")
    .select("isAdmin")
    .eq("accountId", accountId)
    .single();

  if (error) return false;
  return data?.isAdmin === true;
}

export type RecentCheckout = {
  name: string;
  birthYear: string;
  meeting_date: string;
  activation: string;
  location: string;
  founder: boolean;
};

export async function getRecentCheckouts(limit = 30): Promise<RecentCheckout[]> {
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("name, birthYear, meeting_date, activation, location, founder")
    .order("meeting_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as RecentCheckout[];
}

export async function getAdminPushStatus(): Promise<{ accountId: string; name: string; hasSub: boolean }[]> {
  const { data, error } = await supabaseServer
    .from("user")
    .select("accountId, name, push_subscriptions(account_id)")
    .eq("isAdmin", true);

  if (error) return [];

  return (data ?? []).map((row: any) => ({
    accountId: row.accountId,
    name: row.name,
    hasSub: Array.isArray(row.push_subscriptions)
      ? row.push_subscriptions.length > 0
      : !!row.push_subscriptions,
  }));
}
```

**Step 2: Admin 뮤테이션 함수**

`src/lib/domain/admin/mutations.ts`:
```ts
import { supabaseServer } from "@/lib/supabase/server";

export async function setUserAdminStatus(accountId: string, isAdmin: boolean): Promise<void> {
  const { error } = await supabaseServer
    .from("user")
    .update({ isAdmin })
    .eq("accountId", accountId);

  if (error) throw error;
}

export async function setUserActivation(accountId: string, activation: boolean): Promise<void> {
  const { error } = await supabaseServer
    .from("user")
    .update({ activation })
    .eq("accountId", accountId);

  if (error) throw error;
}
```

**Step 3: Commit**

```bash
git add src/lib/domain/admin/
git commit -m "feat: add admin domain layer (queries + mutations)"
```

---

## Task 11: Admin Page Server Actions

**Files:**
- Create: `src/app/(main)/admin/actions.ts`

**Step 1: Server Actions 작성**

`src/app/(main)/admin/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser } from "@/lib/domain/admin/queries";
import { setUserAdminStatus, setUserActivation } from "@/lib/domain/admin/mutations";
import { sendPushToAdmins } from "@/lib/push/vapid";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const ok = await isAdminUser(session.user.id);
  if (!ok) throw new Error("Forbidden");
  return session.user.id;
}

export async function toggleAdminAction(accountId: string, isAdmin: boolean) {
  await requireAdmin();
  await setUserAdminStatus(accountId, isAdmin);
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleActivationAction(accountId: string, activation: boolean) {
  await requireAdmin();
  await setUserActivation(accountId, activation);
  revalidatePath("/admin");
  return { ok: true };
}

export async function sendTestPushAction() {
  const callerId = await requireAdmin();
  await sendPushToAdmins({
    title: "🧪 테스트 알림",
    body: "푸시 알림이 정상적으로 작동합니다!",
    url: "/admin",
  });
  return { ok: true };
}
```

**Step 2: Commit**

```bash
git add src/app/(main)/admin/actions.ts
git commit -m "feat: add admin server actions (toggleAdmin, toggleActivation, testPush)"
```

---

## Task 12: Admin Page 컴포넌트들

**Files:**
- Create: `src/app/(main)/admin/_components/AdminUserList.tsx`
- Create: `src/app/(main)/admin/_components/AdminPushSettings.tsx`
- Create: `src/app/(main)/admin/_components/AdminActivityLog.tsx`

**Step 1: AdminUserList 컴포넌트**

`src/app/(main)/admin/_components/AdminUserList.tsx`:
```tsx
"use client";

import { useState, useTransition } from "react";
import { toggleAdminAction, toggleActivationAction } from "../actions";
import type { AdminUser } from "@/lib/domain/admin/queries";

const LOCATION_MAP: Record<string, string> = {
  "1": "태평_탄천", "2": "서현_황새울공원", "3": "야탑_탄천종합운동장",
  "4": "모란_성남종합운동장", "5": "위례", "6": "정자", "7": "판교", "8": "그 외",
};

interface Props {
  users: AdminUser[];
  currentAccountId: string;
}

export function AdminUserList({ users, currentAccountId }: Props) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<Record<string, AdminUser>>({});

  const getUser = (u: AdminUser) => optimistic[u.accountId] ?? u;

  const handleToggleAdmin = (user: AdminUser) => {
    const newVal = !getUser(user).isAdmin;
    setOptimistic((prev) => ({
      ...prev,
      [user.accountId]: { ...getUser(user), isAdmin: newVal },
    }));
    startTransition(async () => {
      await toggleAdminAction(user.accountId, newVal);
    });
  };

  const handleToggleActivation = (user: AdminUser) => {
    const newVal = !getUser(user).activation;
    setOptimistic((prev) => ({
      ...prev,
      [user.accountId]: { ...getUser(user), activation: newVal },
    }));
    startTransition(async () => {
      await toggleActivationAction(user.accountId, newVal);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {users.map((rawUser) => {
        const u = getUser(rawUser);
        const isMe = u.accountId === currentAccountId;
        return (
          <div
            key={u.accountId}
            style={{
              background: "var(--tcrc-bg-surface)",
              border: `1px solid ${u.isAdmin ? "rgba(200,255,62,0.3)" : "var(--tcrc-line)"}`,
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* 아바타 */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: u.isAdmin ? "rgba(200,255,62,0.15)" : "var(--tcrc-bg-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 16,
              }}
            >
              {u.isAdmin ? "👑" : "🏃"}
            </div>

            {/* 정보 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    color: "var(--tcrc-text-primary)",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {u.name}
                </span>
                <span
                  style={{
                    color: "var(--tcrc-text-tertiary)",
                    fontSize: 12,
                  }}
                >
                  {u.birthYear}년생
                </span>
                {isMe && (
                  <span
                    style={{
                      background: "#C8FF3E",
                      color: "#0B0D10",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 100,
                    }}
                  >
                    나
                  </span>
                )}
              </div>
              <div
                style={{
                  color: "var(--tcrc-text-tertiary)",
                  fontSize: 12,
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {u.email}
              </div>
            </div>

            {/* 토글들 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              {/* 운영진 토글 */}
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11 }}>운영진</span>
                <div
                  onClick={() => !pending && handleToggleAdmin(rawUser)}
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 100,
                    background: u.isAdmin ? "#C8FF3E" : "var(--tcrc-bg-muted)",
                    position: "relative",
                    transition: "background 0.2s",
                    cursor: pending ? "not-allowed" : "pointer",
                    opacity: pending ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: u.isAdmin ? "#0B0D10" : "#6B7480",
                      top: 3,
                      left: u.isAdmin ? 19 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </label>

              {/* 활성 토글 */}
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11 }}>활성</span>
                <div
                  onClick={() => !pending && handleToggleActivation(rawUser)}
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 100,
                    background: u.activation ? "#2FCB6F" : "var(--tcrc-bg-muted)",
                    position: "relative",
                    transition: "background 0.2s",
                    cursor: pending ? "not-allowed" : "pointer",
                    opacity: pending ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: u.activation ? "#fff" : "#6B7480",
                      top: 3,
                      left: u.activation ? 19 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: AdminPushSettings 컴포넌트**

`src/app/(main)/admin/_components/AdminPushSettings.tsx`:
```tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { sendTestPushAction } from "../actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
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
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testPending, startTestTransition] = useTransition();
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) return;
    setNotifPermission(Notification.permission);

    navigator.serviceWorker?.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  const handleEnable = async () => {
    if (!VAPID_PUBLIC_KEY) {
      alert("VAPID 키가 설정되지 않았습니다. .env.local을 확인해주세요.");
      return;
    }
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission !== "granted") {
        setLoading(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
      setIsSubscribed(true);
    } catch (e) {
      console.error(e);
    }
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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleTestPush = () => {
    startTestTransition(async () => {
      setTestResult(null);
      const result = await sendTestPushAction();
      setTestResult(result.ok ? "✅ 테스트 발송 완료!" : "❌ 발송 실패");
      setTimeout(() => setTestResult(null), 4000);
    });
  };

  const permissionLabel = {
    granted: "✅ 허용됨",
    denied: "🚫 차단됨",
    default: "⚪ 미설정",
  }[notifPermission];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 내 알림 상태 카드 */}
      <div
        style={{
          background: "var(--tcrc-bg-surface)",
          border: "1px solid var(--tcrc-line)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "var(--tcrc-text-primary)",
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          내 알림 설정
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "var(--tcrc-text-secondary)", fontSize: 13 }}>권한 상태</span>
          <span style={{ color: "var(--tcrc-text-primary)", fontSize: 13, fontWeight: 600 }}>
            {permissionLabel}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: "var(--tcrc-text-secondary)", fontSize: 13 }}>구독 상태</span>
          <span style={{ color: "var(--tcrc-text-primary)", fontSize: 13, fontWeight: 600 }}>
            {isSubscribed ? "🔔 구독 중" : "🔕 미구독"}
          </span>
        </div>

        {notifPermission === "denied" ? (
          <div
            style={{
              background: "rgba(255,92,77,0.1)",
              border: "1px solid rgba(255,92,77,0.3)",
              borderRadius: 8,
              padding: "10px 12px",
              color: "var(--tcrc-accent-red)",
              fontSize: 13,
            }}
          >
            브라우저 설정에서 알림을 허용해주세요.
          </div>
        ) : (
          <button
            onClick={isSubscribed ? handleDisable : handleEnable}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: isSubscribed ? "var(--tcrc-bg-muted)" : "#C8FF3E",
              color: isSubscribed ? "var(--tcrc-text-primary)" : "#0B0D10",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "처리 중..." : isSubscribed ? "알림 끄기" : "알림 켜기"}
          </button>
        )}
      </div>

      {/* 테스트 발송 */}
      <div
        style={{
          background: "var(--tcrc-bg-surface)",
          border: "1px solid var(--tcrc-line)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "var(--tcrc-text-primary)",
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          테스트 발송
        </div>
        <div
          style={{
            color: "var(--tcrc-text-tertiary)",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          구독 중인 모든 운영진에게 테스트 푸시를 발송합니다.
        </div>
        {testResult && (
          <div
            style={{
              marginBottom: 10,
              color: "var(--tcrc-text-primary)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {testResult}
          </div>
        )}
        <button
          onClick={handleTestPush}
          disabled={testPending}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "1px solid var(--tcrc-line)",
            background: "var(--tcrc-bg-muted)",
            color: "var(--tcrc-text-primary)",
            fontWeight: 700,
            fontSize: 14,
            cursor: testPending ? "not-allowed" : "pointer",
            opacity: testPending ? 0.7 : 1,
          }}
        >
          {testPending ? "발송 중..." : "테스트 푸시 전송"}
        </button>
      </div>

      {/* 운영진 구독 현황 */}
      <div
        style={{
          background: "var(--tcrc-bg-surface)",
          border: "1px solid var(--tcrc-line)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "var(--tcrc-text-primary)",
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          운영진 알림 현황
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {adminPushStatus.length === 0 ? (
            <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 13 }}>
              운영진이 없습니다.
            </div>
          ) : (
            adminPushStatus.map((admin) => (
              <div
                key={admin.accountId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--tcrc-text-secondary)", fontSize: 14 }}>
                  {admin.name}
                </span>
                <span style={{ fontSize: 13 }}>
                  {admin.hasSub ? "🔔 수신 중" : "🔕 미설정"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: AdminActivityLog 컴포넌트**

`src/app/(main)/admin/_components/AdminActivityLog.tsx`:
```tsx
import type { RecentCheckout } from "@/lib/domain/admin/queries";

const ACTIVATION_MAP: Record<string, string> = {
  "1": "러닝", "2": "등산", "3": "자전거", "4": "기타",
};
const LOCATION_MAP: Record<string, string> = {
  "1": "태평_탄천", "2": "서현_황새울공원", "3": "야탑_탄천종합운동장",
  "4": "모란_성남종합운동장", "5": "위례", "6": "정자", "7": "판교", "8": "그 외",
};

interface Props {
  checkouts: RecentCheckout[];
}

export function AdminActivityLog({ checkouts }: Props) {
  if (checkouts.length === 0) {
    return (
      <div
        style={{
          padding: "32px 16px",
          textAlign: "center",
          color: "var(--tcrc-text-tertiary)",
          fontSize: 14,
        }}
      >
        출석 기록이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {checkouts.map((item, i) => (
        <div
          key={i}
          style={{
            background: "var(--tcrc-bg-surface)",
            border: "1px solid var(--tcrc-line)",
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 20 }}>
            {ACTIVATION_MAP[item.activation] === "러닝" ? "🏃" : "🏔️"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  color: "var(--tcrc-text-primary)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {item.name}
              </span>
              <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12 }}>
                {item.birthYear}년생
              </span>
              {item.founder && (
                <span
                  style={{
                    background: "rgba(200,255,62,0.15)",
                    color: "#C8FF3E",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 100,
                  }}
                >
                  개설자
                </span>
              )}
            </div>
            <div
              style={{
                color: "var(--tcrc-text-tertiary)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {item.meeting_date} · {LOCATION_MAP[item.location] ?? item.location} ·{" "}
              {ACTIVATION_MAP[item.activation] ?? item.activation}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/(main)/admin/_components/
git commit -m "feat: add admin page components (UserList, PushSettings, ActivityLog)"
```

---

## Task 13: Admin Page (RSC 메인 페이지)

**Files:**
- Create: `src/app/(main)/admin/page.tsx`

**Step 1: Admin Page 생성**

`src/app/(main)/admin/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser, getAllUsers, getRecentCheckouts, getAdminPushStatus } from "@/lib/domain/admin/queries";
import { AdminUserList } from "./_components/AdminUserList";
import { AdminPushSettings } from "./_components/AdminPushSettings";
import { AdminActivityLog } from "./_components/AdminActivityLog";

export const metadata = { title: "관리자 — T.C.R.C" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const ok = await isAdminUser(session.user.id);
  if (!ok) redirect("/");

  const [users, checkouts, adminPushStatus] = await Promise.all([
    getAllUsers(),
    getRecentCheckouts(30),
    getAdminPushStatus(),
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--tcrc-bg-primary)",
        color: "var(--tcrc-text-primary)",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          sticky: "top",
          background: "var(--tcrc-bg-primary)",
          borderBottom: "1px solid var(--tcrc-line)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <a
          href="/"
          style={{
            color: "var(--tcrc-text-primary)",
            textDecoration: "none",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ←
        </a>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
            관리자 패널
          </div>
          <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12 }}>
            T.C.R.C 운영진 전용
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "rgba(200,255,62,0.15)",
            border: "1px solid rgba(200,255,62,0.3)",
            borderRadius: 100,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: "#C8FF3E",
          }}
        >
          👑 ADMIN
        </div>
      </header>

      {/* 본문 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 40px" }}>

        {/* 섹션: 푸시 알림 설정 */}
        <section style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--tcrc-text-tertiary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            🔔 푸시 알림 설정
          </div>
          <AdminPushSettings adminPushStatus={adminPushStatus} />
        </section>

        {/* 섹션: 운영진 / 회원 관리 */}
        <section style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--tcrc-text-tertiary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            👥 회원 관리 ({users.length}명)
          </div>
          <AdminUserList users={users} currentAccountId={session.user.id} />
        </section>

        {/* 섹션: 최근 출석 로그 */}
        <section style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--tcrc-text-tertiary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            📋 최근 출석 ({checkouts.length}건)
          </div>
          <AdminActivityLog checkouts={checkouts} />
        </section>

      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/(main)/admin/page.tsx
git commit -m "feat: add admin page RSC with auth guard"
```

---

## Task 14: 홈 화면에 관리자 버튼 추가

**Files:**
- Modify: `src/app/(main)/page.tsx`

**Step 1: isAdmin 서버 체크 추가**

`src/app/(main)/page.tsx`는 현재 `"use client"`. 서버 데이터를 가져오기 위해 별도의 서버 컴포넌트에서 isAdmin 확인 후 prop으로 전달하는 방식 사용.

`src/app/(main)/page.tsx` 파일 상단에 `AdminButton` 클라이언트 컴포넌트를 추가하는 대신, 현재 client component 구조를 유지하면서 별도 `_components/HomeAdminButton.tsx` 생성:

`src/app/(main)/_components/HomeAdminButton.tsx`:
```tsx
"use client";

import { useRouter } from "next/navigation";

export function HomeAdminButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/admin")}
      style={{
        background: "rgba(200,255,62,0.1)",
        border: "1px solid rgba(200,255,62,0.3)",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#C8FF3E",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
      }}
    >
      <span>👑</span>
      <span>관리자 패널</span>
    </button>
  );
}
```

**Step 2: 홈 page.tsx를 RSC로 분리 (isAdmin 체크를 위해)**

`src/app/(main)/page.tsx`를 새로운 RSC wrapper로 변경하고, 기존 client code를 `_components/HomeClient.tsx`로 이동:

현재 `page.tsx`를 `_components/HomeClient.tsx`로 이동:
```tsx
// src/app/(main)/_components/HomeClient.tsx
"use client";
// ... 기존 page.tsx의 모든 내용을 그대로 복사, 단 HomeAdminButton prop 추가
```

새 `src/app/(main)/page.tsx` (RSC):
```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser } from "@/lib/domain/admin/queries";
import HomeClient from "./_components/HomeClient";

export default async function Page() {
  const session = await getServerSession(authOptions);
  let isAdmin = false;
  if (session?.user?.id) {
    isAdmin = await isAdminUser(session.user.id);
  }
  return <HomeClient isAdmin={isAdmin} />;
}
```

**Step 3: HomeClient.tsx 수정**

기존 `page.tsx` 내용을 복사한 후:
- `export default function Home()` → `export default function HomeClient({ isAdmin }: { isAdmin: boolean })`
- 기존 ActionCard 섹션 마지막에 조건부로 관리자 버튼 추가:
```tsx
{isAdmin && (
  <div style={{ marginTop: 4 }}>
    <HomeAdminButton />
  </div>
)}
```
- `import { HomeAdminButton } from "./HomeAdminButton"` 추가

**Step 4: Commit**

```bash
git add src/app/(main)/page.tsx src/app/(main)/_components/
git commit -m "feat: add admin button on home screen for admin users"
```

---

## Task 15: TypeScript 타입 검증 + 최종 확인

**Step 1: TypeScript 체크**

```bash
cd /Users/whs-95/Desktop/tcrc/manager-app
npx -p typescript tsc --noEmit
```

Expected: 에러 없음 (또는 pre-existing 에러만)

**Step 2: VAPID 키 생성 안내 파일 작성**

`SETUP_PUSH.md` 생성 (프로젝트 루트):
```md
# Push Notification Setup

## 1. VAPID 키 생성

```bash
node scripts/generate-vapid-keys.mjs
```

## 2. .env.local에 추가

출력된 4개 환경변수를 `.env.local`에 추가.

## 3. Supabase SQL 실행

Supabase 대시보드 → SQL Editor에서 실행:

```sql
ALTER TABLE tcrc.user ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS tcrc.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_id)
);
```

## 4. 첫 운영진 지정

```sql
UPDATE tcrc.user SET "isAdmin" = true WHERE email = 'your-email@example.com';
```

## 5. 배포 환경변수

Vercel 또는 서버에 VAPID 환경변수 추가.
```

**Step 3: Final commit**

```bash
git add SETUP_PUSH.md scripts/generate-vapid-keys.mjs
git commit -m "docs: add push notification setup guide"
```

---

## Summary

구현 완료 후 사용자가 해야 할 일:
1. `node scripts/generate-vapid-keys.mjs` 실행 → `.env.local`에 붙여넣기
2. Supabase SQL 2개 실행
3. SQL로 자신을 isAdmin 지정
4. 배포 시 Vercel 환경변수에 VAPID 키 추가
