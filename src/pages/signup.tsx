import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useSession } from "next-auth/react";
import BackButton from "../components/common/backButton";
import CustomModal from "../components/common/CustomModal";


export default function Signup() {

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { data: session, status } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session && status === "authenticated") {
      console.log("User Email from session:", session);
      setName(session?.user.name);
      setEmail(session?.user.email);
    }
  }, [session, status]);



  async function signUpUser() {
    // 사용자 가입 처리
    
    // 여기에서 Supabase를 사용하여 추가 정보를 저장합니다.
    // 예를 들어, 사용자의 이름과 년생을 저장하는 코드를 추가할 수 있습니다.
    const { data, error } = await supabase
     .from("user")
      .insert([{ name, birthYear, email ,activation:true}])
      .single();

    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }

    // 에러 처리
    if (error) {
      setModalIsOpen(true); // 모달 열기
      setErrorMessage("회원가입 에러 발생, 운영진에게 문의하세요."); // 에러 메시지 설정
      return; // 함수 종료
    }
    

    return data;
  }

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{10,11}$/i;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;


  const handleBirthYear = (e) => {
    setBirthYear(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async () => {

    const data = await signUpUser();


    // 가입 성공 시, 사용자 정보를 'users_test' 테이블에 저장
    if (data) {

      const userData = data.user;
      const user_id = userData.id;
      const user_metadata = userData.user_metadata;

      const userAge = user_metadata.age;
      const created_at = userData.created_at;
      const updated_at = userData.updated_at;

      // console.log("user_id: ", user_id);
      // console.log("username: ", username);
      // console.log("userAge: ", userAge);
      // console.log("created_at: ", created_at);
      // console.log("updated_at: ", updated_at);

      const { data: insertData, error: insertError } = await supabase
        .from("users_test")
        .insert([
          {
            user_id: user_id, // Supabase에서 생성된 사용자 ID
            name: name,
            age: userAge,
            created_at: created_at, // 현재 시간을 ISO 문자열로
            updated_at: updated_at, // 현재 시간을 ISO 문자열로
            activation:"FALSE"
          },
        ]);

      // 추가 정보 저장 시 에러 처리
   
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
              onChange={handleName}
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
              name='birthYear'
              value={birthYear}
              onChange={handleBirthYear}
              placeholder='94'
            />
          </div>


          <div className='flex flex-col p-1'>
            <label
              className='font-bold mb-2 text-left text-white'
              htmlFor='name'
            >
              휴대폰번호 뒷번호 4자리
            </label>
            <input
              className='form-input py-2 px-3 focus:outline-none  border rounded-md'
              type='number'
              name='phoneNumber'
              value={phoneNumber}
              onChange={handleBirthYear}
              placeholder='94'
            />
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
              onChange={handleEmail}
              placeholder='abc@gmail.com'
            />
            {/* {emailError ? <p className='text-white'>{emailError}</p> : null} */}
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
        </div>
      </main>
    </div>
  );
}
