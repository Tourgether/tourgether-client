import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../../styles/mypage/MenuCard.module.css";
import { Globe, Heart, Copy, LogOut, UserX } from "lucide-react";

export default function MenuCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuList = [
    {
      icon: <Globe size={24} strokeWidth={1.5} />,
      label: t("mypage.language"),
      onClick: () => navigate("/mypage/language"),
    },
    {
      icon: <Heart size={24} strokeWidth={1.5} />,
      label: t("mypage.liked"),
      onClick: () => navigate("/mypage/liked"),
    },
    {
      icon: <Copy size={24} strokeWidth={1.5} />,
      label: t("mypage.visitHistory"),
      onClick: () => navigate("/mypage/visits"),
    },
    {
      icon: <LogOut size={24} strokeWidth={1.5} color="#E74C3C" />,
      label: t("mypage.logout"),
    },
    {
      icon: <UserX size={24} strokeWidth={1.5} color="#E74C3C" />,
      label: t("mypage.withdraw"),
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
