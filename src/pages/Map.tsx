import PageContainer from '../components/common/PageContainer';
import MapView from '../components/map/MapView';

export default function Map() {
    return (
        <PageContainer className="map-page">
            <div style={{ flex: 1, position: "relative" }}>
                <MapView />
            </div>
        </PageContainer>
    )
}
