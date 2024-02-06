// import { DefaultSession } from "next-auth/react";

import { DefaultSession } from "next-auth";



export interface ExtendedSession {
  user?: {
    name?: string ;
    email?: string ;
    image?: string ;
    birthYear?: string ;
    id?: string ; // id 속성 추가
  };
}
