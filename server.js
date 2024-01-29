const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = 3000;
const ip = "192.168.1.13";
const meta = '<meta charset="utf-8">';

const dirPathVideos = './videos';
const dirPathH = './H';
const dirPathPIC = './PIC';

const htmlPathVideos = './html/videos.html';
const htmlPathH = './html/H.html';
const htmlPathPIC = './html/PIC.html';
const htmlPathIndex = './html/index.html';

const createLinks = (dir, html) => {
  fs.writeFile(html, meta, {flag: 'w+'}, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Meta tag added successfully!');
  });
  let arr = [];
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      files.forEach(file => {
        let filePath = path.join(dir, file);
        let ext = path.extname(file);
        if (ext === '.mp4' || ext === '.avi' || ext === '.mkv' || ext === '.MOV') {
          arr.push(new Promise((resolve, reject) => {
            fs.realpath(filePath, (err, link) => {
              if (err) {
                reject(err);
                return;
              }
              let path = '';
              if (dir === dirPathVideos) path = 'videos';
              if (dir === dirPathH) path = 'H';
              if (dir === dirPathPIC) path = 'PIC';
              resolve(`<a href="/${path}/${file}">${file}</a><br>`);
            });
          }));
        }
      });
      resolve(arr);
    });
  }).then(arr => {
    return Promise.all(arr).then(links => {
      links.sort();
      return links.join('');
    });
  }).then(links => {
    return new Promise((resolve, reject) => {
      fs.writeFile(html, links, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Links created successfully!');
        resolve();
      });
    });
  });
};

createLinks(dirPathVideos, htmlPathVideos).catch(err => {
  console.error(err);
});
createLinks(dirPathH, htmlPathH).catch(err => {
    console.error(err);
});

fs.watch(dirPathVideos, (eventType, filename) => {
    if (eventType === 'rename') {
      console.log(`File ${filename} has been added or removed.`);
      createLinks(dirPathVideos, htmlPathVideos);
      createLinks(dirPathH, htmlPathH);
    }
  });
  
  fs.watch(dirPathH, (eventType, filename) => {
    if (eventType === 'rename') {
      console.log(`File ${filename} has been added or removed.`);
      createLinks(dirPathH, htmlPathH);
    }
  });

  app.use(express.static('.'));
  
  app.get('/videos', (request, response) => {
    let htmlFile = path.join(__dirname, htmlPathVideos);
    response.sendFile(htmlFile);
  });

  app.get('/H', (request, response) => {
    let htmlFile = path.join(__dirname, htmlPathH);
    response.sendFile(htmlFile);
  });

  app.get('/', (request, response) => {
    let htmlFile = path.join(__dirname, htmlPathIndex);
    response.sendFile(htmlFile);
  })
  
  app.listen(port, ip, () => {
    console.log(`Listening at ${ip}:${port}...`);
  });
