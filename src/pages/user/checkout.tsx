import React, { useState, useEffect } from "react";
import CustomModal from "../../components/common/CustomModal"
import Header from "../../components/common/header";
import { useSession } from "next-auth/react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [participationDate, setParticipationDate] = useState<string>("");
  const [activation, setActivation] = useState<string>("1");
  const [userEmail, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("1");
  const [isFounder, setIsFounder] = useState<boolean>(false);
  const [userAge, setUserAge] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && status === "authenticated" && session.user) {
      setUsername(session.user.name || "");
      setEmail(session.user.email || "");
      console.log("session: ", session);
    }

    const currentDate = new Date().toISOString().split("T")[0];
    setParticipationDate(currentDate);
  }, [session, status]);

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
      case "participationDate":
        setParticipationDate(value);
        break;
      case "activation":
        setActivation(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "isFounder":
        setIsFounder(value === "2");
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
    if (!username) {
      openModalWithMessage("이름을 확인해주세요");
      return;
    }
    username
    const { data } = await supabase
      .from("user")
      .select("*", { count: "exact" })
      .eq("name", username)
      .eq("email", userEmail);


    if (data && data.length > 0) {
      const { error } = await supabase.from("meeting").insert([
        {
          name: username,
          email: userEmail,
          birthYear: userAge,
          meeting_date: participationDate,
          activation,
          location,
          founder: isFounder,
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
      <Header bgColor={"bg-green-500"} text1={"T C R C"} text2={"출석체크"} />
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <div className='flex flex-col p-1'>
            <label className=' mb-2 text-left text-white' htmlFor='name'>
              이름
            </label>
            <input
              className='font-bold form-input py-2 px-3 focus:outline-none border rounded-md opacity-100 text-black'
              type='text'
              name='username'
              value={username}
              onChange={handleInputChange}
              placeholder='홍길동'
              disabled
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
            <label
              className='mb-2 font-bold text-left  text-white'
              htmlFor='date'
            >
              참여일
            </label>
            <input
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              id='date'
              type='date'
              value={participationDate}
              onChange={handleInputChange}
            />
          </div>

          <div className='flex flex-col p-1'>
            <label
              className='mb-2 font-bold text-left  text-white'
              htmlFor='type'
            >
              운동종류
            </label>
            <select
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              onChange={handleInputChange}
              value={activation}
            >
              <option value='1'>러닝</option>
              <option value='2'>등산</option>
              <option value='3'>자전거</option>
              <option value='4'>기타</option>
            </select>
          </div>

          <div className='flex flex-col p-1'>
            <label
              className='mb-2 font-bold text-left  text-white'
              htmlFor='location'
            >
              장소
            </label>
            <select
              onChange={handleInputChange}
              value={location}
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
            >
              <option value='1'>태평_탄천</option>
              <option value='2'>서현_황새울공원</option>
              <option value='3'>야탑_탄천종합운동장</option>
              <option value='4'>모란_성남종합운동장</option>
              <option value='5'>위례</option>
              <option value='6'>정자</option>
              <option value='7'>판교</option>
              <option value='8'>그 외</option>
            </select>
          </div>

          <div className='flex flex-col p-1'>
            <label
              className='mb-2 font-bold text-left  text-white'
              htmlFor='isFounder'
            >
              개설자여부
            </label>
            <select
              onChange={handleInputChange}
              value={isFounder ? "true" : "false"}
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
            >
              <option value='false'>모임 개설자 X</option>
              <option value='true'>모임 개설자 O</option>
            </select>
          </div>

          <div className='flex flex-col p-1'>
            <label></label>
            <button
              onClick={handleSubmit}
              className='text-white bg-green-500 border-0 py-3 px-8 focus:outline-none hover:bg-green-600 rounded text-lg'
            >
              출석체크
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
