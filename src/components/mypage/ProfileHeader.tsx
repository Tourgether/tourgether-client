import { useEffect, useState } from "react";
import styles from "../../styles/mypage/ProfileHeader.module.css";

interface UserInfo {
  provider: string;
  nickname: string;
  profileImage: string;
  languageId: number;
  languageCode: string;
}

export default function ProfileHeader() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("userInfo");
    if (raw) {
      try {
        setUser(JSON.parse(raw) as UserInfo);
      } catch {
        console.warn("userInfo 파싱 실패");
      }
    }
  }, []);

  if (!user) return null;

  return (
    <div className={styles.headerContainer}>
      <img
        className={styles.profileImage}
        src={user.profileImage}
        alt={user.nickname}
      />
      <h2 className={styles.userName}>{user.nickname}</h2>
    </div>
  );
}
