function Game () {
	this.players = [];
	this.currentPlayer = 0;
	this.category = '';
	this.puzzle = '';
	this.lastSpin = '';
	this.logo = document.getElementById('logo');
	this.statusbar = document.getElementById('statusbar');
	this.board = document.getElementById('board');
	this.scoreboard = document.getElementById('scoreboard');
	this.wheel = document.getElementById('wheel');
	this.wheeltick = document.getElementById('wheeltick');
}

Game.prototype = {
	ShowLogo: function () {
		this.logo.classList.add('show');
		this.logo.classList.remove('hide');
	},

	HideLogo: function () {
		this.logo.classList.remove('show');
		this.logo.classList.add('hide');
	},

	ThemeSong: function () {
		document.getElementById('fxTheme').play();
	},

	ThemeSongStop: function () {
		var theme = document.getElementById('fxTheme');
		theme.pause();
		theme.currentTime = 0;
	},

	ClearPlayers: function () {
		this.players = [];
		this.currentPlayer = 0;
	},
	
	AddPlayer: function (name) {
		this.players.push({
			name: name,
			gameScore: 0,
			totalScore: 0
		});
	},

	SetCurrentPlayer: function (name) {
		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i].name === name) {
				this.currentPlayer = i;
				document.getElementById('player' + i).classList.add('player-active');
			} else {
				document.getElementById('player' + i).classList.remove('player-active');
			}
		}
	},

	NextPlayer: function () {
		this.currentPlayer++;

		if (this.currentPlayer >= this.players.length) {
			this.currentPlayer = 0;
		}

		this.SetCurrentPlayer(this.players[this.currentPlayer].name);
	},

	DrawBoard: function () {
		var divLetterBlock;
		var divLetter;

		for(var i = 0; i < (14 * 5); i++) {
			divLetterBlock = document.createElement('div');
			divLetterBlock.className = 'letter-block';

			divLetter = document.createElement('div');
			divLetter.id = 'letter' + i;
			divLetter.classList.add('letter');

			divLetterBlock.append(divLetter);

			this.board.append(divLetterBlock);
		}
	},

	DrawGameScores: function () {
		this.players.forEach(function (player, idx) {
			document.getElementById('player' + idx).innerHTML = '<span class="playerName">' + player.name  +'</span><br/>$' + player.gameScore.toString();
		});
	},

	DrawTotalScores: function () {
		this.players.forEach(function (player, idx) {
			var playerTotal = document.getElementById('player' + idx);
			playerTotal.innerHTML = '<span class="playerName">' + player.name  +'</span><br/>$' + player.totalScore.toString();
			playerTotal.classList.add('player-active');
		});
	},

	ClearGameScores: function () {
		this.players.forEach(function (player) {
			player.gameScore = 0;
		});
	},

	AddGameScore: function (score) {
		this.players[this.currentPlayer].gameScore += score;
	},
	
	ClearTotalScores: function () {
		this.players.forEach(function (player) {
			player.totalScore = 0;
		});
	},

	ShowBoard: function () {
		this.statusbar.classList.remove('hide');
		this.statusbar.classList.add('show');
		this.board.classList.remove('hide');
		this.board.classList.add('show');
		this.scoreboard.classList.remove('hide');
		this.scoreboard.classList.add('show');
	},

	HideBoard: function () {
		this.statusbar.classList.remove('show');
		this.statusbar.classList.add('hide');
		this.board.classList.remove('show');
		this.board.classList.add('hide');
		this.scoreboard.classList.remove('show');
		this.scoreboard.classList.add('hide');
	},

	ClearBoard: function () {
		document.getElementById('category').innerHTML = '';

		var letters = this.board.querySelectorAll('.letter');

		letters.forEach(function (letter) {
			letter.classList.remove('letter-show');
			letter.classList.add('letter-hide');
			letter.innerHTML = '&nbsp;';
		});
	},

	SetPuzzle: function (category, puzzle) {
		this.category = category.toUpperCase();
		this.puzzle = puzzle.toUpperCase();
	},

	RevealPuzzle: function () {
		document.getElementById('category').innerHTML = this.category;
		
		var divLetter;

		for (var i = 0; i < this.puzzle.length; i++) {
			if (this.puzzle[i] !== ' ') {
				divLetter = document.getElementById('letter' + i);
				divLetter.classList.add('letter-show');
				divLetter.classList.remove('letter-hide');
			}
		}

		document.getElementById('fxReveal').play();
	},

	SolvePuzzle: function () {
		for (var i = 0; i < this.puzzle.length; i++) {
			if (this.puzzle[i] !== ' ') {
				document.getElementById('letter' + i).innerHTML = this.puzzle[i];
			}
		}

		document.getElementById('fxSolve').play();

		this.players[this.currentPlayer].totalScore += this.players[this.currentPlayer].gameScore;

		this.DrawTotalScores();
	},

	GuessLetter: function (letter) {
		var indices = [];
		letter = letter.toUpperCase();

		for (var i = 0; i < this.puzzle.length; i++) {
			if (this.puzzle[i] === letter) {
				indices.push(i);
			}
		}

		if (indices.length > 0) {
			var divLetters = [];

			indices.forEach(function (index) {
				divLetters.push(document.getElementById('letter' + index));
			});

			this.AddGameScore(indices.length * parseInt(this.lastSpin, 10));
			this.DrawGameScores();

			divLetters.forEach(function (div, idx) {
				div.classList.remove('letter-show');
				div.classList.add('letter-highlight');

				setTimeout(function() {
					div.classList.add('letter-show');
					div.classList.remove('letter-highlight');
					div.innerHTML = letter;
					document.getElementById('fxCorrect').play();

				}, ((idx + 1) * 1700));
			});
		} else {
			document.getElementById('fxWrong').play();
		}
	},

	ShowWheel: function () {
		this.wheel.classList.remove('hide');
		this.wheel.classList.add('show');
		this.wheeltick.classList.remove('hide');
		this.wheeltick.classList.add('show');
	},

	HideWheel: function () {
		this.wheel.classList.remove('show');
		this.wheel.classList.add('hide');
		this.wheeltick.classList.remove('show');
		this.wheeltick.classList.add('hide');
	},

	SpinWheel: function () {
		this.HideBoard();
		this.ShowWheel();

		var wheelfx = document.getElementById('fxSpin')
		wheelfx.play();

		window.Wheel.spin(function (value) {
			console.log(value);
			this.lastSpin = value;
			wheelfx.pause();
			wheelfx.currentTime = 0;
			this.ShowBoard();
			this.HideWheel();
			this.ShowSpinAmount(value);
		}.bind(this));
	},

	ShowSpinAmount: function (value) {
		var isLoseATurn = (value === 'LAT');
		var isBankrupt = (value === 'BANKRUPT');
		var amount = document.getElementById('spinamount');
		var text = '';

		if (isLoseATurn) {
			text = 'LOSE A TURN';
			amount.classList.add('loseaturn');
		} else if (isBankrupt) {
			text = value;
			amount.classList.add('bankrupt');
		} else {
			text = '$' + value;
		}

		amount.innerHTML = text;
		amount.classList.remove('hide');
		amount.classList.add('show');

		if (isLoseATurn) {
			this.LoseATurn();
		}

		if (isBankrupt) {
			this.Bankrupt();
		}

		setTimeout(function () {
			this.HideSpinAmount();
		}.bind(this), 5000);
	},

	HideSpinAmount: function () {
		var amount = document.getElementById('spinamount');
		amount.classList.remove('show');
		amount.classList.remove('bankrupt');
		amount.classList.remove('loseaturn');
		amount.classList.add('hide');
	},

	Bankrupt: function () {
		this.players[this.currentPlayer].gameScore = 0;
		this.DrawGameScores();
		this.NextPlayer();
		document.getElementById('fxFail').play();
	},

	LoseATurn: function () {
		this.NextPlayer();
		document.getElementById('fxFail').play();
	}
};

