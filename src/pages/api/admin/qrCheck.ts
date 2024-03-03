import type { NextApiRequest, NextApiResponse } from "next";
import {sendMessageToSlack} from "../../../utils/slackMessage";
import {
  findUserByAccountId,
  insertMeeting,
} from "../../../services/user.service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      userId,
      username,
      userEmail,
      participationDate,
      activation,
      location,
      isFounder,
    } = req.body;

    const isUser = await findUserByAccountId(userId);

    if (isUser && isUser.length > 0 && isUser[0].activation == true) {
      const userAge = isUser[0].birthYear;

      const result = await insertMeeting(
        userId,
        username,
        userEmail,
        userAge,
        participationDate,
        activation,
        location,
        isFounder
      );

      return res
      .status(200)
      .json({ message: "출석체크가 성공적으로 완료되었습니다." });
    }

    return res.status(401).json({ error: "출석체크 실패" });
   
  } else {
    // POST 메소드가 아닐 경우의 처리
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
