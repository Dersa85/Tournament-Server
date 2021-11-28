let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);


http.listen(3000, () => {
    console.log('Server gestartet');
})