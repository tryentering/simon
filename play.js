const btnDescriptions = [
    { file: 'sound1.mp3', hue: 120 },
    { file: 'sound2.mp3', hue: 0 },
    { file: 'sound3.mp3', hue: 60 },
    { file: 'sound4.mp3', hue: 240 },
  ];
class Button {
    construtor(description, elem) {
        this.el = elem;
        this.hue = description.hue;
        //this.sound = loadSound(description.file); 
        this.paint(25); //transparency/lightness
    }
    paint(level) {
        const background = `hsl(${this.hue}, 100%, ${level}%)`;
        this.el.style.backgroundColor = background;
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