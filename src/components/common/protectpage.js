import { useSession, signIn, signOut } from 'next-auth/react';

function ProtectedPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>이 페이지는 로그인이 필요한 페이지입니다.</p>
        <button onClick={() => signIn('credentials')}>로그인</button>
      </div>
    );
  }

  return (
    <div>
      <p>안녕하세요, {session.user.name}님!</p>
      <button onClick={() => signOut()}>로그아웃</button>
    </div>
  );
}

export default ProtectedPage;