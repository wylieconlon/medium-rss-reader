import React from 'react';
import { shallow } from 'enzyme';
import Article from './Article';

it('renders without crashing', () => {
  expect(shallow(<Article />).html()).toMatchSnapshot();
});

it('renders a more full article', () => {
  const dateFormatted = '10/17/18';
  const article = {
    title: 'Fake Article',
    description: {__html: '<p>Some articles have a preview here</p>'},
    hasFullArticle: true,
    content: {__html: '<p>This is the full content</p>'},
    link: 'http://medium.com',
    categories: ['technology', 'politics'],
    shortLink: 'unique key',
    creator: 'Wylie Conlon',
    publicationDateString: dateFormatted,
    updatedDateString: dateFormatted,
    publicationDateFormatted: dateFormatted,
    updatedDateFormatted: dateFormatted,
  };

  const isExpanded = false;

  expect(shallow(<Article
    article={article}
    isExpanded={isExpanded}
    onExpand={jest.fn()}
  />).html()).toMatchSnapshot();
});
