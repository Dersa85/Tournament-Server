
export interface BestOf5Boards {
    [id:string]: BestOf5Board
}

export interface TeamPointBoards {
    [id:string]: TeamPointBoard
}

export interface BestOf5Board {
    name: string;
    rounds: [number, number, number, number, number, number];
    countdown: Countdown;
    breakTime: Countdown;
}

export interface TeamPointBoard {
    name: string;
    points: [number, number];
    countdown: Countdown;
    breakTime: Countdown;
}

export interface Countdown {
    lastTimeUpdate: number;
    timeLeft: number;
    isTimeRunning: boolean;
    totalTime: number;
}





