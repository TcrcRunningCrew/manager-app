import NextAuth, {NextAuthOptions} from "next-auth"
import KakaoProvider from "next-auth/providers/kakao";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  debug: true,
  // Configure one or more authentication providers
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || ''
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ]
} satisfies NextAuthOptions

export default NextAuth(authOptions)