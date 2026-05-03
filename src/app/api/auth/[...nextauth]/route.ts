import NextAuth, { AuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { findUserByAccountId } from "@/lib/domain/user/queries";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
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
      }
      if (token.birthYear && token.name && token.email && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.birthYear = (token.birthYear as number) ?? 0;
      }
      return session;
    },
    async jwt({ session, token, trigger, user }: any) {
      if (trigger === "signIn" && user?.birthYear) {
        token.birthYear = user.birthYear;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
