import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Login from "./login";
import Main from "./main";
import { useRouter } from "next/router";

export default function Home() {

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("session", session)
    if (status === "authenticated" && session.user) {
      router.push("/main");
      return;
    } else {
      router.push("/login");
      return;
    }
  }, [router, session, status]);

  if (status === "loading") return null;

  return (
    <Layout>
      {/* { status === "authenticated" && session.user
        ? (<Main />) 
        : (<Login />) } */}
    </Layout>
  );
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
      birthYear: number;
    };
  }
  interface User {
    birthYear: number;
  }
}
