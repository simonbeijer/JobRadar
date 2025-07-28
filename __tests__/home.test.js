import { render, screen } from '@testing-library/react';

import Home from '../src/app/page'; // Adjust the import path as necessary

describe('Home Page', () => {
  it('renders a Login button', () => {
    render(<Home />);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });
});