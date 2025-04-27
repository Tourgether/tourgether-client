import { useTranslation } from "react-i18next";
import PageContainer from "../components/common/PageContainer";
import HomeTopDestination from "../components/home/HomeTopDestination";
import SearchButton from "../components/common/SearchButton";
import "../styles/HomeTopDestination.css";

// TODO: useContext(LanguageContext)로 변경하기
export default function Home() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="home-banner" style={{ position: "relative" }}>
        <img
          src="/assets/home-seoul-night.png"
          alt="Seoul Night"
          className="banner-img"
        />
        <div className="banner-text">
          <h1>{t("banner.title")}</h1>
          <p>{t("banner.description")}</p>
        </div>
        <div style={{ position: "absolute", top: 40, right: 30 }}>
          <SearchButton />
        </div>
      </div>

      <HomeTopDestination />
    </PageContainer>
  );
}
