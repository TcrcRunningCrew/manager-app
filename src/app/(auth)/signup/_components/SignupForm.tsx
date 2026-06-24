"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { signupAction, reportSignupError } from "../actions";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    const accountId = session?.user?.id;
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

    if (status !== "authenticated" || !accountId) {
      const message = `로그인 세션이 없습니다. (status=${status})`;
      console.error("[signup]", message);
      void reportSignupError({ stage: "session-guard", message, userAgent });
      setErrorDialog({
        open: true,
        message: "로그인 정보가 만료되었습니다. 다시 로그인해주세요.",
      });
      return;
    }

    const raw = getValues();
    // birthYear가 4자리(예: 1994)로 자동완성된 경우 뒤 2자리만 저장
    const birthYear = raw.birthYear.length === 4 ? raw.birthYear.slice(-2) : raw.birthYear;
    const { name, email } = raw;

    setIsSubmitting(true);
    try {
      const result = await signupAction({ name, birthYear, email });
      if (!result.success) {
        const messageByReason: Record<string, string> = {
          unauthenticated: "로그인이 필요합니다. 다시 로그인해주세요.",
          invalid_name: "이름을 2~5 글자까지 입력해주세요.",
          invalid_birth_year: "태어난 연도를 2자리 또는 4자리로 입력해주세요.",
          invalid_email: "이메일 형식이 올바르지 않습니다.",
        };
        setErrorDialog({
          open: true,
          message: messageByReason[result.reason] ?? "입력값을 확인해주세요.",
        });
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[signup] signupAction failed", err);
      void reportSignupError({
        stage: "signupAction",
        message,
        userAgent,
      });
      setErrorDialog({
        open: true,
        message: "회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
      setIsSubmitting(false);
      return;
    }

    // 세션 동기화는 별도. 실패해도 가입 자체는 성공으로 처리.
    try {
      await update({ name, email, birthYear });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[signup] session update failed (non-fatal)", err);
      void reportSignupError({
        stage: "session-update",
        message,
        userAgent,
      });
    }

    setSuccessDialog({ open: true, message: "회원가입 완료" });
    setIsSubmitting(false);
  }

  const buttonDisabled =
    isSubmitting || status === "loading" || status === "unauthenticated";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 이메일 동의 안내 */}
      <div
        style={{
          background: "#FEE50022",
          border: "1px solid #FEE500",
          borderRadius: "var(--card-radius)",
          padding: "12px 14px",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          animation: "slide-up 0.3s ease-out both",
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1.4 }}>⚠️</span>
        <p style={{ fontSize: 13, color: "var(--tcrc-text-primary)", lineHeight: 1.5, margin: 0 }}>
          카카오 로그인 시 <strong>이메일 정보 동의</strong>를 허용해주세요.
          동의하지 않으면 회원가입이 정상적으로 처리되지 않을 수 있습니다.
        </p>
      </div>

      <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0s" }}>
        <label className='field-label'>이름</label>
        <input
          className='field-input ios-input'
          placeholder='홍길동'
          autoComplete='name'
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
          placeholder='94 또는 1994'
          inputMode='numeric'
          autoComplete='off'
          {...register("birthYear", { required: true, pattern: /^(\d{2}|\d{4})$/ })}
        />
        {formState.errors.birthYear && (
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--tcrc-status-error)" }}>
            태어난연도를 2자리(94) 또는 4자리(1994)로 입력해주세요.
          </p>
        )}
      </div>

      <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.14s" }}>
        <label className='field-label'>이메일</label>
        <input
          className='field-input ios-input'
          placeholder='abc@gmail.com'
          type='email'
          autoComplete='email'
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9+\-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
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
          type='button'
          className='btn btn-block btn-tall'
          style={{
            background: "var(--tcrc-accent-green)",
            color: "#fff",
            opacity: buttonDisabled ? 0.6 : 1,
            pointerEvents: buttonDisabled ? "none" : "auto",
          }}
          disabled={buttonDisabled}
          aria-busy={isSubmitting}
          onClick={handleSubmit(signUpUser)}
        >
          {isSubmitting ? "처리 중..." : status === "loading" ? "세션 확인 중..." : "회원가입"}
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
