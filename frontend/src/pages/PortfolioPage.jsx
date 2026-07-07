import { useState, useEffect } from 'react';
import { fetchPortfolio } from '../api';

const PortfolioPage = () => {
  const [data, setData] = useState({ projects: [], experiences: [], skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPortfolio();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>Portfolio</h1>
        <p>Projects, Experience, and Skills</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading portfolio data...</div>
      ) : (
        <>
          <section className="about-section">
            <h2>Experience</h2>
            <div className="card-grid">
              {data.experiences.length > 0 ? data.experiences.map((exp) => (
                <div key={exp.id} className="card">
                  <h3>{exp.role}</h3>
                  <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{exp.company}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exp.start_date} — {exp.end_date || 'Present'}</p>
                  <p style={{ marginTop: '1rem' }}>{exp.description}</p>
                </div>
              )) : (
                <div className="card"><p>No experience data yet. Add some in the Django admin!</p></div>
              )}
            </div>
          </section>

          <section className="about-section" style={{ marginTop: '4rem' }}>
            <h2>Projects</h2>
            <div className="card-grid">
              {data.projects.length > 0 ? data.projects.map((proj) => (
                <div key={proj.id} className="card">
                  {proj.image_url && <img src={proj.image_url} alt={proj.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />}
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {proj.tech_stack.map(skill => (
                      <span key={skill.id} style={{ background: 'var(--accent-gradient)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'white' }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="card"><p>No projects yet. Add some in the Django admin!</p></div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
