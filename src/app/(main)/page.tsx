import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser } from "@/lib/domain/admin/queries";
import HomeClient from "./_components/HomeClient";

export default async function Page() {
  const session = await getServerSession(authOptions);
  let isAdmin = false;
  if (session?.user?.id) {
    isAdmin = await isAdminUser(session.user.id);
  }
  return <HomeClient isAdmin={isAdmin} />;
}
