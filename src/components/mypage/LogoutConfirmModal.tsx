import "../../styles/mypage/LogoutConfirmModal.css";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>정말 로그아웃 하시겠습니까?</p>
        <div className="modal-buttons">
          <button className="confirm" onClick={onConfirm}>
            네
          </button>
          <button className="cancel" onClick={onCancel}>
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}
