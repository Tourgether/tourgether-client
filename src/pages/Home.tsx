import PageContainer from "../components/common/PageContainer";
import HomeTopDestination from "../components/home/HomeTopDestination";
import SearchButton from "../components/common/SearchButton";
import "../styles/HomeTopDestination.css";

export default function Home() {
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
          <p>Explore the many attractions in Seoul!</p>
        </div>
        <div style={{ position: "absolute", top: 40, right: 30 }}>
          <SearchButton />
        </div>
      </div>

      <HomeTopDestination />
    </PageContainer>
  );
}
