import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { useSession, signOut } from "next-auth/react";
import BackButton from "../components/common/backButton";
import CustomModal from "../components/common/CustomModal";
import { signup } from "@/services/user.service";
import { findUserByAccountId } from "@/services/user.service";

export default function Signup() {
  const router = useRouter();

  const { data: session, update, status } = useSession();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>(session?.user.name || "");
  const [birthYear, setBirthYear] = useState<string>(session?.user.email || "");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      checkUserInfo();
      setName(session?.user.name);
      setEmail(session?.user.email);
    }
  }, [session]);

  async function checkUserInfo() {
    console.log("유저 정보  체크");
    console.log(" session?.user.id: ", session?.user.id);

    const res = await findUserByAccountId(session?.user.id ?? "");

    console.log("res: ", res);
    if (res && res.length > 0 && res[0]) {
      router.push(`/`);
    }

    return null;
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBirthYearChange = (e) => {
    setBirthYear(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  async function signUpUser() {
    try {
      const res = await signup({
        name,
        birthYear,
        email,
        accountId: session?.user.id ?? "",
      });
      await update({
        name,
        email,
      });
      openSuccessModalWithMessage("회원가입 완료");
    } catch (e) {
      setModalIsOpen(true);
      setErrorMessage("회원가입 에러 발생, 운영진에게 문의하세요.");
      return;
    }
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalIsOpen(false);
    router.push("/");
  };

  const openSuccessModalWithMessage = (message: string) => {
    setSuccessModalIsOpen(true);
    setMessage(message);
  };

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-black'>
      <GnbHeader />
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <div className='flex flex-col p-1'>
            <label className='font-bold mb-2 text-left text-white'>이름</label>
            <input
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              type='text'
              value={name}
              onChange={handleNameChange}
              placeholder='홍길동'
            />
            <p className='text-white'>
              {/* 유효성 검사 에러 메시지를 표시할 부분 */}
            </p>
          </div>

          <div className='flex flex-col p-1'>
            <label
              className='font-bold mb-2 text-left text-white'
              htmlFor='name'
            >
              년생
            </label>
            <input
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              type='number'
              value={birthYear}
              onChange={handleBirthYearChange}
              placeholder='94'
            />
            <p className='text-white'>
              {/* 유효성 검사 에러 메시지를 표시할 부분 */}
            </p>
          </div>

          <div className='flex flex-col p-1'>
            <label
              className='font-bold mb-2 text-left text-white'
              htmlFor='email'
            >
              이메일
            </label>
            <input
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              type='text'
              value={email}
              onChange={handleEmailChange}
              placeholder='abc@gmail.com'
            />
            <p className='text-white'>
              {/* 유효성 검사 에러 메시지를 표시할 부분 */}
            </p>
          </div>

          <div className='flex flex-col p-1'>
            <label></label>
            <button
              onClick={signUpUser}
              className='text-white bg-green-500 border-0 py-3 px-8 focus:outline-none hover:bg-green-600 rounded text-lg'
            >
              회원가입
            </button>
          </div>
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
        </div>
      </main>
    </div>
  );
}

const GnbHeader = () => {
  return (
    <header className='flex items-center justify-between px-6 py-4 bg-green-500 text-white'>
      <h1 className='text-1xl font-bold text-white-900'>
        {" "}
        <span>T C R C</span>
        <br />
        <span>회 원 가 입</span>
      </h1>
      <BackButton />
    </header>
  );
};
