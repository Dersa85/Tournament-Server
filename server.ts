import { existsSync } from 'fs';
import { join as pathCreator } from "path";
import { mkdirSync } from 'fs';
import { openServer } from './modules/socketServerHandler';

const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      io = require('socket.io')(http)


const DEFAULT_PORT = 7878;
const CLIENT_PATH = pathCreator(__dirname, 'client', 'index.html');

createFolder();
openServer(io)

http.listen(DEFAULT_PORT, () => {
    console.log(`Webserver started on Port ${DEFAULT_PORT}`);
})

app.use(express.static('client'))

// app.get('/', (req: any, res: any) => {
//     res.sendFile(CLIENT_PATH)
// })

function createFolder(): void {
    const dataFolder = './data';
    const clientFolder = './client';
    if (!existsSync(dataFolder)) {
        mkdirSync(dataFolder);
    }
    if (!existsSync(clientFolder)) {
        mkdirSync(clientFolder);
    }
}
