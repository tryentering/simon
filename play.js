const btnDescriptions = [
    { file: 'sound1.mp3', hue: 120 },
    { file: 'sound2.mp3', hue: 0 },
    { file: 'sound3.mp3', hue: 60 },
    { file: 'sound4.mp3', hue: 240 },
];

class Button {
    constructor(description, elem) {
        this.el = elem; //the HTML element
        this.hue = description.hue;
        this.sound = loadSound(description.file);
        this.paint(25); //input is transparency/lightness
    }

    paint(level) {
        const background = `hsl(${this.hue}, 100%, ${level}%)`;
        this.el.style.backgroundColor = background; //the html's background color
    }

    async press(volume) {
        this.paint(50);
        await this.play(volume);
        this.paint(25);
    }

    //needs to be this way to support safari
    async play(volume = 1.0) {
        this.sound.volume = volume;
        await new Promise((resolve) => {
            this.sound.onended = resolve;
            this.sound.play();
        });
    }
}

class Game {
    buttons;
    allowPlayer;
    sequence;
    playerPlaybackPos;
    mistakeSound;

    constructor() {
        this.buttons = new Map();
        this.allowPlayer = false;
        this.sequence = [];
        this.playerPlaybackPos = 0;
        this.mistakeSound = loadSound('error.mp3');

        document.querySelectorAll('.game-button').forEach((el, i) => { //for Each operates on a node.
            if (i < btnDescriptions.length) {
                this.buttons.set(el.id, new Button(btnDescriptions[i], el));
            }
        });

        const playerNameEl = document.querySelector('.player-name');
        playerNameEl.textContent = this.getPlayerName();
    }

    async pressButton(button) {
        if (this.allowPlayer) {
            this.allowPlayer = false;
            await this.buttons.get(button.id).press(1.0);

            if (button.id === this.sequence[this.playerPlaybackPos].el.id) {
                this.playerPlaybackPos++;
                if (this.playerPlaybackPos === this.sequence.length) {
                    this.playerPlaybackPos = 0;
                    this.addButton();
                    this.updateScore(this.sequence.length - 1);
                    await this.playSequence()
                }
                this.allowPlayer = true;
            } else {
                this.saveScore(this.sequence.length - 1);
                this.mistakeSound.play();
                await this.buttonDance(2);
            }
        }
    }

    async reset() {
        this.allowPlayer = false;
        this.playerPlaybackPos = 0;
        this.sequence = [];
        this.updateScore('--');
        await this.buttonDance(1);
        this.addButton();
        await this.playSequence();
        this.allowPlayer = true;
    }

    getPlayerName() {
        return localStorage.getItem('userName') ?? 'Mystery player';
    }

    async playSequence() {
        await delay(500);
        for (const btn of this.sequence) {
            await btn.press(1.0);
            await delay(100);
        }
    }

    addButton() {
        const btn = this.getRandomButton();
        this.sequence.push(btn);
    }

    updateScore(score) {
        const scoreEl = document.querySelector('#score');
        scoreEl.textContent = score;
    }

    async buttonDance(laps = 1) {
        for (let step = 0; step < laps; step++) {
            for (const btn of this.buttons.values()) {
                await btn.press(0.0);
            }
        }
    }

    getRandomButton() {
        let buttons = Array.from(this.buttons.values());
        return buttons[Math.floor(Math.random() * this.buttons.size)];
    }

    saveScore(score) {
        let scores = [];
        const scoresText = localStorage.getItem('scores');
        if (scoresText) {
            scores = JSON.parse(scoresText);
        }
        scores = this.updateScores(this.getPlayerName(), score, scores);

        localStorage.setItem('scores', JSON.stringify(scores));
        
    }

    updateScores(userName, score, scores) {
        const date = new Date().toLocaleDateString();
        const newScore = { name: userName, score: score, date: date }

        let found = false;
        for (const [i, prevScore] of scores.entries()) {
            if (score > prevScore.score) {
                scores.splice(i, 0, newScore); //insert at index i, remove 0 elements, insert the map newScore
                found = true;
                break;
            }
        }
        if (!found) {
            scores.push(newScore);
        }
        if (scores.length > 10) {
            scores.length = 10; //will this truncate the list?
        }
        return scores;
    }
}

const game = new Game();

function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, milliseconds)
    });
}

function loadSound(fileName) {
    return new Audio('assets/' + fileName);
}