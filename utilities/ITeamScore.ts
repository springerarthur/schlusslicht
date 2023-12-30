export interface ITeamScore {
    team1Score: number;
    team1Distances: IDistances;
    
    team2Score: number;
    team2Distances: IDistances;

    swimPercentage: number;
    bikePercentage: number;
    runPercentage: number;
}

export interface IDistances {
    swimDistance: number;
    runDistance: number;
    bikeDistance: number;
}

