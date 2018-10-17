import React, { Component } from 'react';

class Article extends Component {
  render() {
    const article = this.props.article;
    const isExpanded = this.props.isExpanded;

    if (!article) {
      return;
    }

    return (<article className={`${isExpanded ? 'is-expanded' : ''}`}>
      <h2><a href={article.link}>{article.title}</a></h2>
      <p>By {article.creator}</p>

      {!isExpanded && <p dangerouslySetInnerHTML={article.description} />}

      {!isExpanded && article.hasFullArticle &&
        <button className="expander"
          onClick={this.props.onExpand.bind(this, article)}
        >
          Expand article
        </button>
      }

      {isExpanded && <div dangerouslySetInnerHTML={article.content} />}

      <footer>
        Published <time dateTime={article.publicationDateString}>
          {article.publicationDateFormatted}
        </time>
        &nbsp; &bull; Updated at <time dateTime={article.updatedDateString}>
          {article.updatedDateFormatted}
        </time>
      </footer>
    </article>);
  }
}

export default Article;
