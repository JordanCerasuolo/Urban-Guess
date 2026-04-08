let guesses = 0;
let currentGame = null;

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function toText(value, fallback) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    return String(value);
}

function normalizeGame(game) {
    return {
        id: game.id || game.game_id || game.gameId,
        title: game.title || game.region || game.name || 'Game',
        answer: game.answer || game.city || game.city_name || game.correct_city,
        hintOne: game.hint_one || game.hint1 || game.clue_1,
        hintTwo: game.hint_two || game.hint2 || game.clue_2,
        image: game.image_url || game.image || game.map_image || game.image_path,
        learnMoreUrl: game.learn_more_url || game.wiki_url || game.wikipedia_url
    };
}

async function populateGamesPage() {
    const grid = document.getElementById('gameGrid');

    if (!grid || !window.gameApi) {
        return;
    }

    try {
        const games = await window.gameApi.fetchGames();

        if (!Array.isArray(games) || games.length === 0) {
            grid.innerHTML = '<p>No games available yet.</p>';
            return;
        }

        grid.innerHTML = games.map((rawGame) => {
            const game = normalizeGame(rawGame);
            const id = encodeURIComponent(game.id);

            return `
                <div class="game-card">
                    <img src="${toText(game.image, '../public/images/earth.jpg')}" alt="${toText(game.title, 'Game image')}">
                    <div class="game-info">
                        <h3>${toText(game.title, 'Game')}</h3>
                        <p>Current Score: 0</p>
                        <a href="/games/${id}">PLAY</a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        grid.innerHTML = '<p>Unable to load games right now.</p>';
        console.error(error);
    }
}

async function populateGamePage() {
    const input = document.getElementById('guessInput');
    const button = document.getElementById('submitBtn');
    const container = document.getElementById('buttonContainer');

    if (!input || !button || !container || !window.gameApi) {
        return;
    }

    const pathMatch = window.location.pathname.match(/\/games\/([^/]+)/);
    const gameId = getQueryParam('id') || getQueryParam('gameId') || (pathMatch ? pathMatch[1] : null) || document.body.dataset.gameId;

    if (!gameId) {
        return;
    }

    try {
        const game = await window.gameApi.fetchGameById(gameId);
        currentGame = normalizeGame(game);

        const title = document.getElementById('gameTitle');
        const image = document.getElementById('gameImage');

        if (title) {
            title.textContent = toText(currentGame.title, 'Guess the city');
        }

        if (image && currentGame.image) {
            image.src = currentGame.image;
            image.alt = `${toText(currentGame.title, 'Game')} map`;
        }

        button.addEventListener('click', function () {
            const guess = input.value.trim();
            const answer = toText(currentGame.answer, '').toLowerCase();

            if (!guess || !answer) {
                return;
            }

            if (guess.toLowerCase() !== answer && guesses === 0) {
                alert(toText(currentGame.hintOne, "Not quite right. Try again."));
            }

            if (guess.toLowerCase() !== answer && guesses === 1) {
                alert(toText(currentGame.hintTwo, "Still not right. One more try."));
            }

            if (guess.toLowerCase() !== answer && guesses === 2) {
                alert('Sorry that is incorrect.\nScore: 0');
            }

            if (guess.toLowerCase() === answer) {
                const score = 5 - (guesses * 2);
                alert(`Correct!\nScore: ${score}`);

                if (currentGame.learnMoreUrl) {
                    const learnButton = document.createElement('button');
                    learnButton.textContent = 'Learn More!';
                    learnButton.className = 'button';
                    learnButton.addEventListener('click', function () {
                        window.location.href = currentGame.learnMoreUrl;
                    });
                    container.appendChild(learnButton);
                }

                const gamesButton = document.createElement('button');
                gamesButton.textContent = 'Games Page';
                gamesButton.className = 'button';
                gamesButton.addEventListener('click', function () {
                    window.location.href = '/games';
                });
                container.appendChild(gamesButton);
            }

            guesses++;
            input.value = '';
        }, { once: false });
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    populateGamesPage();
    populateGamePage();
});

