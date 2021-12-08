import { BestOf3Board, BestOf3Boards,Countdown, TeamPointBoard, TeamPointBoards } from "./interfaces/board-interface";

const customId = require("custom-id");

const bestOf3Boards: BestOf3Boards = {};
const teamPointBoards: TeamPointBoards = {}
// const scoreboards: Boards = {
//     BestOf3Board: {},
//     TeamPoint: {}
// };

let sendBoardToAllCB: Function|null = null;
export const setSendBoardCb = (cb: Function) => {
    sendBoardToAllCB = cb
}

setInterval(() => {
    for (let id in bestOf3Boards) {
        const board = bestOf3Boards[id]
        updateCountdown('BestOf3Board', id, board.countdown)
    }
    for (let id in teamPointBoards) {
        const board = teamPointBoards[id]
        updateCountdown('TeamPointBoard', id, board.countdown)
    }
}, 100);


function updateCountdown(type: string, id: string, countdown: Countdown):void {
    const isUpdated = runCountdown(countdown);
    if (sendBoardToAllCB != null && isUpdated == true) {
        sendBoardToAllCB(type, id);
    }
}

function runCountdown(countdown: Countdown): boolean {
    if (!countdown.isTimeRunning) {
        return false;
    }
    const now = Date.now()
    const lastUpdate = countdown.lastTimeUpdate;
    const pastTime = now - lastUpdate
    const timeLeft = countdown.timeLeft - pastTime
    if (timeLeft > 0) {
        countdown.timeLeft = timeLeft;
    } else {
        countdown.timeLeft = 0;
        countdown.isTimeRunning = false;
    }
    countdown.lastTimeUpdate = now;
    return true;
}

export const getBestOf3Boards = () => bestOf3Boards;
export const getTeamPointBoards = () => teamPointBoards;
// export const getAllBoards = () => scoreboards;
export const getBoard = (type: string, id: string) => {
    switch (type) {
        case 'BestOf3Board':
            return bestOf3Boards[id];
        case 'TeamPointBoard':
            return teamPointBoards[id];
        default:
            console.log('Boardtype not found:', type);
    }
}

export const createBoard = (boardValues: any) => {
    const type: string = boardValues['board'];
    let board;
    const newId = customId({})
    if (type == 'BestOf3Board') {
        board = {
            name: boardValues['name'],
            rounds: [0,0,0,0,0,0],
            countdown: {
                lastTimeUpdate: Date.now(),
                totalTime: 120000,
                timeLeft: 120000,
                isTimeRunning: false
            }
        }
        bestOf3Boards[newId] = board;
    } else if (type == 'TeamPointBoard') {
        board = {
            name: boardValues['name'],
            points: [0,0],
            countdown: {
                lastTimeUpdate: Date.now(),
                totalTime: 120000,
                timeLeft: 120000,
                isTimeRunning: false
            }
        }
        teamPointBoards[newId] = board;
    } else { return board }
}

export const startCountdown = (type: string, id: string) => {
    const board = getBoard(type, id) as any;
    board.countdown.isTimeRunning = true;
    board.countdown.lastTimeUpdate = Date.now();
}

export const stopCountdown = (type: string, id: string) => {
    const board = getBoard(type, id) as any;
    runCountdown(board.countdown);
    board.countdown.isTimeRunning = false;
}

export const resetCountdown = (type: string, id: string) => {
    const board = getBoard(type, id) as any;
    board.countdown.isTimeRunning = false;
    board.countdown.timeLeft = board.countdown.totalTime;
}

export const updateBoard = (type: string, id: string, newBoardvalues: any) => {
    switch (type) {
        case 'BestOf3Board':
            bestOf3Boards[id] = newBoardvalues;
            break;
        case 'TeamPointBoard':
            teamPointBoards[id] = newBoardvalues;
            break;
        default:
            console.log('Boardtype not found:', type);
    }
    
}





