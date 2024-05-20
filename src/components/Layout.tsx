import {PropsWithChildren} from "react";

export const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="m-h-min bg-gray-100 flex flex-col items-center">
            {children}
        </div>
    );
};

export default Layout;