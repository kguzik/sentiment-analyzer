export const ANALYZE_SENTIMENT = `
  query AnalyzeSentiment($text: String!) {
    analyzeSentiment(text: $text) {
      label
      score
    }
  }
`;
