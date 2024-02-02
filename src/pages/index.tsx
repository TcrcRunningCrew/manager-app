import { useRouter } from "next/router";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import CustomModal from "../components/common/customModal";

export default function Home() {
  const router = useRouter();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const navigateTo = (path: any) => {
    router.push(path);
  };

  const { data: session } = useSession();

  const loginChecked = (buttonName: String) => {
    if (session && session.user && session.user.name && session.user.email) {
      navigateTo(`/user/${buttonName}`);
    } else {
      setModalIsOpen(true); // 모달 열기
      setErrorMessage("로그인 및 회원가입 이후 이용가능"); // 에러 메시지 설정
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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

  return (
    <div
      key='1'
      className='dark flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'
    >
      <header className='w-full max-w-xs flex justify-between items-center mb-4'>
        <div className='text-3xl font-bold'>TCRC 러닝크루</div>
        <div className='flex space-x-2'>
          <button className='bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-200'>
            <BellIcon className='' />
          </button>
          <button className='bg-green-600 text-white rounded-full p-2 hover:bg-green-600 transition-colors duration-200'>
            <UserIcon className='' />
          </button>
        </div>
      </header>
      <main className='flex flex-col space-y-4 shadow-lg w-full max-w-xs'>
        <button
          className='font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
          onClick={() => loginChecked("checkMonth")}
        >
          참여랭킹
        </button>
        <button
          className='font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
          onClick={() => loginChecked("founder")}
        >
          개설랭킹
        </button>
        <button
          className='font-bold p-4 bg-green-500 text-white text-center rounded-md hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
          onClick={() => loginChecked("checkout")}
        >
          출석체크
        </button>
        {!session && (
          <>
            <div className='font-bold p-4 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-200 shadow-lg'>
              <button onClick={() => login()}>카카오 로그인</button>
            </div>
          </>
        )}
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
  );
}

function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
      <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
    </svg>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  );
}
