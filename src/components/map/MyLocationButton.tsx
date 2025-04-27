import { FiCrosshair } from 'react-icons/fi';   // 심플한 “현재 위치” 아이콘

interface MyLocationButtonProps {
  onClick: () => void;
}

export default function MyLocationButton({ onClick }: MyLocationButtonProps) {
  return (
    <button
      aria-label="현재 위치로 이동"
      onClick={onClick}
      style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 46,
        height: 46,
        background: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '50%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
    >
      <FiCrosshair size={22} color="#4285F4" />
    </button>
  );
}
