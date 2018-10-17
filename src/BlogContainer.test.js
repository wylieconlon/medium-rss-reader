import React from 'react';
import { shallow } from 'enzyme';

import BlogContainer from './BlogContainer';
import sampleRSS from './sampleRSS';

it('renders empty without crashing', () => {
  shallow(<BlogContainer />);
});

it('renders a container from an RSS feed', () => {
  const rssDocument = new DOMParser().parseFromString(sampleRSS, 'application/xml');
  expect(shallow(<BlogContainer rss={rssDocument} />).html()).toMatchSnapshot();
});
