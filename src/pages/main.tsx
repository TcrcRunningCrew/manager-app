import React from 'react';
import {Layout} from "../components/Layout";
import Header from "../components/kyu/Header";
import Menu from "../components/kyu/Menu";
import MenuItem from "../components/kyu/MenuItem";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Main = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const menuItems = [
        {
            p_text: "크루원의 참여도를 확인해 보세요!", 
            btn_text: "랭킹 확인", 
            bg_color: "bg-secondary",
            onclick: () => { router.push("/ranking"); }
        },
        {
            p_text: "출석체크하고 상품을 받으세요!", 
            btn_text: "출석 체크", 
            bg_color: "bg-primary",
            onclick: () => { router.push("/attendance"); }
        },
    ];

    return (
    <Layout>
        <Header />
        <div className="flex flex-col w-full h-svh " style={{ height: 'calc(100vh - 66px)' }}>
            <div className="h-5/6"></div>
            <div className="flex flex-col justify-start bg-cover bg-no-repeat bg-center" 
                style={{ 
                    marginBottom: `${menuItems.length * 50}px`, 
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://img.gqkorea.co.kr/gq/2020/11/style_5fbcc604426fa.jpg")',
                    // backgroundSize: '100%',
                }}>
                <div className="flex flex-col justify-between m-1" style={{ minHeight: '72vh' }}>
                    <div role="alert" className="alert bg-slate-50 justify-start">
                        <span >공지 - 2024 정기런 장소 가이드</span>
                    </div>
                    <div className="pl-8 pb-12 text-left ">
                        <div className="max-w-md text-2xl font-bold text-white">
                            <p className="py-1">안녕하세요 {session?.user.name}님,</p>
                            <p className="py-1">현재 랭킹은</p>
                            <p className="py-1">1위 15점 입니다.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Menu totalMenu={menuItems.length}>
                        {menuItems.map((item, index, array) => (
                            <MenuItem 
                                key={index}
                                index={index}
                                p_text={item.p_text} 
                                btn_text={item.btn_text} 
                                bg_color={item.bg_color}
                                position={array.length - index}
                                totalMenu={menuItems.length}
                                onclick={item.onclick}
                            />
                        ))}
                    </Menu>
                </div>
            </div>
        </div>
    </Layout>);
}


export default Main;