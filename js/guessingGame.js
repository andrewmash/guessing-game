/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.

// I recognize that this is probably the worst way to eliminate global variables, but
// I figure it's a start. I've been reading about the YUI pattern, but haven't gotten
// it figured out yet.
var gameData = {playersGuess: 0,
				audioWin: undefined,
				audioLose: undefined,
    			winningNumber: generateWinningNumber(),
    			guessAmount: 0,
    			guesses: []};



/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateWinningNumber(){
	// add code here
	return Math.ceil(Math.random() * 100);
}

// Fetch the Players Guess

function playersGuessSubmission(){
	// add code here
	gameData.playersGuess = +$('#guess').val();
	$('#guess').val('');
	checkGuess();
}

// Determine if the next guess should be a lower or higher number

function lowerOrHigher(){
	// add code here
	return(gameData.playersGuess < gameData.winningNumber ? "lower" : "higher");
}

function guessMessage(){
	var howFarFrom = "";
	var howFar = Math.abs(gameData.playersGuess - gameData.winningNumber);
	if (howFar <= 5) {
		howFarFrom = "within 5 digits of";
		$('.jumbotron').animate({backgroundColor: '#ff9933'}, '800');
	}
	else if (howFar <= 10) {
		howFarFrom = "within 10 digits of";
		$('.jumbotron').animate({backgroundColor: '#ffff99'}, '800');
	}
	else if (howFar <= 20) {
		howFarFrom = "within 20 digits of";
		$('.jumbotron').animate({backgroundColor: '#99ffcc'}, '800');
	}
	else {
		howFarFrom = "more than 20 digits away from";
		$('.jumbotron').animate({backgroundColor: '#00ccff'}, '800');
	}
	return "Your guess was " + lowerOrHigher() + " than, and " + howFarFrom + 
	", the winning number. So far, you have guessed: " + gameData.guesses.join(", ") + 
	". You have " + (5 - gameData.guessAmount) + " guesses left!";
}

// Check if the Player's Guess is the winning number 

function checkGuess(){
	// add code here
	if (gameData.guessAmount < 5) {
		if (gameData.playersGuess === gameData.winningNumber) {
			$('.jumbotron').animate({backgroundColor: '#ffffff'}, '800');
			$('#output').text("YOU WIN!");
			gameData.audioWin = document.createElement('audio');
        	gameData.audioWin.setAttribute('src', 'audio/portal_still_alive.mp3');
        	gameData.audioWin.setAttribute('autoplay', 'autoplay');
        	gameData.audioWin.play();
		}
		else {
			if (gameData.guesses.indexOf(gameData.playersGuess) == -1) {
				gameData.guessAmount++;

				gameData.guesses.push(gameData.playersGuess);
				$('#output').text(guessMessage());
				if (gameData.guessAmount === 5) {
					$('#output').text("YOU LOSE! Click the Restart button to play again.")
					gameData.audioLose = document.createElement('audio');
        			gameData.audioLose.setAttribute('src', 'audio/portal_goodbye.mp3');
        			gameData.audioLose.setAttribute('autoplay', 'autoplay');
        			gameData.audioLose.play();
				}
			}
			else {
				$('#output').text("You submitted a duplicate guess.");
			}
		}
	}
}

// Create a provide hint button that provides additional clues to the "Player"

function provideHint(){
	// add code here
	var hints = [];
	hints.push(gameData.winningNumber);
	for (var i = 0; i < (5 - gameData.guessAmount) * 2 - 1; i++) {
		hints.push(generateWinningNumber());
	}
	$('#output').text("The winning number is one of these: " + shuffle(hints).join(", "));
}

// Allow the "Player" to Play Again

function playAgain(){
	// add code here
	$('#output').text("");
	gameData.winningNumber = generateWinningNumber();
	gameData.guessAmount = 0;
	gameData.guesses = [];
	$('.jumbotron').animate({backgroundColor: '#eeeeee'}, '200');
	if (gameData.audioWin != undefined) {
		gameData.audioWin.pause();
		gameData.audioWin.currentTime = 0;
	}
	if (gameData.audioLose != undefined) {
		gameData.audioLose.pause();
		gameData.audioLose.currentTime = 0;
	}
}

function shuffle(array) {
	// Fisher-Yates shuffle, courtesy of Stack Overflow
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* **** Event Listeners/Handlers ****  */
$('#submit').click(playersGuessSubmission);
$('#hint').click(provideHint);
$('#restart').click(playAgain);
$('#guess').on('keydown', function(key) {
	if(key.keyCode === 13) 
		playersGuessSubmission();
});