import { BestOf3Board, BestOf3Boards,Countdown, TeamPointBoard, TeamPointBoards } from "./interfaces/board-interface";

const customId = require("custom-id");

const bestOf3Boards: BestOf3Boards = {};
const teamPointBoards: TeamPointBoards = {}

let sendBoardToAllCB: Function|null = null;
export const setSendBoardCb = (callback: Function) => {
    sendBoardToAllCB = callback
}

setInterval(() => {
    for (let id in bestOf3Boards) {
        const board = bestOf3Boards[id]
        const isCountdownUpdated = runCountdown(board.countdown);
        const isBreakTimeUpdated = runCountdown(board.breakTime);
        if (isCountdownUpdated || isBreakTimeUpdated) {
            emitBoard('BestOf3Board', id)
        }
    }
    for (let id in teamPointBoards) {
        const board = teamPointBoards[id]
        const isCountdownUpdated = runCountdown(board.countdown);
        const isBreakTimeUpdated = runCountdown(board.breakTime);
        if (isCountdownUpdated || isBreakTimeUpdated) {
            emitBoard('TeamPointBoard', id)
        }
    }
}, 100);

// function checkSoundPlaying() {

// }

// function emitSound(type: string, id: string, soundType: string) {
//     if ()
// }

function emitBoard(type: string, id: string):void {
    if (sendBoardToAllCB != null) {
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
    countdown.timeLeft -= pastTime
    if (countdown.timeLeft < 0) {
        countdown.timeLeft = countdown.totalTime;
        countdown.isTimeRunning = false;

    }
    countdown.lastTimeUpdate = now;
    return true;
}

export const getBestOf3Boards = () => bestOf3Boards;
export const getTeamPointBoards = () => teamPointBoards;
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
    console.log('Create new board:', type);
    
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
            },
            breakTime: {
                lastTimeUpdate: Date.now(),
                totalTime: 60000,
                timeLeft: 60000,
                isTimeRunning: false
            }
        } as BestOf3Board
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
            },
            breakTime: {
                lastTimeUpdate: Date.now(),
                totalTime: 60000,
                timeLeft: 60000,
                isTimeRunning: false
            }
        } as TeamPointBoard
        teamPointBoards[newId] = board;
    } else { return board }
}

export const startCountdown = (type: string, id: string, countdownType: string) => {
    const board = getBoard(type, id) as any;
    board[countdownType].isTimeRunning = true;
    board[countdownType].lastTimeUpdate = Date.now();
}

export const stopCountdown = (type: string, id: string, countdownType: string) => {
    const board = getBoard(type, id) as any;
    runCountdown(board.countdown);
    board[countdownType].isTimeRunning = false;
}

export const resetCountdown = (type: string, id: string, countdownType: string) => {
    const board = getBoard(type, id) as any;
    board[countdownType].isTimeRunning = false;
    board[countdownType].timeLeft = board[countdownType].totalTime;
}

export const updateTotalCountdown = (type: string, id: string, countdownType: string, newValue: number): void => {
    const board = getBoard(type, id) as any;
    board[countdownType].totalTime = newValue
    resetCountdown(type, id, countdownType);
}

export const setWinner = (type: string, id: string, value: number): void => {
    let rounds: number[] = [];
    if (type == 'BestOf3Board') {
        const board = getBoard(type, id) as BestOf3Board;
        rounds = board.rounds;
    }
    for (let i = 0; i < rounds.length; i++) {
        if (rounds[i] == 0) {
        rounds[i] = value
        return;
        }
    }
}

export const updateTeamPoints = (type: string, id: string, points: [number, number]): void => {
    const board = getBoard(type, id) as TeamPointBoard;
    board.points[0] = points[0];
    board.points[1] = points[1];
}

export const removeLastWinner = (type: string, id: string): void => {
    let rounds: number[] = [];
    if (type == 'BestOf3Board') {
        const board = getBoard(type, id) as BestOf3Board;
        rounds = board.rounds;
    }
    for (let i = rounds.length -1; i >= 0; i--) {
        if (rounds[i] != 0) {
        rounds[i] = 0;
        return;
        }
    }
}

export const resetScoreboard = (type: string, id: string): void => {
    switch (type) {
        case 'BestOf3Board':
            const bestOf3Board = getBoard(type, id) as BestOf3Board;
            bestOf3Board.rounds = [0, 0, 0, 0, 0, 0];
            resetCountdown(type, id, 'breakTime');
            resetCountdown(type, id, 'countdown');
            break;
        
        case 'TeamPointBoard':
            const teamPointBoard = getBoard(type, id) as TeamPointBoard;
            teamPointBoard.points = [0, 0];
            resetCountdown(type, id, 'breakTime');
            resetCountdown(type, id, 'countdown');
            break;

        default:
            console.log("Board type not found");
            break;
    }
}

// UNUSED
// export const startBreakTime = (type: string, id: string) => {
//     const board = getBoard(type, id) as any;
//     board.breakTime.isTimeRunning = true;
//     board.breakTime.lastTimeUpdate = Date.now();
// }

// // UNUSED
// export const stopBreakTime = (type: string, id: string) => {
//     const board = getBoard(type, id) as any;
//     runCountdown(board.breakTime);
//     board.breakTime.isTimeRunning = false;
// }

// export const resetBreakTime = (type: string, id: string) => {
//     const board = getBoard(type, id) as any;
//     board.breakTime.isTimeRunning = false;
//     board.breakTime.timeLeft = board.breakTime.totalTime;
// }

export const updateBoardArray = (type: string, id: string, newBoard: any) => {
    switch (type) {
        case 'BestOf3Board':
            bestOf3Boards[id] = newBoard;
            break;
        case 'TeamPointBoard':
            teamPointBoards[id] = newBoard;
            break;
        default:
            console.log('Boardtype not found:', type);
    }
    
}





