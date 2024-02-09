

// 예: React 컴포넌트 내에서 사용하는 경우

export const sendMessageToSlack = async (messageData) => {
  const response = await fetch('/api/slack', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });

  if (response.ok) {
    console.log("메시지가 성공적으로 전송되었습니다!");
  } else {
    console.error("메시지 전송 실패");
  }
};
