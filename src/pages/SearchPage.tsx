import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLanguageId } from "../utils/getLanguageId";
import {
  fetchAttractionsByKeyword,
  AttractionSummary,
} from "../api/attractionApi";
import SearchBar from "../components/common/SearchBar";
import SearchResultItem from "../components/common/SearchResultItem";
import PageContainer from "../components/common/PageContainer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "../styles/Search.css";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AttractionSummary[]>([]);
  const navigate = useNavigate();

  const handleBack = () => {
    window.history.back();
  };

  const handleSearch = async () => {
    if (keyword.trim() === "") return;

    setLoading(true);
    setResults([]);

    try {
      const langId = getLanguageId();
      const data = await fetchAttractionsByKeyword(langId, keyword);
      setResults(data);
    } catch (error) {
      console.error("API 호출 에러", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (
    id: number,
    thumbnailImgUrl: string,
    from: string
  ) => {
    navigate(`/attraction/${id}`, {
      state: {
        thumbnailImgUrl,
        from,
      },
    });
  };

  return (
    <PageContainer>
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        onBack={handleBack}
        onSearch={handleSearch}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="search-results">
          {results.length > 0
            ? results.map((item) => (
                <SearchResultItem
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  address={item.address}
                  thumbnailImgUrl={item.thumbnailImgUrl}
                  onClick={handleItemClick}
                />
              ))
            : keyword && <div className="empty-result">No results found.</div>}
        </div>
      )}
    </PageContainer>
  );
}
