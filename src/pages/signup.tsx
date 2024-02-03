import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useSession } from "next-auth/react";
import BackButton from "../components/common/backButton";
import CustomModal from "../components/common/CustomModal";
import sendErrorToSlack from "./api/sendToSlack";


export default function Signup() {
  const [name, setName] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [birthYearErrorMessage, setBirthYearErrorMessage] =
    useState<string>("");

  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session && status === "authenticated" && session.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }

    const emailRegEx = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const nameRegex = /^.{2,5}$/; // 문자열이며 2글자 이상에서 5글자이내
    const birthdayYearRegex = /^\d{2}$/; //숫자형태의 문자열이며 2글자여야한다.

    const nameCheck = nameRegex.test(name);
    const emailCheck = emailRegEx.test(email);
    const birthdayYearCheck = birthdayYearRegex.test(birthYear);

    nameCheck == true
      ? setNameErrorMessage("")
      : setNameErrorMessage("이름의 양식을 확인바랍니다.");
    emailCheck == true
      ? setEmailErrorMessage("")
      : setEmailErrorMessage("이메일 양식확인 바랍니다.");
    birthdayYearCheck == true
      ? setBirthYearErrorMessage("")
      : setBirthYearErrorMessage("태어난년생 뒷자기 2글자");

  }, [session, status, name, email, birthYear]);

  async function signUpUser() {
    const { data, error } = await supabase
      .from("user")
      .insert([{ name, birthYear, email, activation: true }])
      .single();


    // 에러 처리
    if (error) {
      setModalIsOpen(true);
      setErrorMessage("회원가입 에러 발생, 운영진에게 문의하세요.");
      sendErrorToSlack(`"회원가입 에러 발생, 운영진에게 문의하세요."${error}`)
      return;
    }

    return data;
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalIsOpen(false);
    router.push("/");
  };

  const handleSubmit = async () => {
    if (
      nameErrorMessage == "" &&
      emailErrorMessage == "" &&
      birthYearErrorMessage == ""
    ) {
      await signUpUser();
      openSuccessModalWithMessage("회원가입 완료");
    }
  };

  const openSuccessModalWithMessage = (message: string) => {
    setSuccessModalIsOpen(true);
    setMessage(message);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "birthYear":
        setBirthYear(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-black'>
      <header className='flex items-center justify-between px-6 py-4 bg-green-500 text-white'>
        <h1 className='text-1xl font-bold text-white-900'>
          {" "}
          <span>T C R C</span>
          <br />
          <span>회 원 가 입</span>
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
              name='name'
              value={name}
              onChange={handleInputChange}
              placeholder='홍길동'
            />
            <p className='text-white'>{nameErrorMessage}</p>
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
              name='birthYear'
              value={birthYear}
              onChange={handleInputChange}
              placeholder='94'
            />
            <p className='text-white'>{birthYearErrorMessage}</p>
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
              name='email'
              value={email}
              onChange={handleInputChange}
              placeholder='abc@gmail.com'
            />
            <p className='text-white'>{emailErrorMessage}</p>
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
