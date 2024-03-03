import React, { useState, useEffect } from "react";
import CustomModal from "../../components/common/CustomModal";
import Header from "../../components/common/header";
import ScanQRCode from "../../components/utils/qrScan";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function qrCheck() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  const { register, setValue, handleSubmit, getValues } = useForm({
    shouldFocusError: true,
    mode: "onBlur",
    defaultValues: {
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

  const { participationDate, activation, location } = getValues();

  useEffect(() => {
    setValue("participationDate", participationDate);
    setValue("activation", activation);
    setValue("location", location);
  }, [activation, location, participationDate, session, setValue, status]);

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


  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    setFormData(data); // 폼 데이터 저장
    setIsSubmitted(true); // ScanQRCode 컴포넌트 렌더링을 위해 상태 변경
  };

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-black'>
      <Header bgColor={"bg-blue-500"} text1={"T C R C"} text2={"QR출석체크"} />
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        {isSubmitted ? (
          <ScanQRCode
          participationDate={formData.participationDate}
          activation={formData.activation}
          location={formData.location}
          isFounder={formData.isFounder}
           />
        ) : (
          <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 참여일 입력 */}
              <div className='flex flex-col p-1'>
                <label
                  className='mb-2 font-bold text-left  text-white'
                  htmlFor='date'
                >
                  모임개설일
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
                  모임장소
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

              <div className='flex flex-col p-1 pt-5'>
                <button
                  type='submit'
                  className='text-white bg-blue-500 border-0 py-3 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg'
                >
                  QR 체크 시작
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
        )}
      </main>
    </div>
  );
}
