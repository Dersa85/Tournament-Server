import { BestOf5Board, BestOf5Boards,Countdown, TeamPointBoard, TeamPointBoards } from "./interfaces/board-interface";
import { join as pathCreator } from "path";
import { loadJson, saveJson } from "./fileHandler";

const customId = require("custom-id");

const bestOf5BoardsPath = pathCreator(__dirname, '..', 'data', 'bestOf5Boards.json');
const teamPointBoardsPath = pathCreator(__dirname, '..', 'data', 'teamPointBoards.json');

const bestOf5Boards: BestOf5Boards = loadJson(bestOf5BoardsPath) as BestOf5Boards;
const teamPointBoards: TeamPointBoards = loadJson(teamPointBoardsPath) as TeamPointBoards;

let sendBoardToAllCB: Function|null = null;
export const setSendBoardCb = (callback: Function) => {
    sendBoardToAllCB = callback
}

setInterval(() => {
    let isBoardsUpdated = false
    for (let id in bestOf5Boards) {
        const board = bestOf5Boards[id]
        const isCountdownUpdated = runCountdown(board.countdown);
        const isBreakTimeUpdated = runCountdown(board.breakTime);
        if (isCountdownUpdated || isBreakTimeUpdated) {
            emitBoard('BestOf5Board', id)
            isBoardsUpdated = true;
        }
    }
    if (isBoardsUpdated) {
        saveJson(bestOf5BoardsPath, bestOf5Boards);
        isBoardsUpdated = false
    }
    for (let id in teamPointBoards) {
        const board = teamPointBoards[id]
        const isCountdownUpdated = runCountdown(board.countdown);
        const isBreakTimeUpdated = runCountdown(board.breakTime);
        if (isCountdownUpdated || isBreakTimeUpdated) {
            emitBoard('TeamPointBoard', id)
        }
    }
    if (isBoardsUpdated) {
        saveJson(teamPointBoardsPath, teamPointBoards);
    }
}, 100);

// function checkSoundPlaying() {

// }

// function emitSound(type: string, id: string, soundType: string) {
//     if ()
// }

function saveBoard(type: string): void {
    if (type == 'BestOf5Board') {
        saveJson(bestOf5BoardsPath, bestOf5Boards);
    } else {
        saveJson(teamPointBoardsPath, teamPointBoards);
    }
}

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

export const getBestOf5Boards = () => bestOf5Boards;
export const getTeamPointBoards = () => teamPointBoards;
export const getBoard = (type: string, id: string) => {
    switch (type) {
        case 'BestOf5Board':
            return bestOf5Boards[id];
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
    if (type == 'BestOf5Board') {
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
        } as BestOf5Board
        bestOf5Boards[newId] = board;
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
    }
    saveBoard(type);
}

export const startCountdown = (type: string, id: string, countdownType: string) => {
    const board = getBoard(type, id) as any;
    board[countdownType].isTimeRunning = true;
    board[countdownType].lastTimeUpdate = Date.now();
    saveBoard(type);
}

export const stopCountdown = (type: string, id: string, countdownType: string) => {
    const board = getBoard(type, id) as any;
    runCountdown(board.countdown);
    board[countdownType].isTimeRunning = false;
    saveBoard(type);
}

export const resetCountdown = (type: string, id: string, countdownType: string) => {
    const board = getBoard(type, id) as any;
    board[countdownType].isTimeRunning = false;
    board[countdownType].timeLeft = board[countdownType].totalTime;
    saveBoard(type);
}

export const updateTotalCountdown = (type: string, id: string, countdownType: string, newValue: number): void => {
    const board = getBoard(type, id) as any;
    board[countdownType].totalTime = newValue
    resetCountdown(type, id, countdownType);
    saveBoard(type);
}

export const setWinner = (type: string, id: string, value: number): void => {
    let rounds: number[] = [];
    if (type == 'BestOf5Board') {
        const board = getBoard(type, id) as BestOf5Board;
        rounds = board.rounds;
    }
    for (let i = 0; i < rounds.length; i++) {
        if (rounds[i] == 0) {
        rounds[i] = value
        return;
        }
    }
    saveBoard(type);
}

export const updateTeamPoints = (type: string, id: string, points: [number, number]): void => {
    const board = getBoard(type, id) as TeamPointBoard;
    board.points[0] = points[0];
    board.points[1] = points[1];
    saveBoard(type);
}

export const removeLastWinner = (type: string, id: string): void => {
    let rounds: number[] = [];
    if (type == 'BestOf5Board') {
        const board = getBoard(type, id) as BestOf5Board;
        rounds = board.rounds;
    }
    for (let i = rounds.length -1; i >= 0; i--) {
        if (rounds[i] != 0) {
        rounds[i] = 0;
        return;
        }
    }
    saveBoard(type);
}

export const resetScoreboard = (type: string, id: string): void => {
    switch (type) {
        case 'BestOf5Board':
            const BestOf5Board = getBoard(type, id) as BestOf5Board;
            BestOf5Board.rounds = [0, 0, 0, 0, 0, 0];
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
    saveBoard(type);
}

export const updateBoardArray = (type: string, id: string, newBoard: any) => {
    switch (type) {
        case 'BestOf5Board':
            bestOf5Boards[id] = newBoard;
            break;
        case 'TeamPointBoard':
            teamPointBoards[id] = newBoard;
            break;
        default:
            console.log('Boardtype not found:', type);
    }
    saveBoard(type);
}





