import styles from "../../styles/mypage/MenuCard.module.css";
import { Globe, Heart, Copy, LogOut } from "lucide-react";

const menuList = [
  { icon: <Globe size={24} strokeWidth={1.5} />, label: "Language" },
  { icon: <Heart size={24} strokeWidth={1.5} />, label: "Liked" },
  { icon: <Copy size={24} strokeWidth={1.5} />, label: "Visit History" },
  {
    icon: <LogOut size={24} strokeWidth={1.5} color="#E74C3C" />,
    label: "Log out",
  },
];

export default function MenuCard() {
  return (
    <div className={styles.cardContainer}>
      {menuList.map((item, idx) => (
        <div key={idx}>
          <div className={styles.menuItem}>
            <div className={styles.iconWithText}>
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span className={styles.arrow}>&gt;</span>
          </div>
          {idx < menuList.length - 1 && <div className={styles.divider} />}
        </div>
      ))}
    </div>
  );
}
