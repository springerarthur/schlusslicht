// Initialisiere den Punktestand
let score1 = 0;
let score2 = 0;

// Funktion zum Aktualisieren des Punktestands
function updateScore(team) {
    if (team === 'team1') {
        score1++;
        document.getElementById('score1').innerText = score1;
    } else if (team === 'team2') {
        score2++;
        document.getElementById('score2').innerText = score2;
    }
}
