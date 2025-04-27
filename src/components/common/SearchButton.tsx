import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function SearchButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "37px",
        height: "37px",
        borderRadius: "50%",
        background: "#6B7BFF",
        color: "white",
        border: "none",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <FaSearch />
    </button>
  );
}
