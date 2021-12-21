import { Server, Socket } from "socket.io";
import { BestOf3Board } from "./interfaces/board-interface";
import { createBoard, getBestOf3Boards, getBoard, getTeamPointBoards, removeLastWinner, resetCountdown, resetScoreboard, setSendBoardCb, setWinner, startCountdown, stopCountdown, updateBoardArray, updateTeamPoints, updateTotalCountdown } from "./scoreboardsHandler"

export const openServer = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        
        ///// Scoreboard /////

        // Once bind for Countdown 
        setSendBoardCb((type: string, id:string) => {
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })
        
        socket.on('getAllBoards', () => {
            socket.emit('allBestOf3Boards', getBestOf3Boards());
            socket.emit('allTeamPointBoards', getTeamPointBoards());
        })

        socket.on('setWinner', (type: string, id: string, value: number) => {
            setWinner(type, id, value);
            socket.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('updateTeamPoints', (type: string, id: string, newPoints: [number, number]): void => {
            updateTeamPoints(type, id, newPoints)
            socket.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('removeLastWinner', (type: string, id: string): void => {
            removeLastWinner(type, id);
            socket.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('getBord', (type:string, id:string) => {
            socket.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('resetScoreboard', (type: string, id: string): void => {
            resetScoreboard(type, id);
            socket.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('createBoard', (boardValues : any) => {
            createBoard(boardValues);
            switch (boardValues['board']) {
                case 'BestOf3Board':
                    io.emit('allBestOf3Boards', getBestOf3Boards());
                    break;
                case 'TeamPointBoard':
                    io.emit('allTeamPointBoards', getTeamPointBoards());
                    break;
                default:
                    console.log('No Types found');
            }
        })

        socket.on('startCountdown', (type: string, id: string, countdownType: string) => {
            startCountdown(type, id, countdownType)
        })
        
        socket.on('stopCountdown', (type: string, id: string, countdownType: string) => {
            stopCountdown(type, id, countdownType)
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('resetCountdown', (type: string, id: string, countdownType: string) => {
            resetCountdown(type, id, countdownType)
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        socket.on('updateTotalCountdown', (type: string, id: string, countdownType: string, newValue: number) => {
            updateTotalCountdown(type, id, countdownType, newValue)
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })

        // UNUSED
        // socket.on('startBreakTime', (type: string, id: string) => {
        //     startBreakTime(type, id)
        // })

        // // UNUSED
        // socket.on('stopBreakTime', (type: string, id: string) => {
        //     stopBreakTime(type, id)
        // })

        // socket.on('resetBreakTime', (type: string, id: string) => {
        //     resetBreakTime(type, id)
        //     io.emit(`board/${type}/${id}`, getBoard(type, id));
        // })

        // socket.on('updateBoard', (type: string, id: string, board: BestOf3Board) => {
        //     updateBoardArray(type, id, board);
        //     console.log(board);
        //     io.emit(`board/${type}/${id}`, getBoard(type, id));
        // })


        ///// Groups /////

    })
}


