import { Server, Socket } from "socket.io";
import { createNewGroup, editGroup, getGroup, getGroups } from "./groupsHandler";
import { Group } from "./interfaces/groups-interfaces";
import { createBoard, getBestOf5Boards, getBoard, getTeamPointBoards, removeLastWinner, resetCountdown, resetScoreboard, setSendBoardCb, setWinner, startCountdown, stopCountdown, updateBoardArray, updateTeamPoints, updateTotalCountdown } from "./scoreboardsHandler"

export const openServer = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        
        ///// Scoreboard /////

        // Once bind for Countdown 
        setSendBoardCb((type: string, id:string) => {
            io.emit(`board/${type}/${id}`, getBoard(type, id));
        })
        
        socket.on('getAllBoards', () => {
            socket.emit('allBestOf5Boards', getBestOf5Boards());
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
                case 'BestOf5Board':
                    io.emit('allBestOf5Boards', getBestOf5Boards());
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

        socket.on('createNewGroup', (group: Group) => {
            createNewGroup(group);
            io.emit('allBoards', getGroups())
        })

        socket.on('editGroup', (id: string, group: Group) => {
            editGroup(id, group);
        })
        
        socket.on('getAllGroups', () => {
            socket.emit('allGroups', getGroups());
        })

        socket.on('loadGroup', (id: string) => {
            socket.emit(`getGroup/${id}`, getGroup(id))
        })

    })
}


