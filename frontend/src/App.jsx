import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubscribeModal from './components/SubscribeModal';
import LandingPage from './pages/LandingPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import NewsfeedPage from './pages/NewsfeedPage';
import './App.css';

function App() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Navbar onSubscribeClick={() => setIsSubscribeOpen(true)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage onSubscribeClick={() => setIsSubscribeOpen(true)} />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/newsfeed" element={<NewsfeedPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </main>
        <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
