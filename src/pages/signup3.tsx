import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useSession } from "next-auth/react";

const Signup = () => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && status === "authenticated") {
      console.log("User Email from session:", session);
      setName(session?.user.name);
      setEmail(session?.user.email);
    }
  }, [session, status]);

  // if(session?.user){
  //   setName(String(session?.user.name));
  //   setEmail(String(session?.user.email));
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("name: ", name);
    console.log("birthYear: ", birthYear);
    console.log("email: ", email);
    console.log("phoneNumber: ", phoneNumber);

    // 여기에서 Supabase를 사용하여 추가 정보를 저장합니다.
    // 예를 들어, 사용자의 이름과 년생을 저장하는 코드를 추가할 수 있습니다.
    const { data, error } = await supabase
      .from("user")
      .insert([{ name, birthYear, phoneNumber, email }])
      .single();

    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'
        >
          이름
        </label>
        <input
          type='text'
          id='name'
          value={name}
          placeholder='홍길동'
          onChange={(e) => setName(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
        />
      </div>
      <div>
        <label
          htmlFor='birthYear'
          className='block text-sm font-medium text-gray-700'
        >
          년생
        </label>
        <input
          type='text'
          id='birthYear'
          value={birthYear}
          placeholder='94'
          onChange={(e) => setBirthYear(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
        />
      </div>
      <div>
        <label
          htmlFor='birthYear'
          className='block text-sm font-medium text-gray-700'
        >
          휴대폰번호 뒷4자리
        </label>
        <input
          type='text'
          id='phoneNumber'
          value={phoneNumber}
          placeholder='3452'
          onChange={(e) => setPhoneNumber(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
        />
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          이메일
        </label>
        <input
          type='text'
          id='email'
          value={email}
          placeholder='test@google.com'
          onChange={(e) => setPhoneNumber(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
        />
      </div>
      <button
        type='submit'
        className='w-full bg-blue-500 text-white rounded-md p-2'
      >
        회원가입
      </button>
    </form>
  );
};

export default Signup;
