import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function Home() {

  const router = useRouter();
  const { data: session, status } = useSession();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");


  const adminRouter = (buttonName: String) => {
    router.push(`/admin/${buttonName}`);
  };


  const closeModal = () => setModalIsOpen(false);
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
    if (
      status === "authenticated" &&
      session.user &&
      (!session.user.name || !session.user.birthYear)
    ) {
      router.push("/signup");
      return;
    }
  }, [router, session, status]);

  return (
    <div
      key='1'
      className='dark flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'
    >
      <Header />
      <main className='flex flex-col space-y-4 shadow-lg w-full max-w-xs'>
        {!session ? (
          <>
            <div className='font-bold p-4 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-200 shadow-lg'>
              <button onClick={() => login()}>카카오 로그인</button>
            </div>
          </>
        ) : (
          <>
            <button
              className='font-bold p-4 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => adminRouter("checkout")}
            >
              출석 현황
            </button>
            <button
              className='font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => adminRouter("user")}
            >
              회원 목록
            </button>
            <button
              className='font-bold p-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => adminRouter("auth")}
            >
              회원 권한
            </button>
            <button
              className='font-bold p-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => adminRouter("qrcheck")}
            >
              QR스캔
            </button>
            <button
              className='font-bold p-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => admin("functionlist")}
            >
              메뉴관리
            </button>
          </>
        )}
      </main>
    </div>
  );
}

const Header = () => {
  return (
    <header className='w-full max-w-xs flex justify-between items-center mb-4'>
      <div className='text-3xl font-bold'>TCRC 관리자 페이지</div>
    </header>
  );
};

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
      birthYear: number;
    };
  }
  interface User {
    birthYear: number;
  }
}
