import { useState, useEffect } from 'react';
import { fetchNewsfeed } from '../api';

const NewsfeedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchNewsfeed();
      setItems(result);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>AI Newsfeed</h1>
        <p>Latest updates and curations from the AI world.</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading newsfeed...</div>
      ) : (
        <div className="feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="feed-item card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{item.source}</span>
                <span className="feed-date" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {new Date(item.published_at).toLocaleDateString()}
                </span>
              </div>
              <h3><a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{item.title}</a></h3>
              <p style={{ marginTop: '0.5rem' }}>{item.summary}</p>
            </div>
          )) : (
            <>
              {/* Fallback Mock Data */}
              <div className="feed-item card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>TechCrunch</span>
                  <span className="feed-date" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Jul 7, 2026</span>
                </div>
                <h3>New Large Language Model Released</h3>
                <p style={{ marginTop: '0.5rem' }}>Exploring the capabilities of the latest state-of-the-art models in reasoning and coding tasks.</p>
              </div>
              <div className="feed-item card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Twitter</span>
                  <span className="feed-date" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Jul 5, 2026</span>
                </div>
                <h3>Breakthroughs in AI Agents</h3>
                <p style={{ marginTop: '0.5rem' }}>How autonomous agents are transforming software engineering and repetitive tasks.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsfeedPage;
