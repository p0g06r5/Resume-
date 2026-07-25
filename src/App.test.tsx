import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderMessageContent } from './components/PortfolioAssistant';

describe('portfolio', () => {
  it('renders key professional content', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pawan Ghimire'
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Walmart Global Tech/i).length).toBeGreaterThan(0);
  });

  it('opens the guided assistant', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getAllByRole('button', {
        name: /Ask Pawan/i
      })[0]
    );

    expect(
      screen.getByRole('complementary', {
        name: /Ask Pawan portfolio assistant/i
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /About Me/i
      })
    ).toBeInTheDocument();
  });

  it('shows starter suggestion cards in the welcome message and sends them when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('button', { name: /Ask Pawan/i })[0]);

    expect(screen.getByRole('button', { name: /Why should I hire Pawan/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Why should I hire Pawan/i }));

    expect(await screen.findByText(/The live AI service is not connected yet/i)).toBeInTheDocument();
  });

  it('restores starter suggestions after clearing the conversation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('button', { name: /Ask Pawan/i })[0]);
    await user.click(screen.getByRole('button', { name: /Why should I hire Pawan/i }));
    await user.click(await screen.findByRole('button', { name: /Restart conversation/i }));

    expect(screen.getByRole('button', { name: /Why should I hire Pawan/i })).toBeInTheDocument();
  });

  it('renders bold markdown in assistant content', () => {
    const { container } = render(<>{renderMessageContent('1. **Improve device uptime**: this is a test.')}</>);

    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.textContent).toContain('Improve device uptime');
  });
});
