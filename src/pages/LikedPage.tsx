import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import styles from "../styles/mypage/VisitHistory.module.css";
import backButtonStyles from "../styles/common/BackButton.module.css";
import PageContainer from "../components/common/PageContainer";

interface LikedAttraction {
  id: number;
  attractionId: number;
  translationId: number;
  name: string;
  address: string;
  thumbnailImgUrl: string;
}

export default function LikedPage() {
  const [likes, setLikes] = useState<LikedAttraction[]>([]);
  const navigate = useNavigate();

  const handleClick = (translationId: number) => {
    navigate(`/attraction/${translationId}`);
  };

  useEffect(() => {
    axios
      .get("/api/v1/attractions/likes/me")
      .then((res) => {
        setLikes(res.data.data);
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
          <h2 className={styles.title}>Liked Attractions</h2>
          <div className={styles.divider} />
        </div>
        <div className={styles.list}>
          {likes.map((like) => (
            <div
              key={like.id}
              className={styles.card}
              onClick={() => handleClick(like.translationId)}
            >
              <div className={styles.cardContent}>
                <div className={styles.textArea}>
                  <div className={styles.name}>{like.name}</div>
                  <div className={styles.address}>{like.address}</div>
                </div>
                <img
                  src={like.thumbnailImgUrl}
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
