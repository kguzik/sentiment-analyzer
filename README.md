# Sentiment Analyzer Application

This is a full-stack application built with modern web technologies, featuring a React frontend and Node.js backend with GraphQL.

## Technologies Used

### Frontend (Client)

- React 19
- TypeScript
- Vite
- GraphQL Client (graphql-request)
- SASS for styling
- Jest & React Testing Library for testing

### Backend (Server)

- Node.js with Express
- TypeScript
- GraphQL with express-graphql
- CORS for cross-origin resource sharing

### Development Tools (Root Level)

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
  - Pre-commit hook runs all client tests
  - Commits will be blocked if any test fails
  - This ensures that only code with passing tests can be committed

#### Code Formatting Commands

```bash
# Run ESLint check
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

Note: For automatic formatting on save, you'll need to configure your IDE with ESLint and Prettier extensions. Refer to your IDE's documentation for specific setup instructions.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd [repository-name]
```

2. Install all dependencies (client and server):

```bash
npm run install:all
```

3. Set up environment variables:
   - Navigate to the server directory
   - Copy `.env.example` to create `.env` file:

Note: For recruitment purposes, I left the API key in `.env.example` to make testing easier. However, I know that this is not a secure practice and should never be done in production environments.

This command will install dependencies for:

- Root project
- Client application
- Server application

## Running the Application

### Development Mode

1. Start the server (in one terminal):

```bash
cd server
npm run dev
```

The server will start on `http://localhost:8080/graphql` by default.

2. Start the client (in another terminal):

```bash
cd client
npm run dev
```

The client application will be available at `http://localhost:5173`.

### Testing

To run unit tests for the client application:

```bash
cd client
npm test
```

This will run all unit tests and show the test coverage for:

- Input validation logic
- API response handling
- Sentiment analysis functionality

### Production Mode

1. Build the client:

```bash
cd client
npm run build
```

2. Build the server:

```bash
cd server
npm run build
```

3. Start the server in production mode:

```bash
cd server
npm start
```

4. Preview the built client application:

```bash
cd ../client
npm run preview
```

The client application will be available at `http://localhost:4173`.

Note: Make sure both the server (on port 8080) and the client preview (on port 4173) are running simultaneously to test the production build properly.

## Challenges

### Model Limitations

During testing, I saw that the currently used model returns results for any input text, regardless of language. With other language sentiment analysis looks random as model only works as expected for english texts. I added language detection to prevent misleading results for non-English text, used for it `franc-min` package and tested `languagedetect`. However, both packages were unreliable, especially for short texts. For example, common English phrases like "Hello, how are you?" were incorrectly detected as Italian. Due to these limitations, I decided to remove the language detection feature and instead rely on user discretion for input language. Maybe a good solution would be to use an AI model to determine the language of the input text, which could provide more accurate results especially for short, common phrases.

Example of usage `franc-min` in `SentimentAnalyzer.tsx`

```
// Language detection only for longer texts (franc is more reliable with longer texts)
if (text.length > 20) {
  const detectedLanguage = franc(text);

  if (detectedLanguage !== 'eng' && detectedLanguage !== 'und') {
    setError(
      'Please enter text in English only. The sentiment analysis works only with English text.'
    );
    return;
  }
}
```

### Model Output vs Requirements

The task requirements specified returning three sentiment states (positive, neutral, negative), but the suggested Hugging Face model only provides two classification (positive/negative).

### GraphQL Implementation

As this was my first experience with GraphQL, I'm not entirely confident about the setup and implementation best practices. While the current implementation works, there might be room for improvement.
