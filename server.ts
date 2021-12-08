import { join as pathCreator } from "path";
import { openServer } from './modules/socketServerHandler';

const app = require('express')(),
      http = require('http').Server(app),
      io = require('socket.io')(http)


const DEFAULT_PORT = 7878;
const CLIENT_PATH = pathCreator(__dirname, 'client', 'index.html');

openServer(io)

http.listen(DEFAULT_PORT, () => {
    console.log(`Webserver für den Port ${DEFAULT_PORT} gestartet`);
})

app.get('/', (req: any, res: any) => {
    res.sendFile(CLIENT_PATH)
})

