import { Server, Socket } from "socket.io";
import { BestOf3Board } from "./interfaces/board-interface";
import { createBoard, getBestOf3Boards, getBoard, getTeamPointBoards, resetCountdown, setSendBoardCb, startCountdown, stopCountdown, updateBoard } from "./scoreboardsHandler"

export const openServer = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        
        // Once bind for Countdown 
        setSendBoardCb((type: string, id:string) => {
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })
        
        socket.on('getAllBoards', () => {
            socket.emit('allBestOf3Boards', getBestOf3Boards());
            socket.emit('allTeamPointBoards', getTeamPointBoards());
        })

        socket.on('getBord', (type:string, id:string) => {
            socket.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('createBoard', (boardValues : any) => {
            createBoard(boardValues);
            switch (boardValues['board']) {
                case 'BestOf3Board':
                    io.emit('allBestOf3Boards', getBestOf3Boards());
                    break;
                case 'TeamPointBoard':
                    io.emit('allBestOf3Boards', getBestOf3Boards());
                    break;
                default:
                    console.log('No Types emited');
            }
        })

        socket.on('startCountdown', (type: string, id: string) => {
            startCountdown(type, id)
        })
        
        socket.on('stopCountdown', (type: string, id: string) => {
            stopCountdown(type, id)
        })

        socket.on('resetCountdown', (type: string, id: string) => {
            resetCountdown(type, id)
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('updateBoard', (type: string, id: string, board: BestOf3Board) => {
            updateBoard(type, id, board);
            console.log(board);
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })
    })
}


