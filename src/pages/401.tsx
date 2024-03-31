import { Button } from "../components/ui/button";
import { IcKakaoIcon } from "../components/icons/IcKakao";
import { Layout } from "../components/Layout";


const NotAuthPage = () => {
    return (
        <Layout>
            <div className={'w-[100vw] h-[102vh] min-h-full bg-cover bg-center items-center'} style={{
                backgroundImage: `url('BackImages.png')`
            }}>
                <div className={'flex justify-center items-center flex-col'}>
                    <div className={'text-white size-full flex gap-2 flex-col'}>
                        <span className={'text-2xl'}>Tan-Cheon Running Crews</span>
                        <span>TCRC</span>
                        <span>We Run Together</span>
                    </div>
                    <Button variant={'default'}>
                        <IcKakaoIcon/>
                        카카오톡으로 로그인
                    </Button>
                </div>
            </div>
        </Layout>)
}


export default NotAuthPage;