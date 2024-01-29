import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    KakaoProvider({
      clientId: 'dfb4d0fc3581c8d049c2ed2b751ac90f',
      clientSecret: 'u2Dd6KmkWsNGXNLtKMe0kmoS8PEnfkV8'
    })
  ]
}

export default NextAuth(authOptions)