import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import { supabase } from '../../../utils/supabaseClient';

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ||"",
      clientSecret: process.env.KAKAO_CLIENT_SECRET||""
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('user: ', user);
      console.log('user.email: ',user.email);
      // 사용자가 처음 로그인하는 경우 확인

      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('email', user.email)
        .single();

        console.log(data);
        
      if (data) {
        console.log("회원가입자입니다.");
      }

      if (error || !data) {
        return '/signup';
      }

      return true;
    },
    async session({ session, user }) {
      if (user) {
        // 사용자 정보를 세션 객체에 추가합니다.
        session.user = {...session.user, ...user};
      }
      return session;
    }
    
  }
})