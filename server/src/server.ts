import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

interface Sentiment {
  label: string;
  score: number;
}

// GraphQL schema definition
const schema = buildSchema(`
  type Sentiment {
    label: String!
    score: Float!
  }

  type Query {
    analyzeSentiment(text: String!): Sentiment!
  }
`);

const root = {
  analyzeSentiment: async ({ text }: { text: string }) => {
    const maxRetries = 3;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Call Hugging Face API for sentiment analysis
        const response = await fetch(
          'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: text }),
          }
        );

        if (response.status === 503) {
          console.log(`Attempt ${attempt + 1}: Model is loading, waiting before retry...`);
          await delay(2000);
        }

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        // Process API response
        const data = await response.json();
        const sentimentAnalyze = data[0];
        const highestConfidence = sentimentAnalyze.reduce((prev: Sentiment, current: Sentiment) =>
          current.score > prev.score ? current : prev
        );

        return {
          label: highestConfidence.label,
          score: highestConfidence.score,
        };
      } catch (error) {
        if (attempt === maxRetries - 1) {
          console.error('Error:', error);
          throw new Error('Failed to analyze sentiment after multiple retries');
        }
        await delay(2000);
      }
    }
  },
};

// Express server setup with GraphQL endpoint
const app = express();
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
