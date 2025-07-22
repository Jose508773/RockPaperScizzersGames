document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const choiceButtons = document.querySelectorAll('.choice');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');
    const resultText = document.getElementById('result-text');
    const resultEmoji = document.getElementById('result-emoji');
    const winsElement = document.getElementById('wins');
    const lossesElement = document.getElementById('losses');
    const drawsElement = document.getElementById('draws');
    const resetButton = document.getElementById('reset-game');
    const arenaContainer = document.querySelector('.arena-container');
    
    // Game state
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let isPlaying = false;
    
    const choices = ['rock', 'paper', 'scissors'];
    
    // Choice icons mapping
    const choiceIcons = {
        rock: '<i class="fas fa-hand-rock"></i>',
        paper: '<i class="fas fa-hand-paper"></i>',
        scissors: '<i class="fas fa-hand-scissors"></i>'
    };
    
    // Result messages and emojis
    const resultData = {
        win: {
            messages: ['Victory!', 'You Win!', 'Excellent!', 'Outstanding!', 'Brilliant!'],
            emoji: ['🎉', '🏆', '🎊', '🥇', '✨'],
            class: 'result-win'
        },
        lose: {
            messages: ['Defeat!', 'You Lose!', 'Try Again!', 'So Close!', 'Next Time!'],
            emoji: ['😢', '💔', '😞', '🤕', '😔'],
            class: 'result-lose'
        },
        draw: {
            messages: ['Draw!', 'Tie Game!', 'Even Match!', 'Stalemate!', 'Dead Heat!'],
            emoji: ['🤝', '⚖️', '🤷‍♂️', '😐', '🔄'],
            class: 'result-draw'
        }
    };
    
    // Sound effects (optional - can be implemented later)
    const playSound = (type) => {
        // Placeholder for sound effects
        // Could implement Web Audio API or HTML5 Audio
    };
    
    // Initialize game
    function initGame() {
        updateScoreDisplay();
        resetChoiceDisplays();
        
        // Add event listeners
        choiceButtons.forEach(button => {
            button.addEventListener('click', () => handlePlayerChoice(button.dataset.choice));
        });
        
        resetButton.addEventListener('click', resetGame);
        
        // Add keyboard support
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Handle keyboard input
    function handleKeyPress(event) {
        if (isPlaying) return;
        
        const keyMap = {
            '1': 'rock',
            'r': 'rock',
            '2': 'paper',
            'p': 'paper',
            '3': 'scissors',
            's': 'scissors'
        };
        
        const choice = keyMap[event.key.toLowerCase()];
        if (choice) {
            handlePlayerChoice(choice);
        }
    }
    
    // Handle player choice
    async function handlePlayerChoice(playerChoice) {
        if (isPlaying) return;
        
        isPlaying = true;
        
        // Add visual feedback to clicked button
        const clickedButton = document.querySelector(`[data-choice="${playerChoice}"]`);
        clickedButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedButton.style.transform = '';
        }, 150);
        
        // Generate computer choice
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        
        // Clear previous results
        clearResults();
        
        // Start battle animation
        await playBattleAnimation(playerChoice, computerChoice);
        
        // Determine winner
        const result = determineWinner(playerChoice, computerChoice);
        
        // Update score
        updateScore(result);
        
        // Show result with animation
        await showResult(result, playerChoice, computerChoice);
        
        // Add winner/loser effects
        applyResultEffects(result);
        
        isPlaying = false;
    }
    
    // Battle animation sequence
    async function playBattleAnimation(playerChoice, computerChoice) {
        // Reset choice displays
        resetChoiceDisplays();
        
        // Add shake animation to arena
        arenaContainer.classList.add('battle-shake');
        
        // Show countdown
        await showCountdown();
        
        // Reveal choices simultaneously
        await Promise.all([
            revealChoice(playerChoiceDisplay, playerChoice),
            revealChoice(computerChoiceDisplay, computerChoice)
        ]);
        
        // Remove shake animation
        setTimeout(() => {
            arenaContainer.classList.remove('battle-shake');
        }, 600);
    }
    
    // Show countdown animation
    function showCountdown() {
        return new Promise(resolve => {
            const countdownNumbers = ['3', '2', '1', 'GO!'];
            let index = 0;
            
            const countdownInterval = setInterval(() => {
                resultText.textContent = countdownNumbers[index];
                resultText.className = 'result-text show';
                
                // Add pulse effect
                resultText.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    resultText.style.transform = 'scale(1)';
                }, 200);
                
                index++;
                
                if (index >= countdownNumbers.length) {
                    clearInterval(countdownInterval);
                    resultText.classList.remove('show');
                    setTimeout(resolve, 300);
                }
            }, 500);
        });
    }
    
    // Reveal choice with animation
    function revealChoice(element, choice) {
        return new Promise(resolve => {
            // Add spinning effect
            element.classList.add('active');
            
            setTimeout(() => {
                element.innerHTML = choiceIcons[choice];
                element.classList.remove('active');
                
                // Add bounce effect
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    resolve();
                }, 300);
            }, 1000);
        });
    }
    
    // Determine game winner
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }
    
    // Update score
    function updateScore(result) {
        switch (result) {
            case 'win':
                wins++;
                break;
            case 'lose':
                losses++;
                break;
            case 'draw':
                draws++;
                break;
        }
        
        updateScoreDisplay();
    }
    
    // Update score display with animation
    function updateScoreDisplay() {
        updateScoreValue(winsElement, wins);
        updateScoreValue(lossesElement, losses);
        updateScoreValue(drawsElement, draws);
    }
    
    // Update individual score value with animation
    function updateScoreValue(element, value) {
        element.textContent = value;
        element.classList.add('score-update');
        setTimeout(() => {
            element.classList.remove('score-update');
        }, 600);
    }
    
    // Show result with animation
    function showResult(result, playerChoice, computerChoice) {
        return new Promise(resolve => {
            const data = resultData[result];
            const message = data.messages[Math.floor(Math.random() * data.messages.length)];
            const emoji = data.emoji[Math.floor(Math.random() * data.emoji.length)];
            
            // Show result text
            setTimeout(() => {
                resultText.textContent = message;
                resultText.className = `result-text show ${data.class}`;
            }, 500);
            
            // Show emoji
            setTimeout(() => {
                resultEmoji.textContent = emoji;
                resultEmoji.classList.add('show');
                resolve();
            }, 800);
        });
    }
    
    // Apply visual effects based on result
    function applyResultEffects(result) {
        // Reset previous effects
        playerChoiceDisplay.classList.remove('winner-glow', 'loser-dim');
        computerChoiceDisplay.classList.remove('winner-glow', 'loser-dim');
        
        setTimeout(() => {
            switch (result) {
                case 'win':
                    playerChoiceDisplay.classList.add('winner-glow');
                    computerChoiceDisplay.classList.add('loser-dim');
                    playSound('win');
                    break;
                case 'lose':
                    computerChoiceDisplay.classList.add('winner-glow');
                    playerChoiceDisplay.classList.add('loser-dim');
                    playSound('lose');
                    break;
                case 'draw':
                    playSound('draw');
                    break;
            }
        }, 1000);
    }
    
    // Clear results
    function clearResults() {
        resultText.classList.remove('show');
        resultEmoji.classList.remove('show');
        resultText.className = 'result-text';
        resultEmoji.textContent = '';
        
        // Clear choice display effects
        playerChoiceDisplay.classList.remove('winner-glow', 'loser-dim', 'active');
        computerChoiceDisplay.classList.remove('winner-glow', 'loser-dim', 'active');
    }
    
    // Reset choice displays
    function resetChoiceDisplays() {
        playerChoiceDisplay.innerHTML = '<div class="choice-placeholder"><i class="fas fa-question"></i></div>';
        computerChoiceDisplay.innerHTML = '<div class="choice-placeholder"><i class="fas fa-robot"></i></div>';
    }
    
    // Reset game
    function resetGame() {
        if (isPlaying) return;
        
        // Animate reset
        resetButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resetButton.style.transform = '';
        }, 150);
        
        // Reset scores with stagger animation
        const scoreElements = [winsElement, lossesElement, drawsElement];
        scoreElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
        
        // Reset game state
        wins = 0;
        losses = 0;
        draws = 0;
        
        // Update display
        setTimeout(() => {
            updateScoreDisplay();
            clearResults();
            resetChoiceDisplays();
        }, 300);
        
        playSound('reset');
    }
    
    // Add particle effects (optional enhancement)
    function createParticles(element, color) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rect = element.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Add hover effects for choice buttons
    choiceButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (!isPlaying) {
                button.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (!isPlaying) {
                button.style.transform = '';
            }
        });
    });
    
    // Initialize the game
    initGame();
    
    // Add some visual flair on load
    setTimeout(() => {
        choiceButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.animation = 'fadeInUp 0.6s ease-out both';
            }, index * 200);
        });
    }, 500);
});