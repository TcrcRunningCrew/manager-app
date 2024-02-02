import { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">프로필</h1>
      {/* 프로필 정보 표시 */}
    </div>
  );
};

export default Profile;
