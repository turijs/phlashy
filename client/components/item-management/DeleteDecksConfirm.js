import React from 'react';
import Modal from '../Modal';

const DeleteDecksConfirm = ({
  show, onClose, onConfirm, decksCount, cardsCount
}) => (
  <Modal show={show} titleId="delete-confirm" className="delete-confirm" alert>
    <h2 id="delete-confirm">Delete Decks?</h2>

    <p>Are you sure you want to delete <strong>{decksCount} deck{decksCount > 1 ? 's' : ''}</strong>, including <strong>{cardsCount} card{cardsCount > 1 ? 's' : ''}</strong> therein contained?</p>

    <p>This action cannot be undone.</p>

    <div className="btn-row">
      <button onClick={onClose}>Cancel</button>
      <button className="btn-stop" onClick={e => {onClose(), onConfirm()}}>Delete</button>
    </div>
  </Modal>
);

export default DeleteDecksConfirm;
