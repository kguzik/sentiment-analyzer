import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentimentAnalyzer from './SentimentAnalyzer';

describe('SentimentAnalyzer Unit Tests', () => {
  const mockFetch = jest.fn();
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
    global.fetch = mockFetch;
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    mockFetch.mockClear();
    (console.error as jest.Mock).mockClear();
  });

  // Unit tests for input validation
  describe('Validation Logic', () => {
    it('should validate empty input', () => {
      render(<SentimentAnalyzer title="Test" maxChars={500} />);

      const button = screen.getByText('Analyze');
      fireEvent.click(button);

      expect(screen.getByText('Field cannot be empty')).toBeInTheDocument();
    });

    it('should validate text length', () => {
      render(<SentimentAnalyzer title="Test" maxChars={5} />);

      const input = screen.getByPlaceholderText('Enter text in English for sentiment analysis');
      fireEvent.change(input, { target: { value: 'Too long text' } });

      expect(input).toHaveValue('Too l');
    });
  });

  // Unit tests for API response handling
  describe('API Response Handling', () => {
    it('should handle API error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ errors: [{ message: 'API Error' }] }),
      });

      render(<SentimentAnalyzer title="Test" maxChars={500} />);

      const input = screen.getByPlaceholderText('Enter text in English for sentiment analysis');
      fireEvent.change(input, { target: { value: 'Test text' } });

      const button = screen.getByText('Analyze');
      fireEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to analyze sentiment. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('should handle successful API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              analyzeSentiment: { label: 'positive', score: 0.8 },
            },
          }),
      });

      render(<SentimentAnalyzer title="Test" maxChars={500} />);

      const input = screen.getByPlaceholderText('Enter text in English for sentiment analysis');
      fireEvent.change(input, { target: { value: 'Test text' } });

      const button = screen.getByText('Analyze');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8080/graphql',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('analyzeSentiment'),
          })
        );
      });
    });
  });
});
