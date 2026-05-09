import { AuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { findUserByAccountId } from "@/lib/domain/user/queries";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    // OAuth 에러 발생 시 홈(로그인 화면)으로 보내 재시도 유도
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      user.birthYear = "";
      try {
        const res = await findUserByAccountId(
          account?.providerAccountId ?? ""
        );
        if (res && res.length > 0 && res[0]) {
          user.email = res[0].email ?? "";
          user.name = res[0].name ?? "";
          user.birthYear = String(res[0].birthYear) ?? "0";
        }
      } catch (err) {
        // Supabase 조회 실패해도 로그인 자체는 허용
        console.error("[NextAuth] signIn - Supabase 조회 실패:", err);
      }
      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        // token에 있는 값을 항상 세션에 반영 (birthYear 유무와 무관)
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.birthYear) session.user.birthYear = token.birthYear;
      }
      return session;
    },
    async jwt({ session, token, trigger, user }: any) {
      if (trigger === "signIn" && user) {
        // signIn 콜백에서 Supabase 값으로 수정된 name/email/birthYear를 명시적으로 저장
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (user.birthYear) token.birthYear = user.birthYear;
      }
      if (trigger === "update") {
        token.email = session.email;
        token.name = session.name;
        token.birthYear = session.birthYear;
      }
      return token;
    },
  },
};
