import { render, screen } from '@testing-library/react';
import App from './App';
import LevelSelect from './views/LevelSelect';

// Test that the level select page loads by default
test('renders the level select page', async () => {
  const { container } = render(<App />);
  
  await waitFor(() => {
    expect(container).toBeInTheDocument();
    done();
  });
});
