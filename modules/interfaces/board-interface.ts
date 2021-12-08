export interface Boards {
    [type:string] : BestOf3Boards
}

interface BestOf3Boards {
    [id:string]: BestOf3Board
}

export interface Countdown {
    lastTimeUpdate: number;
    timeLeft: number;
    isTimeRunning: boolean;
    totalTime: number;
}

export interface BestOf3Board {
    name: string;
    rounds: number[];
    countdown: Countdown;
    
}

