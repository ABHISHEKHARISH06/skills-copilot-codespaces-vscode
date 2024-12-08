// Create web server
const http = require('http');
const url = require('url');

let comments = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  if (parsedUrl.pathname === '/comments' && method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(comments));
  } else if (parsedUrl.pathname === '/comments' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const newComment = JSON.parse(body).comment;
        if (newComment) {
          comments.push(newComment);
          res.writeHead(201, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({message: 'Comment added successfully!'}));
        } else {
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({error: 'Invalid comment!'}));
        }
      } catch (e) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Invalid JSON!'}));
      }
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

