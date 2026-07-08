import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchBlogPost, incrementPostView, likePost, unlikePost, dislikePost, undislikePost, fetchComments, postComment } from '../api';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [viewed, setViewed] = useState(false);
  const [reaction, setReaction] = useState(null); // 'like', 'dislike', or null

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentStep, setCommentStep] = useState('IDLE'); // IDLE, CAPTCHA, LOADING, SUCCESS, ERROR
  const [commentError, setCommentError] = useState('');
  
  // Captcha state
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const result = await fetchBlogPost(slug);
      if (result) {
        setPost(result);
        setLocalLikes(result.likes || 0);
        setLocalDislikes(result.dislikes || 0);
        
        // Load existing reaction from local storage
        const savedReaction = localStorage.getItem(`reaction_${slug}`);
        if (savedReaction) {
          setReaction(savedReaction);
        }

        if (typeof window !== 'undefined' && window.localStorage) {
          const savedViewed = window.localStorage.getItem(`viewed_${slug}`);
          if (!savedViewed) {
            incrementPostView(slug);
            window.localStorage.setItem(`viewed_${slug}`, 'true');
            setViewed(true);
          } else {
            setViewed(false);
          }
        } else {
          incrementPostView(slug);
          setViewed(true);
        }

        const commentsData = await fetchComments(slug);
        setComments(commentsData);

      } else {
        setError("Blog post not found.");
      }
      setLoading(false);
    };
    loadPost();
  }, [slug, viewed]);

  const handleCommentSubmitClick = () => {
    if (!commentName.trim() || !commentText.trim()) {
      setCommentError('Name and comment are required.');
      return;
    }
    setCommentError('');
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCommentStep('CAPTCHA');
  };

  const handleCaptchaSubmit = async () => {
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setCommentError('Incorrect answer. Please try again.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
      return;
    }

    setCommentStep('LOADING');
    setCommentError('');
    try {
      const newComment = await postComment(slug, commentName, commentText);
      setComments([...comments, newComment]);
      setCommentStep('SUCCESS');
      setCommentName('');
      setCommentText('');
      setCaptchaAnswer('');
      setTimeout(() => setCommentStep('IDLE'), 3000);
    } catch (err) {
      setCommentStep('ERROR');
      setCommentError(err.message || 'Something went wrong.');
    }
  };

  const handleLike = async () => {
    if (reaction === 'like') {
      // Remove like
      setReaction(null);
      setLocalLikes(prev => prev - 1);
      localStorage.removeItem(`reaction_${slug}`);
      await unlikePost(slug);
    } else {
      // Add like
      setReaction('like');
      setLocalLikes(prev => prev + 1);
      localStorage.setItem(`reaction_${slug}`, 'like');
      if (reaction === 'dislike') {
        setLocalDislikes(prev => prev - 1);
        await undislikePost(slug);
      }
      await likePost(slug);
    }
  };

  const handleDislike = async () => {
    if (reaction === 'dislike') {
      // Remove dislike
      setReaction(null);
      setLocalDislikes(prev => prev - 1);
      localStorage.removeItem(`reaction_${slug}`);
      await undislikePost(slug);
    } else {
      // Add dislike
      setReaction('dislike');
      setLocalDislikes(prev => prev + 1);
      localStorage.setItem(`reaction_${slug}`, 'dislike');
      if (reaction === 'like') {
        setLocalLikes(prev => prev - 1);
        await unlikePost(slug);
      }
      await dislikePost(slug);
    }
  };

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
        <div className="blog-meta" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span className="date">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
          <span style={{ color: 'var(--text-secondary)' }}>👁 {(post.view_count || 0) + (viewed ? 1 : 0)} views</span>
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

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleLike} 
            style={{ 
              background: reaction === 'like' ? 'var(--accent-color)' : 'var(--card-bg)', 
              border: '1px solid ' + (reaction === 'like' ? 'var(--accent-color)' : 'var(--border-color)'), 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              color: reaction === 'like' ? '#08110c' : 'var(--text-primary)', 
              fontWeight: reaction === 'like' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👍 Like ({localLikes})
          </button>
          <button 
            onClick={handleDislike} 
            style={{ 
              background: reaction === 'dislike' ? '#ff4d4f' : 'var(--card-bg)', 
              border: '1px solid ' + (reaction === 'dislike' ? '#ff4d4f' : 'var(--border-color)'), 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              color: reaction === 'dislike' ? '#fff' : 'var(--text-primary)',
              fontWeight: reaction === 'dislike' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👎 Dislike ({localDislikes})
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <section className="comments-section" style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Comments ({comments.length})</h2>
        
        <div className="comments-list" style={{ marginBottom: '2rem' }}>
          {comments.map((comment, index) => (
            <div key={index} className="card" style={{ padding: '1rem', marginBottom: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{comment.name}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>

        <div className="card comment-form" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Leave a Comment</h3>
          
          {commentStep === 'IDLE' || commentStep === 'ERROR' ? (
            <>
              {commentError && <div style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{commentError}</div>}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
                <input 
                  type="text" 
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Comment *</label>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical' }}
                  placeholder="What are your thoughts?"
                  required
                />
              </div>
              <button 
                onClick={handleCommentSubmitClick}
                style={{ background: 'var(--accent-color)', border: 'none', padding: '0.75rem 1.5rem', color: '#08110c', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
              >
                Submit Comment
              </button>
            </>
          ) : commentStep === 'CAPTCHA' ? (
            <div>
              <p style={{ marginBottom: '1rem' }}>To prove you are human, please solve this math problem:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{num1} + {num2} = </span>
                <input 
                  type="number" 
                  value={captchaAnswer} 
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleCaptchaSubmit}
                  style={{ background: 'var(--accent-color)', border: 'none', padding: '0.5rem 1rem', color: '#08110c', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Verify
                </button>
                <button 
                  onClick={() => setCommentStep('IDLE')}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : commentStep === 'LOADING' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>Posting your comment...</div>
          ) : commentStep === 'SUCCESS' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--accent-color)', fontWeight: 'bold' }}>
              Comment posted successfully!
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
