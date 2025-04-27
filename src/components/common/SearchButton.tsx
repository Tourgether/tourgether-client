import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../../styles/Search.css";

export default function SearchButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search");
  };

  return (
    <button onClick={handleClick} className="search-icon-button">
      <FaSearch className="search-icon-inside" />
    </button>
  );
}
