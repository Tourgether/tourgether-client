import PageContainer from "../components/common/PageContainer";
import HomeTopDestination from "../components/home/HomeTopDestination";
import "../styles/HomeTopDestination.css";

export default function Home() {
  return (
    <PageContainer>
      <div className="home-banner">
        <img
          src="/assets/home-seoul-night.png"
          alt="Seoul Night"
          className="banner-img"
        />
        <div className="banner-text">
          <h1>Let’s, Tourgether!</h1>
          <p>Explore the many attractions in Seoul!</p>
        </div>
      </div>

      <HomeTopDestination />
    </PageContainer>
  );
}
