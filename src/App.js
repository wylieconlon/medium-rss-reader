import React, { Component } from 'react';

import BlogContainer from './BlogContainer';

class App extends Component {
  constructor(props) {
    super(props);

    this._parser = new DOMParser();

    this.state = {
      feedName: 'the-atlantic',
      isLoading: false,
      hasError: false,
      rssFeedDocument: null
    };
  }

  render() {
    return <div className="app">
      <header>
        <label>
          medium.com/
          <input
            type="text"
            value={this.state.feedName}
            onChange={this.onFeedNameChange.bind(this)}
          />
        </label>
        <button onClick={this.onFeedSelect.bind(this)}>
          Load Feed
        </button>
      </header>

      {this.state.hasError && <div className="error">
        Could not load feed at {this.state.feedName}
      </div>}

      {this.state.isLoading && <div className="loading">
        <div /><div /><div />
      </div>}

      {!this.state.isLoading && this.state.rssFeedDocument &&
        <BlogContainer rss={this.state.rssFeedDocument} />
      }
    </div>;
  }

  onFeedNameChange(ev) {
    this.setState({
      feedName: ev.target.value,
      hasError: false,
    });
  }

  onFeedSelect(ev) {
    this.setState({ isLoading: true });
    const getFeed = fetch(`/rss/${this.state.feedName}`, {
      method: 'POST',
    })
    .then((response) => {
      response.text().then((value) => {
        const xml = this._parser.parseFromString(value, 'application/xml');

        this.setState({ isLoading: false });

        if (xml.querySelector('parsererror')) {
          this.setState({ hasError: true, rssFeedDocument: null });
        } else {
          this.setState({ rssFeedDocument: xml });
        }
      });
    });
  }
}

export default App;
