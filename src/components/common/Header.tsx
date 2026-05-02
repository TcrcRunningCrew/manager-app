import Link from "next/link";
import BackButton from "./BackButton";

interface HeaderProps {
  bgColor: string;
  text1: string;
  text2: string;
}

const Header: React.FC<HeaderProps> = ({ bgColor, text1, text2 }) => {
  return (
    <header
      className={`flex items-center justify-between px-6 py-4 ${bgColor} text-white`}
    >
      <h1 className="text-1xl font-bold text-white-900">
        <span>
          <Link href="/">{text1}</Link>
        </span>
        <br />
        <span>
          <Link href="/">{text2}</Link>
        </span>
      </h1>
      <BackButton />
    </header>
  );
};

export default Header;
