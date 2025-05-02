// src/pages/Quiz.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/core/axios";
import PageContainer from "../components/common/PageContainer";
import "../styles/Quiz.css";

interface Quiz {
  id: number;
  question: string;
  answer: boolean;
}

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // const translationId = location.state?.attraction_translation_id;
  const translationId = 1;
  // const thumbnailImgUrl = location.state?.thumbnailImgUrl;
  const thumbnailImgUrl =
    "https://img.freepik.com/free-photo/gyeongbokgung-palace_74190-3267.jpg?t=st=1745738286~exp=1745741886~hmac=ba4f1b87d7aa6082e6760a5cb191bc39895772d65973a39361ee81602a891c49&w=2000";
  console.log("📷 thumbnailImgUrl: ", thumbnailImgUrl);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

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

    fetchQuizzes();
  }, [translationId, navigate]);

  const handleAnswer = (userAnswer: boolean) => {
    const isCorrect = quizzes[currentIndex].answer === userAnswer;
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  };

  if (!quizzes.length) {
    return <PageContainer>퀴즈를 불러오는 중입니다...</PageContainer>;
  }

  if (currentIndex >= quizzes.length) {
    return (
      <div
        className="quiz-background"
        style={{
          backgroundImage: `url(${thumbnailImgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="quiz-overlay">
          <PageContainer className="quiz-container">
            <div className="quiz-title">Quiz</div>
            <div className="quiz-complete-wrapper">
              <div className="quiz-complete">
                <h2 className="highlight">퀴즈를 모두 완료했습니다!</h2>
                <button className="quiz-back" onClick={() => navigate(-1)}>
                  돌아가기
                </button>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];

  return (
    <div
      className="quiz-background"
      style={{
        backgroundImage: `url(${thumbnailImgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="quiz-overlay">
        <PageContainer className="quiz-container">
          <div className="quiz-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="quiz-title">Quiz</div>
          </div>

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
        </PageContainer>
      </div>
    </div>
  );
}
