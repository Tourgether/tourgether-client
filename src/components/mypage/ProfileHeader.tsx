import styles from "../../styles/mypage/ProfileHeader.module.css";

export default function ProfileHeader() {
  return (
    <div className={styles.headerContainer}>
      <img
        className={styles.profileImage}
        src="/assets/custom-pin.png"
        alt="Profile"
      />
      <h2 className={styles.userName}>Robert Williams</h2>
    </div>
  );
}
