import React from "react";
import Layout from "../components/Layout";
import Main from "./main";

export default function Home() {

  return (
    <Layout >
      <Main />
      {/* Rest of the code */}
    </Layout >
  );
}

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       name: string;
//       email: string;
//       id: string;
//       birthYear: number;
//     };
//   }
//   interface User {
//     birthYear: number;
//   }
// }
