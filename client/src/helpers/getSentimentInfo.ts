import { SentimentInfo } from '../types/sentiment';
import roundToPercentage from './roundedToPercantage';

/**
 * Generates user-friendly sentiment information based on analysis results
 * @param label - The sentiment label (positive/negative)
 * @param score - The confidence score (0-1)
 * @returns Formatted sentiment information with icon, description and optional tip. The 99.99 is the highest possible API score and it shows a special message.
 */
export const getSentimentInfo = (label: string, score?: number): SentimentInfo => {
  const roundedScore = roundToPercentage(score);

  switch (label.toLowerCase()) {
    case 'positive':
      return {
        icon: '😊',
        description:
          roundedScore === 99.99
            ? 'This text is super positive!'
            : 'The text expresses positive emotions, satisfaction, or approval.',
      };
    case 'negative':
      return {
        icon: '😔',
        description: 'The text expresses negative emotions, dissatisfaction, or criticism.',
        tip: "Consider rephrasing with more positive words if this wasn't your intention.",
      };
  }
  return { icon: '😊', description: 'The text expresses positive emotions.' };
};
