async function fetchGames() {
    const response = await fetch('/api/games');

    if (!response.ok) {
        throw new Error('Failed to fetch games.');
    }

    return response.json();
}

async function fetchGameById(gameId) {
    const response = await fetch(`/api/games/${encodeURIComponent(gameId)}`);

    if (!response.ok) {
        throw new Error('Failed to fetch game details.');
    }

    return response.json();
}

// Browser global for frontend scripts
if (typeof window !== 'undefined') {
    window.gameApi = {
        fetchGames,
        fetchGameById
    };
}

