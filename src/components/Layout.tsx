import {PropsWithChildren} from "react";

export const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <main className="flex flex-1 justify-center items-center flex-col w-full">
                {children}
            </main>
        </div>
    );
};

