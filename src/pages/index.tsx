import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import CustomModal from "../components/common/CustomModal";
import React from "react";
import { UserIcon, LogoutButton} from "../components/icons";
import {alarmMeetingDatabaseChange} from "../services/check.service";



export default function Home() {

  alarmMeetingDatabaseChange();

  const router = useRouter();
  const {data: session, status} = useSession();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");


  const loginChecked = (buttonName: String) => {
    router.push(`/user/${buttonName}`);
  };

  const closeModal = () => setModalIsOpen(false);
  ;

  const openSuccessModalWithMessage = async (message: string) => {
    setSuccessModalIsOpen(true);
    setMessage(message);
  };


  const closeSuccessModal = async () => {
    setSuccessModalIsOpen(false);
    signIn("kakao");
  };

  const login = () => {
    openSuccessModalWithMessage(
      "이메일 정보 동의를 필수로 해주시길 부탁드립니다."
    );
  };

  useEffect(() => {
   
    // 유저이름과 이메일 없는 케이스
    if (status === 'authenticated' && session.user && (!session.user.name || !session.user.birthYear)){
      router.push('/signup')
      return;
    }

  }, [router, session, status]);

  return (
    <div
      key='1'
      className='dark flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'
    >
      <Header/>
      <main className='flex flex-col space-y-4 shadow-lg w-full max-w-xs'>
        {!session ? (
          <>
            <div
              className='font-bold p-4 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-200 shadow-lg'>
              <button onClick={() => login()}>카카오 로그인</button>
            </div>
          </>
        ) : (
          <>
            <button
              className='font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("checkMonth")}>
              전체 참여랭킹
            </button>
            <button
              className='font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("founder")}
            >
              전체 개설랭킹
            </button>
            <button
              className='font-bold p-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("checkout")}
            >
              출석체크
            </button>
          </>
        )
        }
        <CustomModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          errorMessage={errorMessage}
        />
        <CustomModal
          isOpen={successModalIsOpen}
          onRequestClose={closeSuccessModal}
          errorMessage={message}
        />
      </main>
    </div>
  )
}


const Header = () => {
  return (
    <header className='w-full max-w-xs flex justify-between items-center mb-4'>
      <div className='text-3xl font-bold'>TCRC 러닝크루</div>
      <div className='flex space-x-2'>
        <button className='bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-200'>
          <UserIcon className=''/>
        </button>
        <button
          onClick={() => signOut()}
          className='bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors duration-200'>
          <LogoutButton className=''/>
        </button>
      </div>
    </header>
  )
}



declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
      birthYear: number
    }
  }
  interface User {
    birthYear: number
  }
}