function Game () {
	this.players = [];
	this.currentPlayer = 0;
	this.category = '';
	this.puzzle = '';
	this.lastSpin = '';
	this.statusbar = document.getElementById('statusbar');
	this.board = document.getElementById('board');
	this.scoreboard = document.getElementById('scoreboard');
	this.wheel = document.getElementById('wheel');
	this.wheeltick = document.getElementById('wheeltick');
}

Game.prototype = {
	ShowLogo: function () {
		Show('logo');
	},

	HideLogo: function () {
		Hide('logo');
	},

	ThemeSong: function () {
		Play('fxTheme');
	},

	ThemeSongStop: function () {
		Stop('fxTheme');
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
				AddClass('player' + i, 'player-active');
			} else {
				RemoveClass('player' + i, 'player-active');
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
			Text('player' + idx, '<span class="playerName">' + player.name  +'</span><br/>$' + player.gameScore);
		});
	},

	DrawTotalScores: function () {
		this.players.forEach(function (player, idx) {
			var id = 'player' + idx;
			Text(id, '<span class="playerName">' + player.name  +'</span><br/>$' + player.totalScore);
			AddClass(id, 'player-active');
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
		Show('statusbar');
		Show('board');
		Show('scoreboard');
	},

	HideBoard: function () {
		Hide('statusbar');
		Hide('board');
		Hide('scoreboard');
	},

	ClearBoard: function () {
		Text('category', '');

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
		Text('category', this.category);
		
		var divLetter;

		for (var i = 0; i < this.puzzle.length; i++) {
			if (this.puzzle[i] !== ' ') {
				divLetter = document.getElementById('letter' + i);
				divLetter.classList.add('letter-show');
				divLetter.classList.remove('letter-hide');
			}
		}

		Play('fxReveal');
	},

	SolvePuzzle: function () {
		for (var i = 0; i < this.puzzle.length; i++) {
			if (this.puzzle[i] !== ' ') {
				GetById('letter' + i).innerHTML = this.puzzle[i];
			}
		}

		Play('fxSolve');

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
				divLetters.push(GetById('letter' + index));
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

					Play('fxCorrect');

				}, ((idx + 1) * 1700));
			});
		} else {
			Play('fxWrong');
		}
	},

	ShowWheel: function () {
		Show('wheel');
		Show('wheeltick');
	},

	HideWheel: function () {
		Hide('wheel');
		Hide('wheeltick');
	},

	SpinWheel: function () {
		this.HideBoard();
		this.ShowWheel();

		Play('fxSpin')

		window.Wheel.spin(function (value) {
			console.log(value);
			this.lastSpin = value;
			Stop('fxSpin');
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
		Play('fxFail');
	},

	LoseATurn: function () {
		this.NextPlayer();
		Play('fxFail');
	}
};

