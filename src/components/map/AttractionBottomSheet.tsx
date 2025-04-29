import { useNavigate } from "react-router-dom";
import { AiOutlineEnvironment } from "react-icons/ai";
import "../../styles/AttractionBottomSheet.css";
import { AttractionMapSummary } from "../../api/attractionApi";

interface AttractionBottomSheetProps {
  attraction: AttractionMapSummary | null;
  onClose: () => void;
}

export default function AttractionBottomSheet({
  attraction,
  onClose,
}: AttractionBottomSheetProps) {
  const navigate = useNavigate();

  if (!attraction) return null;

  const handleClickDetail = () => {
    navigate(`/attraction/${attraction.id}`, {
      state: {
        thumbnailImgUrl: attraction.thumbnailImgUrl,
        attraction: attraction,
        from: "/map",
      },
    });
  };

  return (
    <div className="bottom-sheet" onClick={handleClickDetail}>
      <div className="bottom-sheet-content">
        <div className="info-section">
          <AiOutlineEnvironment className="location-icon" />
          <div className="text-info">
            <div className="title">{attraction.name}</div>
            <div className="address">{attraction.address}</div>
          </div>
        </div>
        <img
          src={attraction.thumbnailImgUrl}
          alt={attraction.name}
          className="thumbnail-img"
        />
      </div>
      <button
        className="close-btn"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ✕
      </button>
    </div>
  );
}
