import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders landing page content', () => {
    render(
      <HelmetProvider>
        <LandingPage />
      </HelmetProvider>
    );
    expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
    expect(screen.getByText('VAL3R11')).toBeInTheDocument();
    expect(screen.getByText(/Virtual Autonomous Leader/i)).toBeInTheDocument();
  });
});
