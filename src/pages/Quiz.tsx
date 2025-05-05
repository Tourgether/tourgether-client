import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/core/axios";
import PageContainer from "../components/common/PageContainer";
import { MdRecordVoiceOver } from "react-icons/md";
import DocentTooltip from "../components/route/DocentTootip";
import "../styles/Quiz.css";

interface Quiz {
  id: number;
  question: string;
  answer: boolean;
}

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { translationId, destinationName } = location.state || {};
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState<string>("");

  // const translationId = 1;
  // const destinationName = "경복궁";
  // const thumbnailImgUrl =
  //   "https://img.freepik.com/free-photo/gyeongbokgung-palace_74190-3267.jpg?t=st=1745738286~exp=1745741886~hmac=ba4f1b87d7aa6082e6760a5cb191bc39895772d65973a39361ee81602a891c49&w=2000";

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [docentOpen, setDocentOpen] = useState(false);

  useEffect(() => {
    if (!translationId) {
      alert("잘못된 접근입니다.");
      navigate("/home");
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const response = await api.get(
          `/api/v1/attractions/${translationId}/quizzes`
        );
        setQuizzes(response.data.data);
      } catch (err) {
        console.error("퀴즈 불러오기 실패", err);
      }
    };

    const fetchAttractionDetail = async () => {
      try {
        const response = await api.get(`/api/v1/attractions/${translationId}`);
        setThumbnailImgUrl(response.data.data.thumbnailImgUrl);
      } catch (err) {
        console.error("관광지 상세정보 불러오기 실패", err);
      }
    };

    fetchQuizzes();
    fetchAttractionDetail();
  }, [translationId, navigate]);

  const handleAnswer = (userAnswer: boolean) => {
    const isCorrect = quizzes[currentIndex].answer === userAnswer;
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  };

  const backgroundStyle = {
    backgroundImage: `url(${thumbnailImgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const DocentButton = () => (
    <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
      <button
        onClick={() => setDocentOpen(!docentOpen)}
        style={{
          background: "white",
          border: "1px solid #ccc",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <MdRecordVoiceOver size={20} color="#9B28FF" />
      </button>

      <DocentTooltip
        visible={docentOpen}
        language="ko"
        translationId={String(translationId)}
        name={destinationName}
      />
    </div>
  );

  const HomeButton = () => (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => navigate("/home", { replace: true })}
        style={{
          width: "80%",
          maxWidth: "360px",
          height: "48px",
          borderRadius: "999px",
          background: "linear-gradient(to right, #5B44E8, #C32BAD)",
          border: "none",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        홈으로
      </button>
    </div>
  );

  if (!quizzes.length) {
    return <PageContainer>퀴즈를 불러오는 중입니다...</PageContainer>;
  }

  if (currentIndex >= quizzes.length) {
    return (
      <div className="quiz-background" style={backgroundStyle}>
        <div className="quiz-overlay">
          <PageContainer className="quiz-container">
            <DocentButton />
            <div className="quiz-title">Quiz</div>
            <div className="quiz-complete-wrapper">
              <div className="quiz-complete">
                <h2 className="highlight">퀴즈를 모두 완료했습니다!</h2>
              </div>
            </div>
            <HomeButton />
          </PageContainer>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];

  return (
    <div className="quiz-background" style={backgroundStyle}>
      <div className="quiz-overlay">
        <PageContainer className="quiz-container">
          <DocentButton />
          <div className="quiz-title">Quiz</div>

          <div className="quiz-card-wrapper">
            <div className="quiz-card">
              <p>
                {currentQuiz.question.split(/(\s+)/).map((word, index) =>
                  currentQuiz.question
                    .toLowerCase()
                    .includes(word.toLowerCase()) &&
                  /[가-힣a-zA-Z]+/.test(word) ? (
                    <span key={index} className="highlight">
                      {word}
                    </span>
                  ) : (
                    <span key={index}>{word}</span>
                  )
                )}
              </p>

              {feedback && (
                <div className={`feedback ${feedback}`}>
                  {feedback === "correct" ? "정답입니다!" : "오답입니다!"}
                </div>
              )}

              <div className="answer-box">
                <button
                  className="circle-button"
                  onClick={() => handleAnswer(true)}
                >
                  ⭕
                </button>
                <button
                  className="cross-button"
                  onClick={() => handleAnswer(false)}
                >
                  ❌
                </button>
              </div>
            </div>
          </div>

          <HomeButton />
        </PageContainer>
      </div>
    </div>
  );
}
