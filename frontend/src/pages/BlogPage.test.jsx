import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import BlogPage from './BlogPage';
import * as api from '../api';

vi.mock('../api');

describe('BlogPage', () => {
  it('renders loading state initially', () => {
    api.fetchBlogPosts.mockReturnValue(new Promise(() => {})); 
    render(
      <HelmetProvider>
        <MemoryRouter>
          <BlogPage />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders blog posts when loaded', async () => {
    api.fetchBlogPosts.mockResolvedValue([
      { id: 1, title: 'My First Post', content: 'Hello World', created_at: '2023-01-01T00:00:00Z', slug: 'my-first-post' }
    ]);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <BlogPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('My First Post')).toBeInTheDocument();
  });
});
