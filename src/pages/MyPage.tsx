import PageContainer from "../components/common/PageContainer";
import ProfileHeader from "../components/mypage/ProfileHeader";
import MenuCard from "../components/mypage/MenuCard";

export default function MyPage() {
  return (
    <PageContainer className="my-page">
      <ProfileHeader />
      <MenuCard />
    </PageContainer>
  );
}
