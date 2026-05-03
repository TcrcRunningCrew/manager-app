import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import CustomModal from "../components/common/CustomModal";
import React from "react";
import { LogoutButton, Qrcode } from "../components/icons";
import Link from "next/link";
import dynamic from "next/dynamic";

// Lottie 컴포넌트를 클라이언트 사이드에서만 로드
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div>로딩중...</div>,
});

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading indicator

  const [lottieData, setLottieData] = useState<any>(null);

  const loginChecked = (buttonName: String) => {
    router.push(`/user/${buttonName}`);
  };

  const closeModal = () => setModalIsOpen(false);
  const openSuccessModalWithMessage = async (message: string) => {
    setSuccessModalIsOpen(true);
    setMessage(message);
  };

  const closeSuccessModal = async () => {
    setSuccessModalIsOpen(false);
    setIsLoading(true); // Start loading
    try {
      // Assuming signIn will navigate automatically on success
      // await signIn("kakao"); // Sign in and wait for it to complete

      await signIn("kakao"); // Sign in and wait for it to complete
      // Optionally, navigate to a specific page on success
      // router.push("/dashboard"); // Adjust the target path as needed
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred during login.");
      setIsLoading(false); // Stop loading if there's an error
      setModalIsOpen(true); // Show the error in a modal
    }
  };

  const login = async () => {
    setIsLoading(true); // Start loading
    try {
      // Assuming signIn will navigate automatically on success
      // await signIn("kakao"); // Sign in and wait for it to complete
      await openSuccessModalWithMessage(
        "이메일 정보 동의를 필수로 해주시길 부탁드립니다."
      );
      // Optionally, navigate to a specific page on success
      // router.push("/dashboard"); // Adjust the target path as needed
    } catch (error) {
      console.error("Login failed:", error);
      setModalIsOpen(true); // Show the error in a modal
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
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

  useEffect(() => {
    // 클라이언트 사이드에서만 lottie.json을 로드
    if (typeof window !== "undefined") {
      import("../lib/lottie.json").then((data) => {
        setLottieData(data);
      });
    }
  }, []);

  return (
    <div
      key='1'
      className='dark flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'
    >
      {isLoading && typeof window !== "undefined" && (
        <DeemdComponent>
          <Lottie animationData={lottieData} loop />{" "}
        </DeemdComponent>
      )}

      <main className='flex flex-col space-y-4 shadow-lg w-full max-w-xs'>
        {!session ? (
          <>
            <Header session={session} />
            <div className='font-bold p-4 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-200 shadow-lg w-full'>
              <button onClick={() => login()} className='w-full'>
                카카오 로그인
              </button>
            </div>
          </>
        ) : (
          <>
            <Header session={session} />
            <button
              className='w-full font-bold p-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("checkout")}
            >
              출석체크
            </button>
            <button
              className='w-full font-bold p-4 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("ranking")}
            >
              종합 랭킹
            </button>
            <button
              className='w-full font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("participation")}
            >
              참여 랭킹
            </button>
            <button
              className='w-full marker:font-bold p-4 bg-blue-500 text-white text-center rounded-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
              onClick={() => loginChecked("founder")}
            >
              개설 랭킹
            </button>
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

const Header = ({ session }: { session: any }) => {
  return (
    <>
      {!session ? (
        <header className='w-full max-w-xs flex justify-between items-center mb-4'>
          <div className='text-3xl font-bold '>T.C.R.C 러닝크루</div>
          <div className='flex space-x-2'>
            <div pl-3></div>
            <button
              onClick={() => signOut()}
              className='bg-green-500 text-white rounded-full  p-2 hover:bg-green-600 transition-colors duration-200'
            >
              <LogoutButton className='' />
            </button>
          </div>
        </header>
      ) : (
        <header className='w-full max-w-xs flex justify-between items-center mb-4'>
          <div className='text-3xl font-bold '>
            T.C.R.C <br />
            러닝크루
          </div>
          <div className='flex space-x-2'>
            {/* <button className='bg-blue-500 text-white rounded-full  p-2 hover:bg-blue-600 transition-colors duration-200'>
                <UserIcon className='' />
              </button> */}
            <button
              onClick={() => signOut()}
              className='bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors duration-200'
            >
              <LogoutButton className='' />
            </button>
            <Link href='/user/checkoutQR'>
              <button className='bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-600 transition-colors duration-200'>
                <Qrcode />
              </button>
            </Link>
          </div>
        </header>
      )}
    </>
  );
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
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

// DeemdComponent를 클라이언트 사이드에서만 렌더링하도록 수정
const DeemdComponent = dynamic(
  () =>
    Promise.resolve(({ children }: PropsWithChildren) => {
      return (
        <div
          className={`shadow-lg bg-gray-200 opacity-10 a absolute size-full rounded-lg overflow-hidden flex z-20`}
        >
          {children}
        </div>
      );
    }),
  { ssr: false }
);
