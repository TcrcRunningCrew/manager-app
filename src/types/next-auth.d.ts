declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
      birthYear: number
    }
  }
  interface JWT{
    birthYear: number;
  }
  interface User {
    name: string;
    email: string;
    id: string;
    birthYear: number
  }
}

