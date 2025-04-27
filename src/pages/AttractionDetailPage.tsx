import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "../styles/AttractionDetail.css";

interface AttractionDetail {
  id: number;
  name: string;
  address: string;
  summary: string;
  openingDay: string;
  openingTime: string;
  closedDay: string;
  audioText: string;
  audioUrl: string;
  latitude: number;
  longitude: number;
}

export default function AttractionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: { thumbnailImgUrl: string } };
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AttractionDetail | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await axios.get(`/api/v1/attractions/${id}`);
        setDetail(response.data.data);
      } catch (error) {
        console.error("Failed to fetch attraction detail", error);
      }
    }

    fetchDetail();
  }, [id]);

  if (!detail) {
    return null;
  }

  return (
    <div className="attraction-page">
      <div className="attraction-image-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft className="back-icon" />
        </button>
        <img
          src={state?.thumbnailImgUrl || "/assets/home-seoul-night.png"}
          alt={detail.name}
          className="attraction-image"
        />
        <div className="attraction-name-address">
          <h2 className="attraction-name">{detail.name}</h2>
          <div className="attraction-address">
            <FaMapMarkerAlt className="address-icon" />
            <span>{detail.address}</span>
          </div>
        </div>
      </div>

      <div className="attraction-info">
        <div className="attraction-open-section">
          <h3>Hours of Operation</h3>
          <div className="attraction-open">
            <div>
              <strong>개장 요일</strong>: {detail.openingDay}
            </div>
            <div>
              <strong>개장 시간</strong>: {detail.openingTime}
            </div>
            <div>
              <strong>휴무일</strong>: {detail.closedDay}
            </div>
          </div>
        </div>

        <div className="attraction-description">
          <h3>Description</h3>
          <p>{detail.summary}</p>
        </div>
      </div>
    </div>
  );
}
