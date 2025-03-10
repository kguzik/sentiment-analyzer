import { getSentimentInfo } from './getSentimentInfo';

describe('getSentimentInfo', () => {
  it('should return correct icon and description for positive sentiment', () => {
    const result = getSentimentInfo('positive');

    expect(result.icon).toBe('😊');
    expect(result.description).toBe(
      'The text expresses positive emotions, satisfaction, or approval.'
    );
  });

  it('should return correct icon and description for negative sentiment', () => {
    const result = getSentimentInfo('negative');

    expect(result.icon).toBe('😔');
    expect(result.description).toBe(
      'The text expresses negative emotions, dissatisfaction, or criticism.'
    );
  });
});
