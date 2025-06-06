import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import api from "../api/core/axios";
import "../styles/AttractionDetail.css";

interface AttractionDetail {
  translationId: number;
  attractionId: number;
  thumbnailImgUrl: string;
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
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as {
    state: {
      thumbnailImgUrl: string;
      from?: string;
      attraction?: {
        id: number;
        name: string;
        address: string;
        thumbnailImgUrl: string;
        latitude: number;
        longitude: number;
      };
    };
  };
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AttractionDetail | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const toggleLike = async () => {
    try {
      if (!detail?.attractionId) return;

      const response = await api.post(
        `/api/v1/attractions/${detail.attractionId}/like/toggle`
      );
      setIsLiked(response.data.data);
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await api.get(`/api/v1/attractions/${id}`);
        setDetail(response.data.data);
      } catch (error) {
        console.error("Failed to fetch attraction detail", error);
      }
    }

    fetchDetail();
  }, [id]);

  useEffect(() => {
    async function fetchIsLiked() {
      try {
        if (!detail?.attractionId) return;

        const response = await api.get(
          `/api/v1/attractions/${detail.attractionId}/like`
        );
        setIsLiked(response.data.data);
      } catch (error) {
        console.error("Failed to fetch like status", error);
      }
    }

    fetchIsLiked();
  }, [detail?.attractionId]);

  if (!detail) return null;

  return (
    <div className="attraction-page">
      <div className="attraction-image-container">
        <button
          className="back-button"
          onClick={() => {
            if (state?.from === "/map") {
              navigate("/map", {
                state: { selectedAttraction: state.attraction },
              });
            } else {
              navigate("/home");
            }
          }}
        >
          <FaArrowLeft className="back-icon" />
        </button>

        <button className="like-button" onClick={toggleLike}>
          {isLiked ? (
            <FaHeart className="heart-icon filled" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
        </button>

        <img
          src={
            state?.thumbnailImgUrl ||
            detail.thumbnailImgUrl ||
            "/assets/home-seoul-night.png"
          }
          alt={detail.name}
          className="attraction-image"
        />

        <div className="image-bottom-overlay">
          <div className="overlay-left">
            <h2 className="overlay-title">{detail.name}</h2>
            <div className="overlay-address">
              <FaMapMarkerAlt className="address-icon" />
              <span>{detail.address}</span>
            </div>
          </div>

          <button
            className="go-button"
            onClick={() =>
              navigate("/route", {
                state: {
                  destination: {
                    name: detail.name,
                    lat: detail.latitude,
                    lng: detail.longitude,
                    id: id,
                    attractionId: detail.attractionId,
                  },
                },
              })
            }
          >
            GO!
          </button>
        </div>
      </div>

      <div className="attraction-info">
        <div className="attraction-open-section">
          <h3>{t("detail.hoursOfOperation")}</h3>
          <div className="attraction-open">
            <div>
              <strong>{t("detail.openingDayLabel")}</strong>:{" "}
              {detail.openingDay}
            </div>
            <div>
              <strong>{t("detail.openingTimeLabel")}</strong>:{" "}
              {detail.openingTime}
            </div>
            <div>
              <strong>{t("detail.closedDayLabel")}</strong>: {detail.closedDay}
            </div>
          </div>
        </div>

        <div className="attraction-description">
          <h3>{t("detail.descriptionTitle")}</h3>
          <p>{detail.summary}</p>
        </div>
      </div>
    </div>
  );
}
