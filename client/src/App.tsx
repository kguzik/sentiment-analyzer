import Footer from './components/organisms/Footer/Footer';
import Header from './components/organisms/Header/Header';
import SentimentAnalyzer from './components/blocks/SentimentAnalyzer/SentimentAnalyzer';

function App() {
  return (
    <>
      <Header title="🤔 Sentiment Analyzer" />
      <main>
        <SentimentAnalyzer
          title="Analyze the emotional tone of your text"
          description={{
            highlight: 'Discover the hidden emotions in your words!',
            rest: 'Our Sentiment Analyzer uses advanced AI to read between the lines.',
          }}
          maxChars={500}
        />
      </main>
      <Footer copyright="© 2025 Sentiment Analyzer" />
    </>
  );
}

export default App;
