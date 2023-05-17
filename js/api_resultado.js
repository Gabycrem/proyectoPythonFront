const API_KEY = 'e1f8e53a26c34441b304f58620aff0ff';

function fetchAPI(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Auth-Token': API_KEY
        }
    }).then(response => response.json());
}

function updateMatches() {
    const url = `https://api.football-data.org/v4/competitions/CLI/matches?status=SCHEDULED`;
    fetchAPI(url).then(data => {
        const matchesBody = document.getElementById('matchesBody');
        matchesBody.innerHTML = '';
        data.matches.forEach(match => {
            matchesBody.innerHTML += `
                <tr>
                    <td>${match.homeTeam.name}</td>
                    <td>${match.awayTeam.name}</td>
                    <td>${new Date(match.utcDate).toLocaleDateString()}</td>
                    <td>${match.status === 'FINISHED' ? match.score.fullTime.home + ' - ' + match.score.fullTime.away : 'N/A'}</td>
                </tr>
            `;
        });
    });
}


function updateStandings() {
    const url = 'https://api.football-data.org/v4/competitions/CLI/standings';
    fetchAPI(url).then(data => {
        const standingsBody = document.getElementById('standingsBody');
        standingsBody.innerHTML = '';
        data.standings.forEach(group => {
            group.table.forEach(team => {
                standingsBody.innerHTML += `
                    <tr>
                        <td>${group.group}</td>
                        <td>${team.team.name}</td>
                        <td>${team.playedGames}</td>
                        <td>${team.points}</td>
                        <td>${team.won}</td>
                        <td>${team.draw}</td>
                        <td>${team.lost}</td>
                        <td>${team.goalsFor}</td>
                        <td>${team.goalsAgainst}</td>
                        <td>${team.goalDifference}</td>
                    </tr>
                `;
            });
        });
    });
}

function updateScorers() {
    const url = 'https://api.football-data.org/v4/competitions/CLI/scorers';
    fetchAPI(url).then(data => {
        const scorersBody = document.getElementById('scorersBody');
        scorersBody.innerHTML = '';
        data.scorers.forEach(scorer => {
            scorersBody.innerHTML += `
                <tr>
                    <td>${scorer.player.name}</td>
                    <td>${scorer.team.name}</td>
                    <td>${scorer.playedMatches}</td>
                    <td>${scorer.goals}</td>
                    <td>${scorer.assists ? scorer.assists : 'N/A'}</td>
                </tr>
            `;
        });
    });
}

// Actualizar al cargar la página
updateMatches();
updateStandings();
updateScorers();

// Actualizar cada 5 minutos
setInterval(() => {
    updateMatches();
    updateStandings();
    updateScorers();
}, 300000);
