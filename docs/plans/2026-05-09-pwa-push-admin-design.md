# PWA + Push Notifications + Admin Page Design

Date: 2026-05-09
Status: Approved

## Goals

1. **PWA 설치 유도** — 모바일에서 홈화면 추가 배너 표시, iOS/Android 모두 지원
2. **운영진 전용 푸시 알림** — 크루원이 출석할 때 운영진에게 실시간 푸시 전송
3. **관리자 페이지** — 운영진 권한 관리, 푸시 설정, 활동 로그를 한 곳에서

## Architecture

### Stack Additions
- `web-push` (npm) — 서버 측 Web Push 발송
- Next.js built-in `next/og` ImageResponse — 아이콘 생성 (별도 외부 의존성 없음)
- Supabase DB 변경 — user.isAdmin 컬럼, push_subscriptions 테이블

### Data Flow

**푸시 구독 등록:**
```
운영진 앱 열기
  → PushNotificationProvider: SW 등록
  → Notification.requestPermission()
  → SW.pushManager.subscribe(vapidPublicKey)
  → POST /api/push/subscribe { subscription }
  → Supabase push_subscriptions upsert
```

**출석 시 푸시 발송:**
```
크루원 checkoutAction() 성공
  → sendPushToAdmins(name, location, date)
  → lib/domain/push/subscriptions.ts: getAdminSubscriptions()
  → lib/push/vapid.ts: webpush.sendNotification() × N운영진
  → 각 운영진 SW: push event → showNotification()
```

**알림 메시지 형식:**
```
제목: 🏃 출석 알림
내용: 홍길동님이 태평_탄천에서 5월 9일 14:30 출석했습니다
```

## Database Changes

```sql
-- 1. 운영진 컬럼
ALTER TABLE tcrc.user ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- 2. 푸시 구독 테이블
CREATE TABLE IF NOT EXISTS tcrc.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_id)
);
```

## File Map

### PWA
```
src/app/
  manifest.ts                     # Next.js built-in dynamic manifest
  icon.tsx                        # favicon (32x32 ImageResponse)
  apple-icon.tsx                  # iOS icon (180x180 ImageResponse)
  api/icons/[size]/route.tsx      # 192x192, 512x512 for manifest

src/components/
  molecules/PwaInstallBanner.tsx  # beforeinstallprompt 배너
  providers/
    PushNotificationProvider.tsx  # SW 등록 + push 구독
```

### Push Notifications
```
public/sw.js                      # Service Worker (push event handler)

src/
  lib/
    push/vapid.ts                 # web-push 초기화 + sendPushToAdmins()
    domain/push/subscriptions.ts  # DB 쿼리

  app/api/push/
    subscribe/route.ts            # POST: 구독 저장
    unsubscribe/route.ts          # POST: 구독 삭제
```

### Admin Page
```
src/app/(main)/admin/
  page.tsx                        # RSC: isAdmin 권한 체크 + 데이터 로드
  actions.ts                      # toggleAdmin, toggleActivation, testPush
  _components/
    AdminUserList.tsx             # 유저 목록 + isAdmin/activation 토글
    AdminPushSettings.tsx         # 내 푸시 설정 + 테스트 발송
    AdminActivityLog.tsx          # 최근 출석 로그
```

### Layout Update
```
src/app/layout.tsx                # manifest 링크, theme-color, viewport 추가
```

## Admin Page Sections

### 1. 운영진 관리
- 전체 유저 목록 (name, birthYear, email, activation, isAdmin)
- isAdmin 토글 (즉시 반영)
- activation 토글

### 2. 푸시 알림 설정
- 내 알림 상태 표시 (허용/차단/미설정)
- 알림 켜기/끄기 버튼
- 구독된 운영진 수 표시
- 테스트 푸시 전송 버튼

### 3. 최근 활동 로그
- 최근 30개 출석 기록
- 이름, 날짜, 장소, 운동 종류

## Environment Variables

```env
# 기존 환경변수는 유지, 아래 추가 필요
VAPID_PUBLIC_KEY=         # npx web-push generate-vapid-keys 로 생성
VAPID_PRIVATE_KEY=        # 위 명령어 결과
VAPID_SUBJECT=mailto:admin@tcrc.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=  # 클라이언트 SW에도 필요 (동일 값)
```

## Access Control

- `/admin` 라우트: `isAdmin: true` 인 유저만 접근 (서버 컴포넌트에서 체크)
- 미인증/비관리자: 홈(`/`)으로 redirect
- 홈 화면 액션 카드에 "관리자" 버튼 추가 (isAdmin인 경우에만 표시)

## PWA Manifest

```json
{
  "name": "T.C.R.C 러닝크루",
  "short_name": "TCRC",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B0D10",
  "theme_color": "#C8FF3E",
  "orientation": "portrait",
  "icons": [
    { "src": "/api/icons/192", "sizes": "192x192", "type": "image/png" },
    { "src": "/api/icons/512", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
  ]
}
```

## Open Items (post-implementation, user must do)

1. **Supabase SQL 실행** — 위 DDL을 Supabase 대시보드에서 실행
2. **VAPID 키 생성** — `npx web-push generate-vapid-keys` 실행 후 .env.local에 추가
3. **첫 운영진 지정** — Supabase에서 `UPDATE tcrc.user SET "isAdmin" = true WHERE ...`
4. **배포 환경변수** — Vercel/서버 환경변수에 VAPID 키 추가
