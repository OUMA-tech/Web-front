import { render, fireEvent, waitFor } from '@testing-library/react';
import EditHostedListings from './EditHostedListings';
import { BrowserRouter } from 'react-router-dom';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { listingId: '123' }
  })
}));
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'some data' })
  })
);

describe('EditHostedListings Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  const token = '123'
  it('should render and allow form interactions', async () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <EditHostedListings token="token" />
      </BrowserRouter>
    );

    // Simulate filling out the form
    fireEvent.change(getByLabelText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(getByLabelText('State'), { target: { value: 'Test State' } });
    // ... similarly fill other fields ...

    // Simulate form submission
    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      // Here you can add assertions to check if fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5005/listings/123',
        expect.objectContaining({
          method: 'PUT',
          body: expect.any(String), // Check if the body contains expected data
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });
  });

});
