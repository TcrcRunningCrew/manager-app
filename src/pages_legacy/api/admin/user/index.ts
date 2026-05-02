import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

//유저 활동 활성화 및 정지
export async function updateUserActivation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { userId, activation } = req.body;

    const { data, error } = await supabase
      .from("user")
      .update({ activation: activation })
      .eq("userId", userId)
      .select();


    if (data && data.length > 0) {
        console.log("🚀 ~ data:", data)
      return res
        .status(200)
        .json({ data });
    }

    if (error) {
      return res.status(401).json({ error: error });
    }
  } else {
    // POST 메소드가 아닐 경우의 처리
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

//유저  LIST 가져오기
export async function getAllUserList(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const METHOD = "GET";
    if (req.method === METHOD) {
      const { userId, activation } = req.body;
  

      let { data: user, error } = await supabase
      .from('user')
      .select('*')
              
  
      if (user && user.length > 0) {
          console.log("🚀 ~ data:", user)
        return res
          .status(200)
          .json({ user });
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
  