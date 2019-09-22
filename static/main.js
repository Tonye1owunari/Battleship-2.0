const view = {
    displayMessage: function(msg){
        const messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        const cell = document.querySelector(`#${location}`);
        cell.classList.add('hit');
    },
    displayMiss: function(location){
        const cell = document.querySelector(`#${location}`);
        cell.classList.add('miss');
    }
};

/* view.displayMessage('Tap, tap is this thing on?');
view.displayMiss('D4');
view.displayHit('G5');
view.displayMiss('B6');
view.displayHit('A0'); */

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: [0, 0, 0], hits: ['','',''] },
        { locations: [0, 0, 0], hits: ['','',''] },
        { locations: [0, 0, 0], hits: ['','',''] }
    ],
    fire: function(guess){
        for(i=0; i < this.numShips; i++){
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);

            if(index >= 0){
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                const audio = document.querySelector('#explode').play();

                if(this.isSunk(ship)){
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                    const audio = document.querySelector('#explode').play();
                    const explosion = document.querySelector('img').style.display = 'block';
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You Missed!');
        return false;
    },
    isSunk: function(ship){
        for(i=0; i < this.shipLength; i++){
            if(ship.hits[i] !== 'hit'){
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function(){
        let locations;
        for(let i=0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            } while(this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function(){
        const direction = Math.floor( Math.random() * 2 );
        let row, col;

        if(direction === 1){
            // generate starting location for horizontal ship
            row = Math.floor( Math.random() * this.boardSize );
            col = Math.floor( Math.random() * (this.boardSize - this.shipLength) );
        } else {
            // generate starting location for vertical ships
            row = Math.floor( Math.random() * (this.boardSize - this.shipLength) );
            col = Math.floor( Math.random() * this.boardSize );
        }

        let newShipLocations = [];
        let letterMatch = ['A','B','C','D','E','F','G'];
        for(let i=0; i < this.shipLength; i++){
            if(direction === 1){
                // add location to array for new horizontal ship
                newShipLocations.push(`${letterMatch[row]}${col + i}`);
            } else {
                // add location to array for new vertical ship
                newShipLocations.push(`${letterMatch[row + i]}${col}`);
            }
        }
        return newShipLocations;
    },
    collision: function(locations){
        for(let i=0; i < this.numShips; i++){
            let ship = model.ships[i];
            for(let j=0; j < locations.length; j++){
                if(ship.locations.indexOf(locations) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

/* model.fire('E0');
model.fire('B6');
model.fire('G3');
model.fire('C4');
model.fire('F2');
model.fire('D3'); */

// implementing the controller pg349------------------------------

const controller = {
    guesses: 0,
    processGuess: function(guess){
        let location = parseGuess(guess);

        if(location){
            this.guesses++;
            let hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage(`You sank all my Battleships in ${this.guesses} guesses`);
            }
        }
    }
};

const parseGuess = (guess) => {
    const alphabets = ['A','B','C','D','E','F','G'];

    if(guess === null || guess.length !== 2){
        alert('Oops! please enter a letter and a number on the board.')
    } else {
        let row = alphabets.indexOf( guess.charAt(0) );
        let column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)){
            alert(`Oops! That isn't on the board.`);
        } else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert(`Oops! That's of the board.`);
        } else {
            const audio = document.querySelector('#shoot').play();
            return alphabets[row] + column;
        }
    }
    return null;
};
// console.log(parseGuess('7A'));

// controller.processGuess('G5');

const handleFireButton = () => {
    const fireButton = document.querySelector('#fireButton');
    fireButton.addEventListener('click', guessInput);

    model.generateShipLocations();
};
window.onload = handleFireButton;

const guessInput = () => {
    const guess = document.querySelector('#guessInput').value;
    controller.processGuess(guess);

    guess = '';
};


