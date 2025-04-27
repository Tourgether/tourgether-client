import PageContainer from "../components/common/PageContainer";
import HomeTopDestination from "../components/home/HomeTopDestination";
import SearchButton from "../components/common/SearchButton";
import "../styles/HomeTopDestination.css";

const bannerDescriptionByLanguage: { [key: number]: string } = {
  1: "서울의 다양한 명소를 탐험해보세요!", // 한국어
  2: "Explore the many attractions in Seoul!", // 영어
  3: "ソウルのさまざまな名所を探索しましょう！", // 일본어
  4: "探索首尔的众多景点！", // 중국어 간체 (zh-CN)
};

export default function Home({ languageId = 1 }) {
  return (
    <PageContainer>
      <div className="home-banner" style={{ position: "relative" }}>
        <img
          src="/assets/home-seoul-night.png"
          alt="Seoul Night"
          className="banner-img"
        />
        <div className="banner-text">
          <h1>Let’s, Tourgether!</h1>
          <p>
            {bannerDescriptionByLanguage[languageId] ||
              "Explore the many attractions in Seoul!"}
          </p>
        </div>
        <div style={{ position: "absolute", top: 40, right: 30 }}>
          <SearchButton />
        </div>
      </div>

      <HomeTopDestination />
    </PageContainer>
  );
}
