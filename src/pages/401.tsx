import {Button} from "../components/ui/button";
import {IcKakaoIcon} from "../components/icons/IcKakao";
import {Layout} from "../components/Layout";


const NotAuthPage = () => {

    return (
        <Layout>
            <div className={'size-full min-h-full bg-cover bg-center'} style={{
                backgroundImage: `url('BackImages.png')`
            }}>
                <div className={'text-white flex gap-2 flex-col'}>
                <span className={'text-2xl'}>
                Tan-Cheon Running Crew
             s   </span>
                    <span>
                    TCRC
                </span>
                    <span>
                    We Run Together
                </span>
                </div>
                <Button variant={'default'}>
                    <IcKakaoIcon/>
                    카카오톡으로 로그인
                </Button>
            </div>
        </Layout>)
}


export default NotAuthPage;