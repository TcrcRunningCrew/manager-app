import Button from "../components/kyu/Button";
import { IcKakaoIcon } from "../components/icons/IcKakao";
import { Layout } from "../components/Layout";


const Login = () => {
    return (
        <Layout>
            <div 
                className={'flex flex-col w-[100vw] h-[100vh] min-h-full bg-cover bg-center justify-center  items-center'} 
                style={{
                    backgroundImage: `url('BackImages.png')`
                }}>
                <div className={'flex flex-col'}>
                    <div className={'text-white text-center size-full flex flex-col gap-2 p-1'}>
                        <span className={'text-2xl'}>Tan-Cheon Running Crews</span>
                        <span className={'text-8xl font-black'}>TCRC</span>
                        <span className={'text-2xl'}>We Run Together</span>
                    </div>
                    <Button 
                        onClick={() => {}} 
                        text="카카오톡으로 로그인" 
                        icon={IcKakaoIcon()} 
                        bgColor={'btn-primary'}/>
                </div>
            </div>
        </Layout>
    )
}


export default Login;