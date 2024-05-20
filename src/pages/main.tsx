import React from "react";
import {Layout} from "../components/Layout";
import Header from "../components/kyu/Header";
import Menu from "../components/kyu/Menu";
import MenuItem from "../components/kyu/MenuItem";

const Main = () => {

    const menuItems = [
        {p_text: "크루원의 참여도를 확인해 보세요!", btn_text: "랭킹 확인", bg_color: "bg-secondary"},
        {p_text: "출석체크하고 상품을 받으세요!", btn_text: "출석 체크", bg_color: "bg-primary"},
    ];

    return (
    <Layout>
        <Header />
        <div className="flex flex-col w-full h-svh " style={{ height: 'calc(100vh - 66px)' }}>
            <div className="h-5/6"></div>
            <div className="flex flex-col justify-start bg-cover bg-no-repeat bg-center" 
                style={{ 
                    marginBottom: `${menuItems.length * 50}px`, 
                    backgroundImage: 'url("https://img.gqkorea.co.kr/gq/2020/11/style_5fbcc604426fa.jpg")',
                    // backgroundSize: '100%',
                }}>
                <div className="flex flex-col justify-between m-1" style={{ minHeight: '72vh' }}>
                    <div role="alert" className="alert bg-slate-50/30 justify-start">
                        <span >공지 - 2024 정기런 장소 가이드</span>
                    </div>
                    <div className="pl-8 pb-12 text-left">
                        <div className="max-w-md text-2xl font-bold text-white">
                            <p className="py-1">안녕하세요 OOO님,</p>
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
                            />
                        ))}
                    </Menu>
                </div>
            </div>
        </div>
    </Layout>);
}


export default Main;