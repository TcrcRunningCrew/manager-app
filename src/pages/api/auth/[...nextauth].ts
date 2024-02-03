import { signIn } from "next-auth/react";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { supabase } from "../../../utils/supabaseClient";

export default NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  debug: true,
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
    async signIn({ user, account, profile, email, credentials }) {
      console.log("user: ", user);
      console.log("user.email: ", user.email);
   
      
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("email", user.email)
        .eq("name", user.name);

      console.log("error.email: ", error);
      console.log("data.length: ", data?.length);


      // 에러가 없고, 데이터에 값이 있을 경우의 로직
      if (!error && data.length > 0) {
        // 데이터가 존재하므로 여기에 원하는 처리를 수행합니다.
        // 예: 사용자 정보를 사용하는 로직
        return true;
      } else {
        // 에러가 있거나 데이터가 없는 경우
        return "/signup";
      }
    },
    async session({ session, user }) {
      if (user) {
        session.user = { ...session.user, ...user };
      }
      return session;
    },
  },
});
