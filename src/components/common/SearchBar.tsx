import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import '../../styles/Search.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onSearch: () => void;
}

export default function SearchBar({ value, onChange, onBack, onSearch }: SearchBarProps) {
  return (
    <div className="search-bar">
      <button onClick={onBack} className="icon-button">
        <FaArrowLeft />
      </button>
      <input
        type="text"
        placeholder="검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
        className="search-input"
      />
      <button onClick={onSearch} className="icon-button">
        <FaSearch />
      </button>
    </div>
  );
}
