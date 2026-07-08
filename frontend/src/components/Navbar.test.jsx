import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders navbar links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('VAL')).toBeInTheDocument();
    expect(screen.getByText('3R11')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Newsfeed')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={() => {}} />
      </MemoryRouter>
    );
    const menuBtn = screen.getByText('☰');
    fireEvent.click(menuBtn);
    expect(screen.getByText('✕')).toBeInTheDocument();
    
    // Test link click closes menu
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    expect(screen.getByText('☰')).toBeInTheDocument();
  });
});
