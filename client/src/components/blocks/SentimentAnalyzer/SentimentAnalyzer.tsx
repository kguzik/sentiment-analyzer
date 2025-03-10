import { useState } from 'react';
import Modal from '../../atoms/Modal/Modal';
import './SentimentAnalyzer.scss';
import { SentimentResult } from '../../../types/sentiment';
import { ANALYZE_SENTIMENT } from '../../../graphql/queries';

type AnalyzerHeaderProps = {
  title: string;
  description?: {
    highlight: string;
    rest: string;
  };
  placeholder?: string;
  buttonText?: string;
  loadingText?: string;
  maxChars: number;
};

const SentimentAnalyzer: React.FC<AnalyzerHeaderProps> = ({
  title,
  description,
  placeholder = 'Enter text in English for sentiment analysis',
  buttonText = 'Analyze',
  loadingText = 'Analyzing...',
  maxChars,
}) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalyze = async () => {
    // Input validation
    if (!text.trim()) {
      setError('Field cannot be empty');
      return;
    }

    if (text.length > maxChars) {
      setError(`Text cannot be longer than ${maxChars} characters`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send GraphQL query to analyze sentiment
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ANALYZE_SENTIMENT,
          variables: { text },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      // Update state with analysis results and show modal
      setResult(data.analyzeSentiment);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentiment-analyzer">
      <div className="container">
        <h2 className="sentiment-analyzer__title">{title}</h2>
        {description && (
          <p className="sentiment-analyzer__description">
            <span>{description.highlight} </span>
            {description.rest}
          </p>
        )}
        <div className="sentiment-analyzer__wrapper">
          <textarea
            className="sentiment-analyzer__textarea"
            value={text}
            onChange={(e) => {
              // Ensure text doesn't exceed maxChars even if HTML attribute is modified directly in browser
              const newText = e.target.value.slice(0, maxChars);
              setText(newText);
              setError(null);
            }}
            onKeyDown={(e) => {
              // Allow form submission with Enter only if text is valid
              if (e.key === 'Enter' && !loading && text.trim() && text.length <= maxChars) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            onPaste={(e) => {
              // Prevent pasting text longer than maxChars
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text');
              const newText = (text + pastedText).slice(0, maxChars);
              setText(newText);
            }}
            placeholder={placeholder}
            rows={4}
            disabled={loading}
            maxLength={maxChars}
          />
          <div className="sentiment-analyzer__counter">
            {text.length}/{maxChars} characters
          </div>

          <button onClick={handleAnalyze} disabled={loading} className="sentiment-analyzer__submit">
            {loading ? loadingText : buttonText}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sentiment={result}
          title={'Sentiment Analysis Result'}
        />
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
