import { TopBar } from "@/components/organisms/TopBar";
import SignupForm from "./_components/SignupForm";

export default function SignupPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--tcrc-bg-primary)" }}>
      <TopBar
        title="T.C.R.C"
        subtitle="회원가입"
        accent="var(--tcrc-accent-green)"
        textColor="#06210F"
      />
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <SignupForm />
      </div>
    </div>
  );
}
