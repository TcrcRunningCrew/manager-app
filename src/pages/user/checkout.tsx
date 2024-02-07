import React, { useState, useEffect } from "react";
import CustomModal from "../../components/common/CustomModal";
import Header from "../../components/common/header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ExtendedSession } from "../../components/common/extendedSession";
import {
  findUserByAccountId,
  insertMeeting,
} from "../../services/user.service";

export default function Checkout() {
  const router = useRouter();

  const { register, setValue, handleSubmit, getValues } = useForm({
    shouldFocusError: true,
    mode: "onBlur",
    defaultValues: {
      username: "",
      userAge: "",
      participationDate: new Date().toISOString().split("T")[0],
      activation: "1",
      location: "1",
      isFounder: false,
    },
  });

  const { data: session, update, status } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const {
    username,
    userAge,
    participationDate,
    activation,
    location,
    isFounder,
  } = getValues();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user &&
      session.user.name &&
      session.user.email
    ) {
      setValue("username", session.user.name);
      setValue("userAge", (session as ExtendedSession).user?.birthYear || "");
      setUserEmail(session.user.email);
      setUserId((session as ExtendedSession).user?.id || "");
    }

    setValue("participationDate", participationDate);
    setValue("activation", activation);
    setValue("location", location);
    setValue("isFounder", isFounder);
  }, [
    activation,
    isFounder,
    location,
    participationDate,
    session,
    setValue,
    status,
  ]);

  const openModalWithMessage = (message) => {
    setModalIsOpen(true);
    setErrorMessage(message);
  };

  const openSuccessModalWithMessage = (message) => {
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

  const strDateConvert = (date) => {
    const [year, month, day] = date.split("-");
    return new Date(year, month - 1, day);
  };

  const onSubmit = async () => {
    // console.log("userId: ", userId);
    const data = await findUserByAccountId(userId);

    // console.log("data: ", data);

    if (data && data.length > 0) {
      // console.log("====checkout3====activation: ", activation);
      // console.log("====checkout3====location: ", location);
      // console.log("====checkout3====isFounder: ", isFounder);

      const result = await insertMeeting(
        userId,
        username,
        userEmail,
        userAge,
        strDateConvert(participationDate),
        getValues("activation"),
        getValues("location"),
        getValues("isFounder")
      );

      // console.log('result: ', result);

      if (result) {
        openSuccessModalWithMessage("출석 완료");
      } else {
        openModalWithMessage("출석체크 에러 운영진 문의");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col p-1'>
              <label className=' mb-2 text-left text-white' htmlFor='name'>
                이름
              </label>
              <input
                className='font-bold form-input py-2 px-3 focus:outline-none border rounded-md opacity-100 text-black'
                type='text'
                {...register("username")}
                placeholder='홍길동'
                disabled
              />
            </div>

            {/* 년생 입력 */}
            <div className='flex flex-col p-1'>
              <label
                className='font-bold mb-2 text-left text-white'
                htmlFor='name'
              >
                년생
              </label>
              <input
                className='font-bold form-input py-2 px-3 focus:outline-none  border  rounded-md opacity-100 text-black'
                type='number'
                {...register("userAge")}
                placeholder='94'
                disabled
              />
            </div>

            {/* 참여일 입력 */}
            <div className='flex flex-col p-1'>
              <label
                className='mb-2 font-bold text-left  text-white'
                htmlFor='date'
              >
                참여일
              </label>
              <input
                className='form-input py-2 px-3 focus:outline-none  border rounded-md'
                type='date'
                {...register("participationDate")}
              />
            </div>

            {/* 운동종류 선택 */}
            <div className='flex flex-col p-1'>
              <label className='mb-2 font-bold text-left  text-white'>
                운동종류
              </label>
              <select
                className='form-input py-2 px-3 focus:outline-none  border rounded-md'
                defaultValue='1'
                {...register("activation")}
              >
                <option value='1'>러닝</option>
                <option value='2'>등산</option>
                <option value='3'>자전거</option>
                <option value='4'>기타</option>
              </select>
            </div>

            {/* 장소 선택 */}
            <div className='flex flex-col p-1'>
              <label
                className='mb-2 font-bold text-left  text-white'
                htmlFor='location'
              >
                장소
              </label>
              <select
                className='form-input py-2 px-3 focus:outline-none  border rounded-md'
                defaultValue='1'
                {...register("location")}
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

            {/* 개설자여부 선택 */}
            <div className='flex flex-col p-1'>
              <label
                className='mb-2 font-bold text-left  text-white'
                htmlFor='isFounder'
              >
                개설자여부
              </label>
              <select
                className='form-input py-2 px-3 focus:outline-none  border rounded-md'
                defaultValue='false'
                {...register("isFounder")}
              >
                <option value='false'>모임 개설자 X</option>
                <option value='true'>모임 개설자 O</option>
              </select>
            </div>

            <div className='flex flex-col p-1'>
              <label></label>
              <button
                type='submit'
                className='text-white bg-green-500 border-0 py-3 px-8 focus:outline-none hover:bg-green-600 rounded text-lg'
              >
                출석체크
              </button>
            </div>
          </form>

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
