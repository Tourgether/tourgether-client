import { useNavigate } from "react-router-dom";
import styles from "../../styles/mypage/MenuCard.module.css";
import { Globe, Heart, Copy, LogOut } from "lucide-react";

export default function MenuCard() {
  const navigate = useNavigate();

  const menuList = [
    { icon: <Globe size={24} strokeWidth={1.5} />, label: "Language" },
    {
      icon: <Heart size={24} strokeWidth={1.5} />,
      label: "Liked",
      onClick: () => navigate("/mypage/liked"),
    },
    {
      icon: <Copy size={24} strokeWidth={1.5} />,
      label: "Visit History",
      onClick: () => navigate("/mypage/visits"),
    },
    {
      icon: <LogOut size={24} strokeWidth={1.5} color="#E74C3C" />,
      label: "Log out",
    },
  ];

  return (
    <div className={styles.cardContainer}>
      {menuList.map((item, idx) => (
        <div key={idx} onClick={item.onClick}>
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
