import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DetailsBox from './DetailsBox'; // 假设这是你的组件路径

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { data: { listing: { listing
      : {
      address
      : 
      {SpecificAddress: '1', Suburb: '1', State: '1'},
      availability
      : 
      [],
      metadata
      : 
      {PropertyType: 'appartment', Bathroom: '1', Bed: '1', Amenities: '1'},
      owner
      : 
      "2",
      postedOn
      : 
      "2023-11-16T19:17:31.532Z",
      price
      : 
      0,
      published
      : 
      true,
      reviews
      : 
      [],
      thumbnail
      : 
      "1",
      title
      : 
      "2" }} } }
  })
}));

global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({ bookings: [{  dateRange: {end: "2023-11-18", start: "2023-11-17"}, id: 148842094, listingId
    : 
    "706211635",
    owner
    : 
    "2",
    status
    : 
    "pending",
    totalPrice
    : 
    0  }] })
  })
);

describe('DetailsBox Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders listing details correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <DetailsBox token="test-token" />
      </BrowserRouter>
    );

     expect(getByText('Title')).toBeInTheDocument();
  });

  it('sends a booking request when booking button is clicked', async () => {
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <DetailsBox token="test-token" />
      </BrowserRouter>
    );

    // 填充日期字段
    fireEvent.change(getByLabelText('StartDate'), { target: { value: '2023-01-01' } });
    fireEvent.change(getByLabelText('EndDate'), { target: { value: '2023-01-02' } });

    // 点击预订按钮
    fireEvent.click(getByText('Booking'));

    await waitFor(() => {
      // 检查 fetch 是否被正确调用来发送预订请求
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('bookings/new'), // URL 应包含预订端点的一部分
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        })
      );
    });
  });

  // 根据需要添加更多测试用例
});
