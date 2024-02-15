import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import BackButton from "../components/common/backButton";
import CustomModal from "../components/common/CustomModal";
import { useForm } from "react-hook-form";
import { signup, findUserByAccountId ,updateuUserInfo} from "@/services/user.service";
import { ExtendedSession } from "../components/common/extendedSession";
import {sendMessageToSlack} from "../utils/slackMessage";


export default function Signup() {
  
  const router = useRouter();
  const { register, setValue, formState, handleSubmit, getValues } = useForm({
    shouldFocusError: true,
    mode: "onBlur",
    defaultValues: {
      name: "",
      birthYear: "",
      email: "",
    },
  });

  const { data: session, update, status } = useSession(); // useSession 훅을 사용할 때 확장된 세션 인터페이스를 제네릭으로 지정합니다.
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // console.log("==signupPatge==session: ", session);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user &&
      session.user.name &&
      session.user.email
    ) {
      setValue("name", session.user.name);
      setValue("email", session.user.email);
    }
  }, [session, setValue, status]);

  async function signUpUser() {
    const { name, birthYear, email } = getValues();

    try {
      if (
        status === "authenticated" &&
        session.user &&
        session.user.name &&
        (session as ExtendedSession).user?.id
      ) {
        const accountId = (session as ExtendedSession).user?.id ||"";
        const res = await findUserByAccountId(accountId?? "");
        if (res && res.length > 0 && res[0]) {
          await updateuUserInfo({
            name, birthYear, email, accountId
          });
        } else {
          const res = await signup({
            name,
            birthYear,
            email,
            accountId,
          });
        }
      }

      await update({
        name,
        email,
        birthYear,
      });

      await  sendMessageToSlack(
        `회원등록/${name}/${birthYear}/${email}`
      );
      
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
              {...register("name", {
                required: true,
                maxLength: 5,
                minLength: 2,
              })}
              placeholder='홍길동'
            />
            <p className='text-white'>
              {formState.errors.name ? "이름을 2~5 글자까지 입력해주세요." : ""}
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
              {...register("birthYear", {
                required: true,
                pattern: /^\d{2}$/,
              })}
              placeholder='94'
            />
            <p className='text-white'>
              {formState.errors.birthYear
                ? "태어난연도의 뒤 2글자만 입력해주세요 ex) 1992년생: 92"
                : ""}
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
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              })}
              placeholder='abc@gmail.com'
            />
            <p className='text-white'>
              {formState.errors.email ? "이메일형식으로 입력해주세요" : ""}
            </p>
          </div>

          <div className='flex flex-col p-1'>
            <label></label>
            <button
              onClick={handleSubmit(signUpUser)}
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
