// pages/api/util/checkout.js
import { supabase } from "../../utils/supabaseClient"; // Supabase 클라이언트 초기화

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, username, userEmail, userAge, participationDate, activation, location, isFounder } = req.body;

    const { data, error } = await supabase
      .from('meeting')
      .insert([
        {
          accountId: userId,
          name: username,
          email: userEmail,
          birthYear: userAge,
          meeting_date: participationDate,
          activation: activation,
          location: location,
          founder: isFounder,
        },
      ]);

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json({ message: "출석체크가 성공적으로 완료되었습니다.", data });
  } else {
    // POST 메소드가 아닐 경우의 처리
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
