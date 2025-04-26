import { AiOutlineEnvironment } from 'react-icons/ai';
import '../../styles/Search.css';

interface SearchResultItemProps {
    title: string;
    address: string;
    thumbnailImgUrl: string;
  }

export default function SearchResultItem({ title, address, thumbnailImgUrl }: SearchResultItemProps) {
  return (
    <div className="search-result-item">
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
