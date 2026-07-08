import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPortfolio, fetchBlogPosts, fetchNewsfeed } from './api';

global.fetch = vi.fn();

describe('api functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchPortfolio handles successful response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });
    
    const result = await fetchPortfolio();
    expect(result).toEqual({ projects: [], experiences: [], skills: [] });
  });

  it('fetchPortfolio handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchPortfolio();
    expect(result).toEqual({ projects: [], experiences: [], skills: [] });
  });

  it('fetchBlogPosts handles successful response', async () => {
    const mockData = [{ id: 1 }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchBlogPosts();
    expect(result).toEqual(mockData);
  });

  it('fetchBlogPosts handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchBlogPosts();
    expect(result).toEqual([]);
  });

  it('fetchNewsfeed handles successful response', async () => {
    const mockData = [{ id: 1 }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchNewsfeed();
    expect(result).toEqual(mockData);
  });

  it('fetchNewsfeed handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchNewsfeed();
    expect(result).toEqual([]);
  });
});
