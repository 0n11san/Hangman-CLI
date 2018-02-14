//require NPM packages
var inquirer = require('inquirer');
var isLetter = require('is-letter');
//require objects/exports from self-created constructors/objects
var Word = require('./word.js');

//word bank array object
//consider adding CLUES in second version
newWord = {
  wordList: ['KAL DROGO', 'NIGHT KING', 'JON SNOW', 'DRAGONS', 'WINTER IS COMING',
    'LITTLEFINGER', 'NYMERIA', 'WIGHT', 'SAND SNAKES', 'FACELESS MEN', 'THREE EYED RAVEN',
    'HODOR', 'TYRION', 'SANSA', 'OATHKEEPER', 'THE REACH', 'BATTLE OF THE TRIDENT', 'RHAEGAR TARGARYEN',
    'PRINCE THAT WAS PROMISED', 'THE WALL', 'BRAN THE BUILDER', 'WHAT IS DEAD MAY NEVER DIE',
    'OURS IS THE FURY', 'WE DO NOT SOW', 'UNBOWED UNBENT UNBROKEN', 'GROWING STRONG', 'A LANNISTER ALWAYS PAYS HIS DEBTS',
    'FIRE AND BLOOD', 'CHAOS IS A LADDER', 'FEAR CUTS DEEPER THAN SWORDS'
  ]
};

//Things to add in future: Can I add an ASCII art showing a hangman being built after every wrong guess?
//http://www.asciify.net/ascii/show/4902


var hangman = {
  wordBank: newWord.wordList,
  wordsWon: 0,
  guessesRemaining: 10,
  //empty array to hold letters guessed by user. And checks if the user guessed the letter already
  guessedLetters: [],
  currentWord: [],
  //asks user if they are ready to play
  startGame: function() {
    var that = this;
    //clears guessedLetters before a new game starts if it's not already empty.
    if (this.guessedLetters.length > 0) {
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Play 'Game of Thrones' Hangman?"
    }]).then(function(answer) {
      if (answer.play) {
        that.newGame();
      } else {
        console.log("OK... :-'( " + "\n " + "You know nuthin', Jon Snow!");
      }
    })
  },
  //if they want to play starts new game.
  newGame: function() {
    if (this.guessesRemaining === 10) {
      console.log(' SELECTING WORD FROM BANK...');

      //generates random number based on the wordBank
      var randNumber = Math.floor(Math.random() * this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNumber]);
      this.currentWord.getLets();
      //displays current word as blanks.
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else {
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser: function() {
    var that = this;
    //asks player for a letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if (isLetter(value)) {
          return true;
        } else {
          return false;
        }
      }
    }]).then(function(ltr) {


      /*safegaurd to help console interpret lowercase entries from user as uppercase, since all word bank
      entires are capitalized*/
      var letterReturned = (ltr.chosenLtr).toUpperCase();

      //adds to the guessedLetters array if it isn't already there
      var guessedAlready = false;
      this.guessedLetters = [];

      //keep asking until guesses remaining is zero
      for (var i = 0; i < that.guessedLetters.length; i++) {
        if (letterReturned === that.guessedLetters[i]) {
          guessedAlready = true;
        }
      }
      if (guessedAlready === false) {
        that.guessedLetters.push(letterReturned);
        console.log('You Chose: ' + letterReturned);
        console.log('Guesses Remaining: ' + that.guessesRemaining)
        console.log('Letters Used Thus Far: ' + that.guessedLetters)



      } else {
        //otherwise re-prompt user to pick another letter.
        console.log("You've guessed that already. Try something else.")

        that.keepPromptingUser();
      }

      var found = that.currentWord.checkIfLetterFound(letterReturned);
      //if none are found tell user they're wrong
      if (found === 0) {
        console.log('Incorrect letter');
        that.guessesRemaining--;
        console.log('Guesses remaining: ' + that.guessesRemaining);
        console.log(that.currentWord.wordRender());
        // that.keepPromptingUser();
      } else {
        console.log('Yes! You guessed correctly!');
        //checks to see if user won
        if (that.currentWord.didWeFindTheWord() === true) {
          console.log('Congratulations! You guessed the correct word!: ' + that.currentWord.word);
          that.startGame();
        } else {
          // display the user how many guesses remaining
          console.log('Guesses remaining: ' + that.guessesRemaining);
          console.log(that.currentWord.wordRender());
        }
      }
      if (that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
        that.keepPromptingUser();
      } else if (that.guessesRemaining === 0) {
        console.log("Game over! All is Lost! :'( ");
        console.log('The correct word was: ' + that.currentWord.word);
        that.startGame();
      }
      //       else{ console.log(that.currentWord.wordRender()); }
    });
  }
}

hangman.startGame();
