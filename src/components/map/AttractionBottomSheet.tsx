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
  if (!attraction) return null;

  return (
    <div className="bottom-sheet">
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
      <button className="close-btn" onClick={onClose}>✕</button>
    </div>
  );
}
