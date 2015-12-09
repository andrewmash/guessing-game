/* **** Global Variables **** */

// I recognize that this is probably the worst way to eliminate global variables, but
// I figure it's a start. I've been reading about the YUI pattern, but haven't gotten
// it figured out yet.
var gameData = {playersGuess: 0,
    			winningNumber: generateWinningNumber(),
    			guessAmount: 0,
    			guesses: []};



/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateWinningNumber(){
	return Math.ceil(Math.random() * 100);
}

// Fetch the Players Guess

function playersGuessSubmission(){
	gameData.playersGuess = +$('#guess').val();
	$('#guess').val('');
	checkGuess();
}

// Determine if the next guess should be a lower or higher number

function lowerOrHigher(){
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
	". You have " + (5 - gameData.guessAmount) + " guess(es) left!";
}

// Check if the Player's Guess is the winning number 

function checkGuess(){
	if (gameData.guessAmount < 5) {
		if (gameData.playersGuess === gameData.winningNumber) {
			$('.jumbotron').animate({backgroundColor: '#ffffff'}, '800');
			$('#output').text("YOU WIN!");
			$("<audio></audio>").attr({
    			'src':'audio/portal_still_alive.mp3',
    			'autoplay':'autoplay'
			}).appendTo("body");
			$('#guess').prop('disabled', 'true');
		}
		else {
			if (gameData.guesses.indexOf(gameData.playersGuess) == -1) {
				gameData.guessAmount++;

				gameData.guesses.push(gameData.playersGuess);
				$('#output').text(guessMessage());
				if (gameData.guessAmount === 5) {
					$('#output').text("YOU LOSE! Click the Restart button to play again.")
					$("<audio></audio>").attr({
    					'src':'audio/portal_goodbye.mp3',
    					'autoplay':'autoplay'
					}).appendTo("body");
					$('#guess').prop('disabled', 'true');
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
	var hints = [];
	hints.push(gameData.winningNumber);
	for (var i = 0; i < (5 - gameData.guessAmount) * 2 - 1; i++) {
		hints.push(generateWinningNumber());
	}
	$('#output').text("The winning number is one of these: " + shuffle(hints).join(", "));
}

// Allow the "Player" to Play Again

function playAgain(){
	$('#output').text("");
	gameData.winningNumber = generateWinningNumber();
	gameData.guessAmount = 0;
	gameData.guesses = [];
	$('.jumbotron').animate({backgroundColor: '#eeeeee'}, '200');
	$('audio').trigger('pause');
	$('audio').remove();
	$('#guess').prop('disabled', null);
}

// Randomize the order of the hints

function shuffle(array) {
	var newArray = [];
	var originalArrayLength = array.length;
	for (var i = 0; i < originalArrayLength; i++) {
		newArray.push(array.splice(Math.floor(Math.random() * array.length), 1));
	}
	return newArray;
}

/* **** Event Listeners/Handlers ****  */

$('#submit').click(playersGuessSubmission);
$('#hint').click(provideHint);
$('#restart').click(playAgain);
$('#guess').on('keydown', function(key) {
	if(key.keyCode === 13) 
		playersGuessSubmission();
});