# ListenUP
Audio streaming server

---
### How to setup
Change your music path (var musicPath), mine "C:\\Users\\Arthur\\Music"
Care for song with special characters (space, ', ", é ...)

Prerequisite: node.js installed
```bash
$ git clone https://github.com/ArthurLS/ListenUp.git
$ npm install
$ node index.js
```
Now that the server is running, connect to localhost:PORT.

Click on the SounBank tab and the music starts!
All the client have the same playlist.

---
### ToDo List:
- [x] Synch the client listening (like a radio)
- [x] Allow to upload music
- [ ] Support scaling
- [ ] Fault tolerance and recovery
- [ ] Beautify the whole thing

---
### License
Apache License Version 2.0
