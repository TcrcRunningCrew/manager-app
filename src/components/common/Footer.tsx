import Link from "next/link";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <div className="border-t border-gray-300 flex flex-col items-center justify-center text-gray-300 pb-1.5">
      <h1 className="mt-2 text">
        Built with{" "}
        <Link href="https://nextjs.org/">
          <span className="text-f35815 cursor-pointer">Nextjs</span>
        </Link>{" "}
        and{" "}
        <Link href="https://supabase.com/">
          <span className="text-f35815 cursor-pointer">Supabase</span>
        </Link>
      </h1>
      <Link href="">
        <p className="underline cursor-pointer mt-1">Github Repo</p>
      </Link>
    </div>
  );
};

export default Footer;
