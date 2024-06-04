import React from "react";
import {PropsWithChildren} from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const Layout = ({ children }: PropsWithChildren) => {
    

    return (
        <div className=" bg-gray-100 flex flex-col items-center" style={{ height: '100vh' }}>
            {children}
        </div>
    );
};

export default Layout;