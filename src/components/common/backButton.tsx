import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";

const BackButton = () => {
  const router = useRouter();

  const onClickBtn = () => {
    router.back(); // Move to the previous page
  };

  return (
    <button
      onClick={onClickBtn}
      className="text-white text-1xl focus:outline-none"
    >
      <BiArrowBack className="icon" size={40} />
    </button>
  );
};

export default BackButton;