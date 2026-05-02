import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

//메뉴 활성화여부
export async function updateMenuUse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const METHOD = "PUT";
  if (req.method === METHOD) {
    const { menuName, use } = req.body;

    const { data, error } = await supabase
      .from("menu")
      .update({ use: use })
      .eq("name", menuName)
      .select();

    if (data && data.length > 0) {
      console.log("🚀 ~ data:", data);
      return res.status(200).json({ data });
    }

    if (error) {
      return res.status(401).json({ error: error });
    }
  } else {
    // POST 메소드가 아닐 경우의 처리
    res.setHeader("Allow", [METHOD]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

