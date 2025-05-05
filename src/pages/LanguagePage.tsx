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
  languageId: number;
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
    // 로컬 스토리지에 저장된 언어 코드가 있으면 우선 적용
    const storedCode = localStorage.getItem("languageCode");
    if (storedCode) {
      setSelectedLang(storedCode);
      i18n.changeLanguage(storedCode);
    }

    // 사용 가능한 언어 목록 조회
    const fetchLanguages = async () => {
      try {
        const res = await api.get<Language[]>("/api/v1/languages");

        const filteredLanguages = res.data.filter((lang) => lang.id !== 0);

        setLanguages(filteredLanguages);
      } catch (err) {
        console.error("언어 목록 불러오기 실패", err);
      }
    };

    // 내 정보 조회해서 서버 기준으로 동기화
    const fetchMemberInfo = async () => {
      try {
        const res = await api.get<{ data: MemberInfo }>("/api/v1/members/me");
        const { languageId, languageCode } = res.data.data;
        setSelectedLang(languageCode);
        i18n.changeLanguage(languageCode);

        // 서버 기준으로 항상 덮어쓰기
        localStorage.setItem("languageId", languageId.toString());
        localStorage.setItem("languageCode", languageCode);
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

      const res = await api.get<{ data: MemberInfo }>("/api/v1/members/me");
      const { languageId, languageCode } = res.data.data;

      localStorage.setItem("languageId", languageId.toString());
      localStorage.setItem("languageCode", languageCode);
      localStorage.setItem("userInfo", JSON.stringify(res.data.data));

      setSelectedLang(languageCode);
      await i18n.changeLanguage(languageCode);

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

      <h2 className={styles.title}>{t("mypage.language")}</h2>
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
