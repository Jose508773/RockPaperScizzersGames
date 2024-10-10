document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.choice');
    const resultElement = document.getElementById('result-section');
    const playerChoiceElement = document.getElementById('player-choice');
    const computerChoiceElement = document.getElementById('computer-choice');
    const winsElement = document.getElementById('wins');
    const lossesElement = document.getElementById('losses');
    const drawsElement = document.getElementById('draws');
    const choices = ["rock", "paper", "scissors"];

    let wins = 0, losses = 0, draws = 0;

    const choiceImages = {
        rock: 'url("https://api.iconify.design/mdi:hand-back-right.svg?color=%23ffffff")',
        paper: 'url("https://api.iconify.design/mdi:hand.svg?color=%23ffffff")',
        scissors: 'url("https://api.iconify.design/mdi:hand-peace.svg?color=%23ffffff")'
    };

    function animateChoices(userChoice, computerChoice) {
        playerChoiceElement.style.backgroundImage = choiceImages[userChoice];
        computerChoiceElement.style.backgroundImage = choiceImages[computerChoice];

        playerChoiceElement.style.animation = 'none';
        computerChoiceElement.style.animation = 'none';

        // Trigger reflow
        void playerChoiceElement.offsetWidth;
        void computerChoiceElement.offsetWidth;

        playerChoiceElement.style.animation = 'faceOff 0.5s ease-in-out';
        computerChoiceElement.style.animation = 'faceOff 0.5s ease-in-out';
    }

    function updateScore() {
        winsElement.textContent = wins;
        lossesElement.textContent = losses;
        drawsElement.textContent = draws;
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const userChoice = button.id;
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            let result;

            if (userChoice === computerChoice) {
                result = "It's a draw!";
                draws++;
            } else if (
                (userChoice === "rock" && computerChoice === "scissors") ||
                (userChoice === "paper" && computerChoice === "rock") ||
                (userChoice === "scissors" && computerChoice === "paper")
            ) {
                result = "You win!";
                wins++;
            } else {
                result = "You lose!";
                losses++;
            }

            animateChoices(userChoice, computerChoice);

            setTimeout(() => {
                resultElement.textContent = `You chose ${userChoice}, Computer chose ${computerChoice}. ${result}`;
                updateScore();
            }, 600);
        });
    });
});