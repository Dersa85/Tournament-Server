
export interface BestOf3Boards {
    [id:string]: BestOf3Board
}

export interface TeamPointBoards {
    [id:string]: TeamPointBoard
}

export interface BestOf3Board {
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





