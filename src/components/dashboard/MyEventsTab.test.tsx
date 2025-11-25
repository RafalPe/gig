import '@testing-library/jest-dom';
import { DashboardEvent } from '@/types';
import { renderWithProviders } from '@/utils/test-utils';
import { screen } from '@testing-library/react';
import MyEventsTab from './MyEventsTab';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('react-hot-toast');

const mockEvents: DashboardEvent[] = [
  {
    id: '1',
    name: 'Zweryfikowany Koncert',
    date: new Date().toISOString(),
    isVerified: true,
    createdAt: new Date().toISOString(),
    _count: { groups: 0 },
    deletionRequests: [],
  },
  {
    id: '2',
    name: 'Niezweryfikowany Event',
    date: new Date().toISOString(),
    isVerified: false,
    createdAt: new Date().toISOString(),
    _count: { groups: 5 },
    deletionRequests: [],
  },
  {
    id: '3',
    name: 'Event z Prośbą',
    date: new Date().toISOString(),
    isVerified: true,
    createdAt: new Date().toISOString(),
    _count: { groups: 2 },
    deletionRequests: [
      { id: 'req1', status: 'PENDING', reason: 'test', createdAt: '' }
    ],
  },
];

describe('MyEventsTab', () => {
  it('should render list of events correctly', () => {
    renderWithProviders(<MyEventsTab events={mockEvents} />);

    expect(screen.getByText('Zweryfikowany Koncert')).toBeInTheDocument();
    expect(screen.getByText('Niezweryfikowany Event')).toBeInTheDocument();
  });

  it('should display correct verification chips', () => {
    renderWithProviders(<MyEventsTab events={mockEvents} />);

    expect(screen.getAllByText('Zatwierdzone')[0]).toBeInTheDocument();
    expect(screen.getByText('Oczekuje na weryfikację')).toBeInTheDocument();
  });

  it('should show "Verification Pending" chip for event with pending request', () => {
    renderWithProviders(<MyEventsTab events={mockEvents} />);

    expect(screen.getByText('Weryfikacja usuwania')).toBeInTheDocument();
  });

  it('should indicate active groups count', () => {
    renderWithProviders(<MyEventsTab events={mockEvents} />);

    expect(screen.getByText(/5 aktywnych ekip/i)).toBeInTheDocument();
  });
});