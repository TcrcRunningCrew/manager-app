import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // 사용자 프로필 정보를 가져오는 로직을 추가합니다.
    // 예를 들어, Supabase에서 사용자의 이름과 년생을 가져와 표시할 수 있습니다.
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">프로필</h1>
      {/* 프로필 정보 표시 */}
    </div>
  );
};

export default Profile;
