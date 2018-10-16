import React, { Component } from 'react';
import memoize from 'memoize-one';

import Article from './Article';

class BlogContainer extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      expandedArticleKey: null,
    };

    // Prevents unnecessary re-renders as long as the document is the same
    this._processRSSDoc = memoize(this._getBlogInfo);
  }

  render() {
    const blogInfo = this._processRSSDoc(this.props.rss);

    if (blogInfo) {
      return <section>
        <div className="blogTitle">
          <h1>{blogInfo.title}</h1>
          <p dangerouslySetInnerHTML={blogInfo.description} />
        </div>

        {blogInfo.articles.map((article) => {
          const isExpanded = article.shortLink === this.state.expandedArticleKey;

          return (<Article key={article.shortLink}
            article={article}
            isExpanded={isExpanded}
            onExpand={this.expandArticle.bind(this, article)}
          />);
        })}
      </section>;
    } else {
      return <div></div>;
    }
  }

  expandArticle(article) {
    this.setState({ expandedArticleKey: article.shortLink });
  }

  _getBlogInfo() {
    const rssDocument = this.props.rss;
    if (rssDocument) {
      return {
        title: this._getSingleValue(rssDocument, 'channel > title'),
        description: {__html: this._getSingleValue(rssDocument, 'channel > description')},
        link: this._getSingleValue(rssDocument, 'channel > link'),
        imageUrl: this._getSingleValue(rssDocument, 'channel > image > url'),
        imageLink: this._getSingleValue(rssDocument, 'channel > image > link'),
        imageTitle: this._getSingleValue(rssDocument, 'channel > image > title'),
        articles: this._getBlogArticles(rssDocument),
      };
    }
  }

  _getBlogArticles(rssDocument) {
    if (rssDocument) {
      const articles = Array.from(rssDocument.querySelectorAll('item'));
      return articles.map((articleNode) => {
        const publicationDateString = this._getSingleValue(articleNode, 'pubDate');
        const publicationDateFormatted = new Date(publicationDateString).toLocaleDateString();
        const updatedDateString = this._getSingleValue(articleNode, 'updated');
        const updatedDateFormatted = new Date(updatedDateString).toLocaleDateString();
        const fullArticle = this._getSingleValue(articleNode, 'encoded');
        return {
          title: this._getSingleValue(articleNode, 'title'),
          description: {__html: this._getSingleValue(articleNode, 'description')},
          hasFullArticle: !!fullArticle,
          content: {__html: fullArticle},
          link: this._getSingleValue(articleNode, 'link'),
          categories: this._getMultiValue(articleNode, 'category'),
          shortLink: this._getSingleValue(articleNode, 'guid'),
          creator: this._getSingleValue(articleNode, 'creator'),
          publicationDateString,
          updatedDateString,
          publicationDateFormatted,
          updatedDateFormatted,
        };
      });
    }
  }

  _getSingleValue(rssDocument, selector) {
    const element = rssDocument.querySelector(selector);
    return element ? element.textContent : '';
  }

  _getMultiValue(rssDocument, selector) {
    return Array.from(rssDocument.querySelectorAll(selector))
      .map((node) => node.textContent);
  }
}

export default BlogContainer;