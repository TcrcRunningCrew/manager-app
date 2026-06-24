import { createClient } from "@supabase/supabase-js";

// 서버 전용 Supabase 클라이언트.
//
// 키 우선순위:
//   1. SUPABASE_SERVICE_ROLE_KEY  (서버 전용 — 권장. 브라우저 번들로 절대 새지 않음)
//   2. SUPABASE_SECRET_KEY        (별칭 호환)
//   3. NEXT_PUBLIC_SUPABASE_API_KEY / NEXT_PUBLIC_SUPABASE_KEY  (구 설정 호환용 폴백)
//
// 호환 폴백을 두는 이유: 운영 환경에서 service-role 환경변수 등록 전에 빌드/배포가
// 깨지지 않도록 함. service-role 키가 일단 설정되면 NEXT_PUBLIC_* 폴백은 무시됨.
// **권장**: NEXT_PUBLIC_SUPABASE_API_KEY 는 anon 키만 두고, 모든 테이블에 RLS 를 켠
// 다음 server.ts 는 SUPABASE_SERVICE_ROLE_KEY 만 읽도록 운영 환경을 정리.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_KEY ??
  "placeholder";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY &&
  !process.env.SUPABASE_SECRET_KEY
) {
  console.warn(
    "[supabase/server] SUPABASE_SERVICE_ROLE_KEY 미설정 — NEXT_PUBLIC_* 키로 폴백 중. " +
      "브라우저에 노출되는 anon 키와 서버 권한이 동일해질 수 있으니 서버 전용 키로 교체하세요.",
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "tcrc" },
});
