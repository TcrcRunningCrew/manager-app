import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
      birthYear: number;
    } & DefaultSession["user"];
  }
  interface User {
    birthYear: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    birthYear?: string | number;
  }
}
