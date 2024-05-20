import React from "react";
import Layout from "../components/Layout";
import Main from "./main";

export default function Home() {


// 세션체크하여 로그인이 되어있다면 메인페이지로 이동(Main)
// 로그인이 안되어있다면 로그인페이지로 이동(Login)

  return (<></>
    // <Layout >
    //   <Main />
    //   {/* Rest of the code */}
    // </Layout >
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
