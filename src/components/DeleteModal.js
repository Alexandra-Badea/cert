import React from 'react';
import '../styles/PostsList.css';

function DeleteModal({ openedModal, handleDelete }) {

  return (
    <div className='delete-modal'>
      <p>This will permanently delete this post and it's attachements.</p>
      <p>Are you sure you want to proceede ?</p>

      <div className='confirm-decline-btn'>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={openedModal}>No</button>
      </div>
    </div>
  )
}

export default DeleteModal;