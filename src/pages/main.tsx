import React from "react";
import Header from "../components/kyu/Header";
import Menu from "../components/kyu/Menu";

const Main = () => {
    return (<>
        <Header title="Hello World" />
        <div className="flex flex-col justify-between min-h-screen w-full">
            <div></div>
            <div className="justify-start">
                <div className="w-full">
                    <p className="text-3xl text-left mt-10">안녕하세요 000님</p>
                    <p className="text-left mt-5">현재 랭킹은</p>
                    <p className="text-3xl text-left mt-10">1위입니다.</p>
                </div>
                <div className="w-full">
                    <Menu items={[
                        { label: "Home", link: "/" },
                        { label: "About", link: "/about" },
                        { label: "Services", link: "/services" },
                        { label: "Contact", link: "/contact" }
                    ]} />
                </div>
            </div>
        </div>
        
        
    </>)
}


export default Main;