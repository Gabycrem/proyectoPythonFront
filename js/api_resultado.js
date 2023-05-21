function fetchAPI(url) {
    const proxyUrl = 'https://futbolsur.archipielago.digital/proxy.php?url=' + encodeURIComponent(url);
    return fetch(proxyUrl).then(response => response.json());
}



function updateMatches() {
    const url = `https://api.football-data.org/v4/competitions/CLI/matches?status=SCHEDULED`;
    fetchAPI(url).then(data => {
        const matchesBody = document.getElementById('matchesBody');
        matchesBody.innerHTML = '';
        data.matches.forEach(match => {
            matchesBody.innerHTML += `
                <tr>
                    <td><img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}'s crest"  height="25" align="center" />${match.homeTeam.name}</td>
                    <td>${new Date(match.utcDate).toLocaleDateString()}</td>
                    <td><img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}'s crest"  height="25" align="center" />${match.awayTeam.name} </td>
                </tr>
            `;
        });
    });
}


function formatGroupName(name) {
    return 'Grupo ' + name.split('_')[1];
}

function updateStandings() {
    const url = 'https://api.football-data.org/v4/competitions/CLI/standings';
    fetchAPI(url).then(data => {
        const standingsTableContainer = document.getElementById('standingsTableContainer');
        standingsTableContainer.innerHTML = '';
        data.standings.forEach(group => {
            // Crear el título del grupo
            const groupTitle = document.createElement('h3');
            groupTitle.textContent = formatGroupName(group.group);
            standingsTableContainer.appendChild(groupTitle);

            // Crear la tabla para el grupo actual
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Equipo</th>
                        <th>PJ</th>
                        <th>PTS</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>GF</th>
                        <th>GC</th>
                        <th>DG</th>
                    </tr>
                </thead>
            `;

            // Crear el cuerpo de la tabla y agregar los datos del grupo
            const tbody = document.createElement('tbody');
            group.table.forEach(team => {
                tbody.innerHTML += `
                    <tr>
                        <td><img src="${team.team.crest}" alt="${team.team.name}'s crest"  height="35" align="center" /> ${team.team.name}</td>
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

            // Agregar el cuerpo de la tabla a la tabla y luego la tabla al contenedor
            table.appendChild(tbody);
            standingsTableContainer.appendChild(table);
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
                    <td><img src="${scorer.team.crest}" alt="${scorer.team.name}'s crest"  height="25" align=center /> ${scorer.player.name} </td>
                    <td>${scorer.playedMatches}</td>
                    <td>${scorer.goals}</td>
                    <td>${scorer.assists ? scorer.assists : '0'}</td>
                    <td>${scorer.penalties ? scorer.penalties : '0'}</td>
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
