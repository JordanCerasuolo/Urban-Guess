const input = document.getElementById("guessInput");
const button = document.getElementById("submitBtn");
const container = document.getElementById('buttonContainer');
let guesses = 0;
button.addEventListener("click", function() {
    const guess = input.value;
    const answer = "San Antonio"
    if(guess.toLowerCase() != answer.toLowerCase() && guesses == 0) {
        alert("Not quite! Here's a hint: This city is the 7th largest by population in the United States.");
    }
    if(guess.toLowerCase() != answer.toLowerCase() && guesses == 1) {
        alert("That's not quite right. Here's another hint: Remember the Alamo!");
    }
    if(guess.toLowerCase() != answer.toLowerCase() && guesses == 2) {
        alert("Sorry that's incorrect.");
    }
    if(guess.toLowerCase() == answer.toLowerCase()) {

    const learnButton = document.createElement('button');
    learnButton.textContent = 'Learn More!';
    learnButton.className = 'button';

    learnButton.addEventListener('click', function() {
        window.location.href = "https://en.wikipedia.org/wiki/San_Antonio";
    });

    container.appendChild(learnButton);

    const gamesButton = document.createElement('button');
    gamesButton.textContent = 'Games Page';
    gamesButton.className = 'button';

    gamesButton.addEventListener('click', function() {
        window.location.href = "games.html";
    });

    container.appendChild(gamesButton);
}
    guesses++;
});

function goToWiki() {
    window.location.href = "https://en.wikipedia.org/wiki/San_Antonio";
}


