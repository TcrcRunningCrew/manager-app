# Push Notification & PWA Setup

Complete this setup before deploying push notifications.

## 1. Generate VAPID Keys

```bash
node scripts/generate-vapid-keys.mjs
```

Copy the output into `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<paste here>
VAPID_PUBLIC_KEY=<paste here>
VAPID_PRIVATE_KEY=<paste here>
VAPID_SUBJECT=mailto:admin@tcrc.com
```

## 2. Supabase SQL (run once in Supabase Dashboard → SQL Editor)

```sql
-- 운영진 컬럼 추가
ALTER TABLE tcrc.user ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- 푸시 구독 테이블 생성
CREATE TABLE IF NOT EXISTS tcrc.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_id)
);
```

## 3. 첫 운영진 지정 (Supabase SQL Editor)

```sql
-- 이메일로 운영진 지정
UPDATE tcrc.user SET "isAdmin" = true WHERE email = 'your-email@example.com';
```

## 4. 배포 환경변수 추가

Vercel 또는 서버 환경변수에 다음 4개 추가:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

## 5. 동작 확인

1. 앱 접속 → 홈 화면에서 "관리자 패널" 버튼 확인 (운영진만 보임)
2. `/admin` 접속 → "알림 켜기" 버튼으로 푸시 구독
3. 다른 계정으로 출석체크 → 운영진에게 푸시 알림 수신 확인
4. 모바일에서 홈화면 추가 배너 표시 확인

## PWA 설치

- **Android/Chrome**: 홈화면 추가 배너 → "지금 설치" 탭
- **iOS Safari**: 공유 버튼 → "홈 화면에 추가"
