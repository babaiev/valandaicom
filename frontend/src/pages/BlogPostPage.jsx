import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchBlogPost } from '../api';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const result = await fetchBlogPost(slug);
      if (result) {
        setPost(result);
      } else {
        setError("Blog post not found.");
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-container fade-in">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading article...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-container fade-in">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>{error || "Post not found"}</h2>
          <Link to="/blog" style={{ color: 'var(--accent-color)' }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <Helmet>
        <title>VAL3R11 | {post.title}</title>
        <meta name="description" content={post.content.substring(0, 150)} />
      </Helmet>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>← Back to Blog</Link>
      </div>

      <article className="card" style={{ padding: '2rem' }}>
        <div className="blog-meta" style={{ marginBottom: '1.5rem' }}>
          <span className="date">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
        </div>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{post.title}</h1>
        
        {post.cover_image && (
          <img 
            src={post.cover_image} 
            alt={post.title} 
            style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem' }} 
          />
        )}
        
        <div style={{ lineHeight: '1.8', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
