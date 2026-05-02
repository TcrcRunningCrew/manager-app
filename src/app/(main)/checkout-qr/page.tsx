"use client";

import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/organisms/PageHeader";
import { useMemo } from "react";

export default function CheckoutQRPage() {
  const { data: session, status } = useSession();

  const qrValue = useMemo(() => {
    if (
      status === "authenticated" &&
      session?.user?.name &&
      session?.user?.email &&
      session?.user?.id
    ) {
      return JSON.stringify({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      });
    }
    return "";
  }, [status, session]);

  if (!session || !qrValue) return null;

  return (
    <div className="flex flex-col min-h-screen bg-tcrc-bg-primary text-tcrc-text-primary">
      <PageHeader title="T C R C" subtitle="QR출석체크" bgColor="bg-tcrc-accent-blue" />
      <div className="flex-1 p-6 py-10">
        <div className="flex justify-center items-center animate-scale-in">
          <div className="p-8 bg-white rounded-tcrc-lg shadow-lg">
            <QRCode
              value={qrValue}
              size={256}
              level="H"
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
        </div>
        <div className="py-16">
          <div className="rounded-tcrc-lg bg-tcrc-accent-blue p-6 mx-auto w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="text-tcrc-title2 mb-2">{session.user.name}</div>
              <div className="text-tcrc-body text-tcrc-text-secondary">{session.user.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
