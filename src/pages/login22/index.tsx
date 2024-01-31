// import { signIn } from "next-auth/react";
// import { useSession } from "next-auth/react";
// const LoginPage = () => {
//   const { data: session } = useSession(); // Get the user's session data

//   const handleLoginWithKakao = async () => {
//     //이미 회원가입을 한 경 우 홈페이지로 이동
//     if (session) {
//       await signIn("kakao", { callbackUrl: "/" });
//       //이미 회원가입을 안한 경 우 유저 정보 입력 창으로 이동
//     } else {
//       await signIn("kakao", { callbackUrl: "/user" });
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleLoginWithKakao}>Login with Kakao</button>
//     </div>
//   );
// };

// export default LoginPage;
