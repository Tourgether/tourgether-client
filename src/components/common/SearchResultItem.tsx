import { AiOutlineEnvironment } from "react-icons/ai";
import "../../styles/Search.css";

interface SearchResultItemProps {
  id: number;
  title: string;
  address: string;
  thumbnailImgUrl: string;
  onClick: (id: number, thumbnailImgUrl: string, from: string) => void;
}

export default function SearchResultItem({
  id,
  title,
  address,
  thumbnailImgUrl,
  onClick,
}: SearchResultItemProps) {
  return (
    <div
      className="search-result-item"
      onClick={() => onClick(id, thumbnailImgUrl, "/search")}
      style={{ cursor: "pointer" }}
    >
      <div className="search-result-left">
        <AiOutlineEnvironment className="search-result-icon" />
        <div className="search-result-text">
          <div className="search-result-title">{title}</div>
          <div className="search-result-address">{address}</div>
        </div>
      </div>
      <img src={thumbnailImgUrl} alt={title} className="search-thumbnail" />
    </div>
  );
}
