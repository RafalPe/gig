import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import RequestDeleteModal from './RequestDeleteModal';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast');

global.fetch = jest.fn();

describe('RequestDeleteModal', () => {
  const mockOnClose = jest.fn();
  const eventId = 'evt-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when open', () => {
    render(
      <RequestDeleteModal
        open={true}
        onClose={mockOnClose}
        id={eventId}
        type="event"
      />
    );

    expect(screen.getByText(/Zgłoś prośbę o usunięcie wydarzenia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Powód usunięcia/i)).toBeInTheDocument();
  });

  it('should not submit if reason is empty', async () => {
    render(
      <RequestDeleteModal
        open={true}
        onClose={mockOnClose}
        id={eventId}
        type="event"
      />
    );

    const submitButton = screen.getByRole('button', { name: /Wyślij Prośbę/i });
    expect(submitButton).toBeDisabled();
  });

  it('should send a request via API when form is filled and submitted', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(
      <RequestDeleteModal
        open={true}
        onClose={mockOnClose}
        id={eventId}
        type="event"
      />
    );

    const input = screen.getByLabelText(/Powód usunięcia/i);
    const submitButton = screen.getByRole('button', { name: /Wyślij Prośbę/i });

    await user.type(input, 'To jest testowy powód usunięcia');
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(fetch).toHaveBeenCalledWith(`/api/events/${eventId}/request-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'To jest testowy powód usunięcia' }),
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});