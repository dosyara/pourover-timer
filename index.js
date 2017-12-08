const browserify = require('browserify');
const { store, actions } = require('./lib/time-store');
const ReactDOMServer = require('react-dom/server');
const h = require('react-hyperscript');

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 9090;

http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);

    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // maps file extention to MIME typere
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };


    switch (req.url) {
        case '__/':
        case '__/index.html':
            return fs.readFile('index.html', function(err, data) {
                if(err){
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    res.setHeader('Content-type', map['.html']);

                    const fileContent = data.toString();


                    const { Timer } = require('./components/Timer');
                    store.dispatch(actions.makeInit({ type: 'v60', cups: 1 }));
                    const str = ReactDOMServer.renderToString(h(Timer, { store }));

                    res.end(fileContent.replace('[[BODY_PLACEHOLDER]]', str));
                }
            });
        case '/dist/bundle.min.js':
            res.setHeader('Content-type', map['.js']);

            let b = browserify();
            b.add('./dist/_entry.js');

            b.bundle().pipe(res);

            return;
        default:
            return fs.exists(pathname, function (exist) {
                if(!exist) {
                    // if the file is not found, return 404
                    res.statusCode = 404;
                    res.end(`File ${pathname} not found!`);
                    return;
                }

                // if is a directory search for index file matching the extention
                if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

                // read file from file system
                fs.readFile(pathname, function(err, data) {
                    if(err){
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                    } else {
                        // if the file is found, set Content-type and send data
                        res.setHeader('Content-type', map[ext] || 'text/plain' );
                        res.end(data);
                    }
                });
            });
        }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);