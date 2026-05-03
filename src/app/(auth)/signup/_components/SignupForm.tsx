"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { signupAction } from "../actions";

export default function SignupForm() {
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

  const { data: session, update, status } = useSession();
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user &&
      session.user.name &&
      session.user.email
    ) {
      setValue("email", session.user.email);
    }
  }, [session, setValue, status]);

  async function signUpUser() {
    const { name, birthYear, email } = getValues();

    try {
      if (
        status === "authenticated" &&
        session?.user &&
        session.user.name &&
        session.user.id
      ) {
        await signupAction({
          name,
          birthYear,
          email,
          accountId: session.user.id,
        });
      }

      await update({ name, email, birthYear });
      setSuccessDialog({ open: true, message: "회원가입 완료" });
    } catch {
      setErrorDialog({
        open: true,
        message: "회원가입 에러 발생, 운영진에게 문의하세요.",
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0s" }}>
        <label className='field-label'>이름</label>
        <input
          className='field-input ios-input'
          placeholder='홍길동'
          {...register("name", { required: true, maxLength: 5, minLength: 2 })}
        />
        {formState.errors.name && (
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--tcrc-status-error)" }}>
            이름을 2~5 글자까지 입력해주세요.
          </p>
        )}
      </div>

      <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.07s" }}>
        <label className='field-label'>년생</label>
        <input
          className='field-input ios-input'
          placeholder='94'
          inputMode='numeric'
          {...register("birthYear", { required: true, pattern: /^\d{2}$/ })}
        />
        {formState.errors.birthYear && (
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--tcrc-status-error)" }}>
            태어난연도의 뒤 2글자만 입력해주세요 ex) 1992년생: 92
          </p>
        )}
      </div>

      <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.14s" }}>
        <label className='field-label'>이메일</label>
        <input
          className='field-input ios-input'
          placeholder='abc@gmail.com'
          type='email'
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          })}
        />
        {formState.errors.email && (
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--tcrc-status-error)" }}>
            이메일형식으로 입력해주세요
          </p>
        )}
      </div>

      <div style={{ marginTop: 8, animation: "slide-up 0.3s ease-out both", animationDelay: "0.21s" }}>
        <button
          className='btn btn-block btn-tall'
          style={{ background: "var(--tcrc-accent-green)", color: "#fff" }}
          onClick={handleSubmit(signUpUser)}
        >
          회원가입
        </button>
      </div>

      <div
        className='t-mono'
        style={{
          color: "var(--tcrc-text-tertiary)",
          textAlign: "center",
          animation: "slide-up 0.3s ease-out both",
          animationDelay: "0.28s",
        }}
      >
        T.C.R.C 러닝크루 멤버 전용
      </div>

      <ConfirmDialog
        isOpen={errorDialog.open}
        onClose={() => setErrorDialog({ open: false, message: "" })}
        message={errorDialog.message}
      />
      <ConfirmDialog
        isOpen={successDialog.open}
        onClose={() => {
          setSuccessDialog({ open: false, message: "" });
          router.push("/");
        }}
        message={successDialog.message}
      />
    </div>
  );
}
