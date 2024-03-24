import React from 'react';

function DeleteImageModal({ openedModal, handleRemoveImage }) {
  return (
    <div className='delete-modal'>
      <p>This will permanently delete this image.</p>
      <p>Are you sure you want to proceede ?</p>

      <div className='confirm-decline-btn'>
        <button onClick={handleRemoveImage}>Yes</button>
        <button onClick={openedModal}>No</button>
      </div>
    </div>
  )
}

export default DeleteImageModal;