import i18n from "../i18n";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import styles from "../styles/common/LanguagePage.module.css";
import backButtonStyles from "../styles/common/BackButton.module.css";
import PageContainer from "../components/common/PageContainer";
import api from "../api/core/axios";
import { useTranslation } from "react-i18next";

interface Language {
  id: number;
  languageCode: string;
}

interface MemberInfo {
  provider: string;
  nickname: string;
  profileImage: string;
  languageId: number; // 추가
  languageCode: string;
}

interface Props {
  standalone?: boolean; // 회원가입 시 초기 화면에서 사용
  showBackButton?: boolean; // 마이페이지에서 뒤로가기 버튼 표시
}

export default function LanguagePage({
  standalone = false,
  showBackButton = true,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await api.get("/api/v1/languages");
        setLanguages(res.data);
      } catch (err) {
        console.error("언어 목록 불러오기 실패", err);
      }
    };

    const fetchMemberInfo = async () => {
      try {
        const res = await api.get("/api/v1/members/me");
        setSelectedLang(res.data.data.languageCode);
      } catch (err) {
        console.error("유저 정보 조회 실패", err);
      }
    };

    fetchLanguages();
    fetchMemberInfo();
  }, []);

  const handleSelect = async (langCode: string) => {
    const lang = languages.find((l) => l.languageCode === langCode);
    if (!lang) {
      console.warn("선택된 언어를 찾을 수 없습니다:", langCode);
      return;
    }

    try {
      await api.patch("/api/v1/members/me/languages", {
        languageId: lang.id,
        languageCode: lang.languageCode,
      });

      const res = await api.get("/api/v1/members/me");
      const updatedInfo: MemberInfo = res.data.data;

      localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
      localStorage.setItem("languageId", updatedInfo.languageId.toString());

      setSelectedLang(updatedInfo.languageCode);
      await i18n.changeLanguage(langCode);

      if (standalone) {
        navigate("/home");
      }
    } catch (error) {
      console.error("언어 설정 실패:", error);
    }
  };

  const Content = (
    <div className={styles.page}>
      {showBackButton && (
        <div className={backButtonStyles.buttonRow}>
          <button
            className={backButtonStyles.backButton}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className={backButtonStyles.backIcon} />
          </button>
        </div>
      )}

      <h2 className={styles.title}>Language</h2>
      <div className={styles.divider} />

      <div className={styles.languageList}>
        {languages.map((lang) => (
          <button
            key={lang.languageCode}
            className={`${styles.languageItem} ${
              selectedLang === lang.languageCode ? styles.selected : ""
            }`}
            onClick={() => handleSelect(lang.languageCode)}
          >
            {t(`language.${lang.languageCode}`)}
          </button>
        ))}
      </div>
    </div>
  );

  return standalone ? Content : <PageContainer>{Content}</PageContainer>;
}
