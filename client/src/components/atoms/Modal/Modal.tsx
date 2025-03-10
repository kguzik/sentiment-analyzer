import { useEffect, useState } from 'react';
import './Modal.scss';
import EmojiBlast from '../EmojiBlast/EmojiBlast';
import { SentimentResult } from '../../../types/sentiment';
import { getSentimentInfo } from '../../../helpers/getSentimentInfo';
import { useScrollLock } from '../../../hooks/useScrollLock';
import roundToPercentage from '../../../helpers/roundedToPercantage';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sentiment: SentimentResult | null;
  title: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, sentiment, title }) => {
  const [showEmojiBlast, setShowEmojiBlast] = useState(false);

  // Lock body scroll when modal is open
  useScrollLock(isOpen);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  // Trigger emoji celebration for extremely positive sentiments
  useEffect(() => {
    if (!sentiment || !isOpen) return;

    const roundedScore = roundToPercentage(sentiment.score);
    // Show emoji blast animation for the most positive responses (99.99 is the highest possible API score)
    if (sentiment.label.toLowerCase() === 'positive' && roundedScore === 99.99) {
      setShowEmojiBlast(true);
      const timer = setTimeout(() => setShowEmojiBlast(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, sentiment]);

  if (!isOpen || !sentiment) return null;

  const { icon, description, tip } = getSentimentInfo(sentiment.label, sentiment.score);

  return (
    <div
      className="modal"
      onClick={(e) => {
        // Close modal when clicking outside content area
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal__content">
        <div className="modal__content-wrapper">
          <button className="modal__close" onClick={onClose}>
            <span></span>
            <span></span>
          </button>
          <div className="sentiment">
            <h3>{title}</h3>
            <div className="sentiment__icon">
              {showEmojiBlast && <EmojiBlast />}
              {icon}
            </div>
            <div className="sentiment__details">
              <p
                className={`sentiment__label gradient-text gradient-text--${sentiment.label.toLowerCase().trim() === 'positive' ? 'green' : 'red'}`}
              >
                {sentiment.label}
              </p>
              <p className="sentiment__description text-small">{description}</p>
              {tip && (
                <p className="sentiment__tip text-small">
                  <strong>Tip:</strong> {tip}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
