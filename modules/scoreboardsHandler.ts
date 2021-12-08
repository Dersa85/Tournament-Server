import { BestOf3Board, Boards, Countdown } from "./interfaces/board-interface";

const customId = require("custom-id");

const scoreboards: Boards = {
    BestOf3Board: {}
};

let sendBoardToAllCB: Function|null = null;

export const setSendBoardCb = (cb: Function) => {
    sendBoardToAllCB = cb
}

setInterval(() => {
    for (let type in scoreboards) {
        for (let id in scoreboards[type]) {
            const board = scoreboards[type][id];
            const isUpdated = runCountdown(board.countdown);
            if (sendBoardToAllCB != null && isUpdated == true) {
                sendBoardToAllCB(type, id);
            }
        }
    }
    
}, 100);


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


export const getAllBoards = () => scoreboards;
export const getBoard = (board: string, id: string) => scoreboards[board][id]

export const createBoard = (boardValues: any) => {
    const type: string = boardValues['board'];
    let board;
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
        const newId = customId({})
        scoreboards[type][newId] = board;
        return board;
    } else { return }
}

export const startCountdown = (board: string, id: string) => {
    scoreboards[board][id].countdown.isTimeRunning = true;
    scoreboards[board][id].countdown.lastTimeUpdate = Date.now();
}

export const stopCountdown = (board: string, id: string) => {
    runCountdown(scoreboards[board][id].countdown)
    scoreboards[board][id].countdown.isTimeRunning = false;
}

export const resetCountdown = (board: string, id: string) => {
    scoreboards[board][id].countdown.isTimeRunning = false;
    const totalTime = scoreboards[board][id].countdown.totalTime;
    scoreboards[board][id].countdown.timeLeft = totalTime;
}

export const updateBoard = (type: string, id: string, board: BestOf3Board) => {
    scoreboards[type][id] = board;
}





