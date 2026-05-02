import { TopBar } from "@/components/organisms/TopBar";
import CheckoutForm from "./_components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        background: "var(--tcrc-bg-primary)",
      }}
    >
      <TopBar
        title="T.C.R.C"
        subtitle="출석체크"
        accent="var(--tcrc-accent-green)"
        textColor="#fff"
      />
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <CheckoutForm />
      </div>
    </div>
  );
}
