import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";
import api from "../api/core/axios";
import styles from "../styles/mypage/VisitHistory.module.css";
import backButtonStyles from "../styles/common/BackButton.module.css";
import PageContainer from "../components/common/PageContainer";

interface Visit {
  id: number;
  attractionId: number;
  translationId: number;
  name: string;
  address: string;
  thumbnailImgUrl: string;
  visitedAt: string;
}

export default function VisitHistoryPage() {
  const { t } = useTranslation();

  const [visits, setVisits] = useState<Visit[]>([]);

  const navigate = useNavigate();

  const handleClick = (translationId: number) => {
    navigate(`/attraction/${translationId}`);
  };

  useEffect(() => {
    api
      .get("/api/v1/visits")
      .then((res) => {
        setVisits(res.data.data.content);
      })
      .catch(console.error);
  }, []);

  return (
    <PageContainer>
      <div className={styles.page}>
        <div className={backButtonStyles.buttonRow}>
          <button
            className={backButtonStyles.backButton}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className={backButtonStyles.backIcon} />
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.title}>{t("mypage.visitHistory")}</h2>
          <div className={styles.divider} />
        </div>
        <div className={styles.list}>
          {visits.map((visit) => (
            <div
              key={visit.id}
              className={styles.card}
              onClick={() => handleClick(visit.translationId)}
            >
              <div className={styles.cardContent}>
                <div className={styles.textArea}>
                  <div className={styles.name}>{visit.name}</div>
                  <div className={styles.address}>{visit.address}</div>
                  <div className={styles.date}>
                    {visit.visitedAt.replace("T", " ").slice(0, 16)}
                  </div>
                </div>
                <img
                  src={visit.thumbnailImgUrl}
                  alt="thumbnail"
                  className={styles.thumbnail}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
