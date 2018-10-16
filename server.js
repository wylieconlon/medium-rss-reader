const express = require('express');
const https = require('https');

const port = 8000;

const app = express();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Proxy a Medium RSS feed to avoid CORS
app.post(/\/rss\/(.*)$/, function(req, res) {
  const feed = req.params[0];
  const url = `https://medium.com/feed/${feed}`;

  let feedBuffer;

  res.append('Content-Type', 'application/xml');

  https.get(url, (feedResponse) => {
    feedResponse.on('data', (d) => {
      // Continue building up the response buffer
      feedBuffer = feedBuffer ? Buffer.concat([feedBuffer, d]) : d;
    });
  }).on('error', (e) => {
    console.error(e);
    res.status(500).end();
  }).on('close', () => {
    res.send(feedBuffer.toString());
  });
});

app.use('/dist', express.static('dist'));

app.listen(port, () => console.log(`Listening on port ${port}`));
