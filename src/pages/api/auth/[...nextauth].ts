import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { findUserByAccountId } from "@/services/user.service";

export default NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  debug: false,
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  session: {
    // 세션 유효기간을 1시간(3600초)으로 설정
    // 사용자가 활동할 때마다 세션 갱신 간격을 24시간(86400초)으로 설정
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60, // 30일
    updateAge: 24 * 60 * 60, // 24시간
  },
  callbacks: {
    async signIn(params) {
      params.user.birthYear = "";
      const res = await findUserByAccountId(
        params.account?.providerAccountId ?? ""
      );
      if (res && res.length > 0 && res[0]) {
        // 이미 잇는 유저일경우 처음부터 이름과 이메일은 심어준다
        params.user.email = res[0].email ?? "";
        params.user.name = res[0].name ?? "";
        params.user.birthYear = String(res[0].birthYear) ?? 0;
      }

      return true;
    },
    async session({
      session,
      token,
    }: {
      session: any; // session 객체의 타입을 적절히 정의해야 합니다.
      token: any;
    }) {
      // 세션 유저 프로필 심기
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      if (token.birthYear && token.name && token.email && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.birthYear = (token.birthYear as number) ?? 0;
      }

      return session;
    },
    async jwt({ session, token, trigger, user, account, profile }) {
      if (trigger === "signIn" && user.birthYear) {
        token.birthYear = user.birthYear;
        // 어거지로 넣어준거다
      }

      if (trigger === "update") {
        token.email = session.email;
        token.name = session.name;
        token.birthYear = session.birthYear;
      }
      return token;
    },
  },
});

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    birthYear: string;
  }

}
