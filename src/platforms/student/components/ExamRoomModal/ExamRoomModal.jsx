import React from "react";
import ComingSoon from "../../../../components/comingSoon/ComingSoon";

function ExamRoomModal({ onClose }) {
  return (
    <div className="exam-modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">×</button>
        <ComingSoon />
      </div>
    </div>
  );
}

export default ExamRoomModal;
