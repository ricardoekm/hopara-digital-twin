
const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

module.exports = {
  createServer: (buildPath) => http.createServer(function(req, res) {
    let file = path.resolve(buildPath, req.url.replace('/', ''))
    const index = path.resolve(buildPath, 'index.html')

    if (fs.existsSync(file)) {
      if (fs.lstatSync(file).isDirectory(file)) {
        if (fs.existsSync(file + '/index.html')) {
          file += '/index.html'
          fs.readFile(file, function(err, data) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              })
              res.end('Internal server error')
              return
            }
            res.writeHead(200, {
              'Content-Type': mime.getType(file),
            })
            res.end(data)
          })
        } else {
          res.writeHead(403, {'Content-Type': 'text/plain'})
          res.end('GET 403 ' + http.STATUS_CODES[403] + ' ' + req.url + '\nThat Directory has no Index')
        }
      } else {
        fs.readFile(file, function(err, data) {
          if (err) {
            res.writeHead(500, {
              'Content-Type': 'text/plain',
            })
            res.end('Internal server error')
            return
          }
          res.writeHead(200, {
            'Content-Type': mime.getType(file),
          })
          res.end(data)
        })
      }
    } else {
      fs.readFile(index, function(err, data) {
        if (err) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          })
          res.end('Internal server error')
          return
        }
        res.writeHead(200, {
          'Content-Type': mime.getType(index),
        })
        res.end(data)
      })
    }
  }),
}
