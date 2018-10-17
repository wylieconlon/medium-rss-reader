import React from 'react';
import { shallow } from 'enzyme';

window.fetch = makeFetchMock();
import App from './App';
import sampleRSS from './sampleRSS';

function makeFetchMock() {
  return jest.fn().mockResolvedValue({
    text: jest.fn().mockResolvedValue(sampleRSS),
  });
}

it('renders without crashing', () => {
  expect(shallow(<App />).html()).toMatchSnapshot();
});

it('loads an rss document', async () => {
  const app = shallow(<App />);

  app.find('button').simulate('click');

  await window.fetch();

  expect(app.state('isLoading')).toEqual(false);
  expect(app.state('rssFeedDocument')).toBeTruthy();
});
