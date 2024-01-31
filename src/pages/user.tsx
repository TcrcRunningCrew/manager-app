import React, { useState, useEffect } from "react";
import BackButton from "../components/common/backButton";
import CustomModal from "../components/common/CustomModal";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
export default function Userinfoform() {
  const router = useRouter();

  const { data: session } = useSession(); // Get the user's session data

  const [username, setUsername] = useState<string>("");
  const [userAge, setUserAge] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "userAge":
        setUserAge(value);
        break;
      default:
        break;
    }
  };

  const openModalWithMessage = (message: string) => {
    setModalIsOpen(true);
    setErrorMessage(message);
  };

  const openSuccessModalWithMessage = (message: string) => {
    setSuccessModalIsOpen(true);
    setMessage(message);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalIsOpen(false);
    router.push("/");
  };

  const handleSubmit = async () => {
    if (!username || !userAge) {
      openModalWithMessage("이름과 년생을 확인해주세요");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("name", username)
      .eq("age", userAge);

    if (data && data.length > 0) {
      const { error } = await supabase.from("users").insert([
        {
          name: username,
          age: userAge,
        },
      ]);

      if (error) {
        console.log("error: ", error);
        openModalWithMessage("출석체크 에러 운영진 문의");
      } else {
        openSuccessModalWithMessage("출석 완료");
      }
    } else {
      openModalWithMessage("회원이 아닙니다. 회원가입 바랍니다");
    }
  };

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-black'>
      <header className='flex items-center justify-between px-6 py-4 bg-green-500 text-white'>
        <h1 className='text-1xl font-bold text-white-900'>
          {" "}
          <span>T C R C</span>
          <br />
          <span>회원가입</span>
        </h1>
        <BackButton />
      </header>
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <div className='flex flex-col p-1'>
            <label
              className='font-bold mb-2 text-left text-white'
              htmlFor='name'
            >
              이름
            </label>
            <input
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              type='text'
              name='username'
              value={username}
              onChange={handleInputChange}
              placeholder='홍길동'
            />
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
              name='userAge'
              value={userAge}
              onChange={handleInputChange}
              placeholder='94'
            />
          </div>

          <div className='flex flex-col p-1'>
            <label></label>
            <button
              onClick={handleSubmit}
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
