import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

//모임 정보 가져오기 일자별
export async function getMeetingByMeetingDate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const METHOD = "GET";
  if (req.method === METHOD) {
    const { meetingDate } = req.body;

    let { data: meeting, error } = await supabase
      .from("meeting")
      .select("*")
      .eq("meeting_date", meetingDate);

    if (meeting && meeting.length > 0) {
      console.log("🚀 ~ meeting:", meeting);
      return res.status(200).json({ meeting });
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


//모임 정보 수정
export async function updateMeetingByUserId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const METHOD = "GET";
  if (req.method === METHOD) {
    const { 
        name,
        email,
        birthYear,
        meeting_date,
        activation,
        location,
        founder,
        userId 
    } = req.body;


    const { data, error } = await supabase
    .from('meeting')
    .update({ 
        name,
        email,
        birthYear,
        meeting_date,
        activation,
        location,
        founder
    })
    .eq('accountId', userId)
    .select()
            

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
