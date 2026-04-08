var express = require('express');
var app = express();
const path = require('path');
const { databaseConnection: database } = require('./db/database');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/services', express.static(path.join(__dirname, '../services')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { getAllGames, getGameById, insertScore, getLeaderboard } = require('../services/gameService');
const { insertUser, getUserByUsername } = require('../services/userService');

// ─── Home ────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.render('home');
});

// ─── Auth ────────────────────────────────────────────────────────────────────

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    getUserByUsername(username, (user) => {
        // TODO: validate password (e.g. bcrypt.compare)
        if (user) {
            res.redirect('/games');
        } else {
            res.render('login', { error: 'Invalid username or password.' });
        }
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // TODO: hash password before storing (e.g. bcrypt.hash)
    insertUser(username, password, (result) => {
        res.redirect('/login');
    });
});

app.get('/logout', (req, res) => {
    // TODO: destroy session when sessions are set up
    res.redirect('/');
});

// ─── Games ───────────────────────────────────────────────────────────────────

// JSON API: list all games for frontend population
app.get('/api/games', (req, res) => {
    getAllGames((games) => {
        res.json(games || []);
    });
});

// JSON API: get one game by id for frontend population
app.get('/api/games/:id', (req, res) => {
    getGameById(req.params.id, (game) => {
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(game);
    });
});

// Browse all available games/rounds
app.get('/games', (req, res) => {
    getAllGames((games) => {
        res.render('games', { games });
    });
});

// Play a specific game round
app.get('/games/:id', (req, res) => {
    getGameById(req.params.id, (game) => {
        res.render('game', { game });
    });
});

// Handle guess submission for a game round
app.post('/games/:id/guess', (req, res) => {
    const { player_name, guessed_city, is_correct } = req.body;
    insertScore(player_name, req.params.id, guessed_city, is_correct, (result) => {
        res.redirect(`/games/${req.params.id}/result`);
    });
});

// Show result after a guess
app.get('/games/:id/result', (req, res) => {
    getGameById(req.params.id, (game) => {
        res.render('result', { game });
    });
});

// ─── Leaderboard ─────────────────────────────────────────────────────────────

// JSON API: leaderboard scores for frontend population
app.get('/api/leaderboard', (req, res) => {
    getLeaderboard((scores) => {
        res.json(scores || []);
    });
});

app.get('/leaderboard', (req, res) => {
    getLeaderboard((scores) => {
        res.render('leaderboard', { scores });
    });
});

// ─── Server ──────────────────────────────────────────────────────────────────

app.listen(3000, () => console.log('Server running on port 3000'));
