var express = require('express');
var app = express();
const path = require('path');
// const { databaseConnection: database } = require('./db/database');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/services', express.static(path.join(__dirname, '../services')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const { getAllGames, getGameById, insertScore, getLeaderboard } = require('../services/gameService');
const { insertUser, getUserByUsername } = require('./services/userService');
const bcrypt = require('bcrypt');

// Session management
const session = require('express-session');

app.use(session({
    secret: 'urbanguess-secret',
    resave: false,
    saveUninitialized: false
}));


// ─── Home ────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.render('home', { user: req.session.user || null });
});

// ─── Auth ────────────────────────────────────────────────────────────────────

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if(!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('login', { error: 'Invalid username or password.' });
        }
        req.session.user = { id: user.id, username: user.username }; 
        res.redirect('/');
    } catch (error) {
        res.render('login', { error: 'Error occurred while logging in.' });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await insertUser(username, email, password);
        res.redirect('/login');
    } catch (error) {
        res.render('signup', { error: 'Error occurred while creating user.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// ─── Games ───────────────────────────────────────────────────────────────────

// JSON API: list all games for frontend population
// app.get('/api/games', (req, res) => {
//     getAllGames((games) => {
//         res.json(games || []);
//     });
// });
app.get('/games', (req, res) => {
    res.render('games');
});


// JSON API: get one game by id for frontend population
// app.get('/api/games/:id', (req, res) => {
//     getGameById(req.params.id, (game) => {
//         if (!game) {
//             return res.status(404).json({ error: 'Game not found' });
//         }

//         res.json(game);
//     });
// });

// Browse all available games/rounds
// app.get('/games', (req, res) => {
//     getAllGames((games) => {
//         res.render('games', { games });
//     });
// });

// // Play a specific game round
// app.get('/games/:id', (req, res) => {
//     getGameById(req.params.id, (game) => {
//         res.render('game', { game });
//     });
// });

// // Handle guess submission for a game round
// app.post('/games/:id/guess', (req, res) => {
//     const { player_name, guessed_city, is_correct } = req.body;
//     insertScore(player_name, req.params.id, guessed_city, is_correct, (result) => {
//         res.redirect(`/games/${req.params.id}/result`);
//     });
// });

// // Show result after a guess
// app.get('/games/:id/result', (req, res) => {
//     getGameById(req.params.id, (game) => {
//         res.render('result', { game });
//     });
// });

// ─── Game ─────────────────────────────────────────────────────────────
app.get('/game', (req, res) => {
    res.render('game');
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

// ─── Profile ──────────────────────────────────────────────────────────────────
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user });
});

// ─── Server ──────────────────────────────────────────────────────────────────

app.listen(3000, () => console.log('Server running on port 3000'));
