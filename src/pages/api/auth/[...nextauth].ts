import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import {findUserByAccountId} from "@/services/user.service";

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
      // 무조건 true 로 넘겨준다.
      const res = await findUserByAccountId(params.account?.providerAccountId ?? '',)
      if (res && res.length > 0 && res[0]) {
        // 이미 잇는 유저일경우 처음부터 이름과 이메일은 심어준다
        params.user.email = res[0].email ?? '';
        params.user.name = res[0].name ?? '';
      }

      return true
    },
    async session({session, user, trigger, newSession, token}) {
      // 세션 유저 프로필 심기
      if (session.user) {
        session.user.id = token.sub ?? '';
      }
      if (token.name && token.email && session.user){
        session.user.name = token.name
        session.user.email = token.email
      }
      return session;
    },
    async jwt({session, token, trigger, user, account, profile}) {
      if (trigger === 'update') {
        token.email = session.email;
        token.name = session.name;
      }
      return token
    }
  },
});

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      id: string
    }
  }
}


