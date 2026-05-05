"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { checkoutAction, type CheckoutRankingData } from "../actions";
import { CheckoutSuccessModal } from "./CheckoutSuccessModal";

const ACTIVITY_OPTIONS = [
  { value: "1", label: "러닝" },
  { value: "2", label: "등산" },
  { value: "3", label: "자전거" },
  { value: "4", label: "기타" },
];

const LOCATION_OPTIONS = [
  { value: "1", label: "태평_탄천" },
  { value: "2", label: "서현_황새울공원" },
  { value: "3", label: "야탑_탄천종합운동장" },
  { value: "4", label: "모란_성남종합운동장" },
  { value: "5", label: "위례" },
  { value: "6", label: "정자" },
  { value: "7", label: "판교" },
  { value: "8", label: "그 외" },
];

const FOUNDER_OPTIONS = [
  { value: "false", label: "모임 개설자 X" },
  { value: "true", label: "모임 개설자 O" },
];

export default function CheckoutForm() {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: "onBlur",
    defaultValues: {
      username: "",
      userAge: "",
      participationDate: new Date().toISOString().split("T")[0],
      activation: "1",
      location: "1",
      isFounder: false,
    },
  });

  const { data: session, status } = useSession();
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    rankingData: CheckoutRankingData | null;
    date: string;
    locationLabel: string;
    activityLabel: string;
  }>({ open: false, rankingData: null, date: "", locationLabel: "", activityLabel: "" });
  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user &&
      session.user.name &&
      session.user.email
    ) {
      setValue("username", session.user.name);
      setValue("userAge", String(session.user.birthYear || ""));
    }
  }, [session, setValue, status]);

  const onSubmit = async () => {
    const result = await checkoutAction({
      participationDate: getValues("participationDate"),
      activation: getValues("activation"),
      location: getValues("location"),
      isFounder: getValues("isFounder"),
    });

    if (result.success) {
      const locationLabel =
        LOCATION_OPTIONS.find((o) => o.value === getValues("location"))?.label ?? "";
      const activityLabel =
        ACTIVITY_OPTIONS.find((o) => o.value === getValues("activation"))?.label ?? "";
      setSuccessModal({
        open: true,
        rankingData: result.rankingData ?? null,
        date: getValues("participationDate"),
        locationLabel,
        activityLabel,
      });
    } else {
      setErrorDialog({ open: true, message: result.message });
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0s" }}>
          <label className="field-label">이름</label>
          <input className="field-input" type="text" placeholder="홍길동" disabled {...register("username")} />
        </div>

        <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.06s" }}>
          <label className="field-label">년생</label>
          <input className="field-input" type="number" placeholder="94" disabled {...register("userAge")} />
        </div>

        <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.12s" }}>
          <label className="field-label">참여일</label>
          <input className="field-input" type="date" {...register("participationDate")} />
        </div>

        <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.18s" }}>
          <label className="field-label">운동종류</label>
          <select className="field-select" defaultValue="1" {...register("activation")}>
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.24s" }}>
          <label className="field-label">장소</label>
          <select className="field-select" defaultValue="1" {...register("location")}>
            {LOCATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ animation: "slide-up 0.3s ease-out both", animationDelay: "0.30s" }}>
          <label className="field-label">개설자 여부</label>
          <select className="field-select" defaultValue="false" {...register("isFounder")}>
            {FOUNDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 8, animation: "slide-up 0.3s ease-out both", animationDelay: "0.36s" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="btn btn-primary btn-block btn-tall"
            style={{
              background: "var(--tcrc-accent-green)",
              color: "#fff",
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "처리 중..." : "출석 체크"}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={errorDialog.open}
        onClose={() => setErrorDialog({ open: false, message: "" })}
        message={errorDialog.message}
      />
      <CheckoutSuccessModal
        isOpen={successModal.open}
        onClose={() => {
          setSuccessModal((s) => ({ ...s, open: false }));
          router.push("/");
        }}
        date={successModal.date}
        locationLabel={successModal.locationLabel}
        activityLabel={successModal.activityLabel}
        rankingData={successModal.rankingData}
      />
    </div>
  );
}
