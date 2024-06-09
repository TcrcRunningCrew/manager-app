import React, { useEffect, useState } from 'react';
import {Layout} from "../components/Layout";
import Header from "../components/common/Header";
import Menu from "../components/common/Menu";
import MenuItem from "../components/common/MenuItem";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { supabase } from '../utils/supabaseClient';

const Main = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userRanking, setUserRanking] = useState<{rank: number, score: number}>({
        rank: 0,
        score: 0,
    });

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

    const findUserRanking = async (name: string) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const { data: userRanking, error } = await supabase
            .from("meeting_view")
            .select("*")
            .eq("name", name)
            .eq("year", year)
            .eq("month", month);
           
        if (error) throw new Error(error.message);

        if (userRanking && userRanking.length > 0 && userRanking[0]) {
            const { total_rank, total } = userRanking[0];
            console.log('====userRanking: ', userRanking);
            setUserRanking({ rank: total_rank, score: total });
          }
    }

    useEffect(() => {
        if (session) {
            findUserRanking(session!.user!.name!)
        }
    }, []);

    const handleNoticeClick = () => {
        window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfo1MdN1_ptqYOe7uO8FbVf_Adt0cLSesUosPEHmFTY-xTnTA/viewform?usp=pp_url"
    }
  

    return (
    <Layout>
        <Header />
        <div className="flex flex-col w-full h-svh " style={{ height: 'calc(100vh - 66px)' }}>
            <div className="flex flex-col justify-start bg-cover bg-no-repeat bg-center" 
                style={{ 
                    marginBottom: `${menuItems.length * 50}px`, 
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://img.gqkorea.co.kr/gq/2020/11/style_5fbcc604426fa.jpg")',
                    // backgroundSize: '100%',
                }}>
                <div className="flex flex-col justify-between m-1" style={{ minHeight: '66vh' }}>
                    <div role="alert" className="alert bg-slate-50 justify-start">
                        <span onClick={handleNoticeClick}>구글폼 링크</span>
                    </div>
                    <div className="pl-8 pb-12 text-left ">
                        <div className="max-w-md text-2xl font-bold text-white">
                            <p className="py-1">안녕하세요 {session?.user.name ?? '-'}님,</p>
                            <p className="py-1">현재 랭킹은</p>
                            <p className="py-1">{userRanking.rank > 0 ? userRanking.rank : '-'}위 {userRanking.score > 0  ? userRanking.score : '-'}점 입니다.</p>
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