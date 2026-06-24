import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser } from "@/lib/domain/admin/queries";
import { getUserMonthlyCounts } from "@/lib/domain/meeting/queries";
import { currentYearMonthKST, formatYM, monthRangeFromYM } from "@/lib/time";
import HomeClient from "./_components/HomeClient";

export default async function Page() {
  const session = await getServerSession(authOptions);
  let isAdmin = false;
  let monthlyParticipation = 0;
  let monthlyFounder = 0;
  if (session?.user?.id) {
    const { startDay, endDay } = monthRangeFromYM(formatYM(currentYearMonthKST()));
    const [adminFlag, counts] = await Promise.all([
      isAdminUser(session.user.id),
      getUserMonthlyCounts({ accountId: session.user.id, startDay, endDay }),
    ]);
    isAdmin = adminFlag;
    monthlyParticipation = counts.participation;
    monthlyFounder = counts.founder;
  }
  return (
    <HomeClient
      isAdmin={isAdmin}
      monthlyParticipation={monthlyParticipation}
      monthlyFounder={monthlyFounder}
    />
  );
}
