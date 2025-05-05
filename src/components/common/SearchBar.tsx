import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../../styles/Search.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onSearch: () => void;
}

export default function SearchBar({ value, onChange, onBack, onSearch }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="search-bar">
      <button onClick={onBack} className="icon-button">
        <FaArrowLeft />
      </button>
      <input
        type="text"
        placeholder={t("search.placeholder")}
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
