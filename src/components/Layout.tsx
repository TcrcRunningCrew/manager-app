import {PropsWithChildren, use} from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const Layout = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session.user && session.user.name && session.user.email) {
            if (router.pathname === "/login") {
                router.push("/main");
                return;
            }
        } else {
            router.push("/login");
            return;
        }
    }, [session, status]);

    return (
        <div className="m-h-min bg-gray-100 flex flex-col items-center">
            {children}
        </div>
    );
};

export default Layout;