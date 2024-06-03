import React from "react";
import {PropsWithChildren} from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const Layout = ({ children }: PropsWithChildren) => {
    

    return (
        <div className="m-h-min bg-gray-100 flex flex-col items-center">
            {children}
        </div>
    );
};

export default Layout;