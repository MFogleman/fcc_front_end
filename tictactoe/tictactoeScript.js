var human = null;
var computer = null;
var game = new GameState();
var arrayOfWinningLines = [[0, 1, 2],
                           [3, 4, 5],
                           [6, 7, 8],
                           [0, 3, 6],
                           [1, 4, 7],
                           [2, 5, 8],
                           [0, 4, 8],
                           [2, 4, 6]];
game.initBoard();
$(document).ready(function(){
	initMenu();
})

function initMenu(){
	game = new GameState();
	game.initBoard();
	$("#message").fadeIn(250, function(){
		$("#message").text("Choose Your Team");
	});

	$(".teamLetter").hover(function(){
		if(game.setup){
			$(this).addClass("jqHover");
		}
	}, function(){
		$(this).removeClass("jqHover");
	});
	
	$(".teamLetter").click(function(){
		if (game.setup){
			var team = $(this);
			game.setOptions(team);
		}
	});

	$(".cell").hover(function(){
		if (game.turn){
			$(this).addClass("jqHover");
		}
	}, function(){
		$(this).removeClass("jqHover");
	});

	$(".cell").click(function(){
		var id = $(this).attr('id');
		human.humanMove(id);
	})
}

function Cell(id, letter){
	this.id = id;
	this.letter = letter;
}

function GameState(){
	this.turns = 0;
	this.setup = true;
	this.turn = false;
	this.over = false;
	this.difficulty = undefined;
	this.board = [];
	this.initBoard = function(){
		for (var i = 0; i <= 8; i++){
			this.board.push(new Cell(i, "N"));
			$("#"+i).text("");
			$(".cell").removeAttr("style");
		};
	};
	this.setOptions = function(team){
		game.setup = false; 
		team.addClass("selectedTeam");

		$("#message").fadeOut(250, function(){  //fade in difficult settings
			$("#message").text("Choose Your Difficulty");
			$("#message").fadeIn(250);
		});

		$(".options").css("visibility", "visible").hide().fadeIn(500);

		$(".options").hover(function(){
			if (game.difficulty == undefined){
				$(this).addClass("jqHover");
			}
		}, function(){
			$(this).removeClass("jqHover");
		})
		
		$(".options").click(function(){ //set difficulty settings
			if (game.difficulty == undefined){
				game.difficulty = $(this).text();
				$(this).addClass("selectedDifficulty");
								
				human = new Player("human", team.text());
				computer = new Player("computer", human.letter =="X" ? "O" : "X");
				//game.initBoard();
				game.turn = human
				$("#message").fadeOut(250, function(){
					$("#message").html("&nbsp;&nbsp;Good Luck!&nbsp;&nbsp;")  
					$("#message").fadeIn(250);
				})
			}	
		});
	}

	this.updateBoard = function(id, playerletter){
		this.turns +=1;
		this.board[id].letter = playerletter;
		$("#" + id).text(playerletter);
		this.checkWin();
		game.switchTurns();
	}
	
	this.switchTurns = function(){
		if (this.turn == computer && this.turns < 9){
			this.turn = human;
		}else if (this.turn == human && this.turns < 9){
			this.turn = computer;
			computer.computerMove();
		}
	}

	this.checkWin = function(){
		
		if (game.over == false){
			this.checkBoard(game.board[0], game.board[1], game.board[2]);
			this.checkBoard(game.board[3], game.board[4], game.board[5]);
			this.checkBoard(game.board[6], game.board[7], game.board[8]);
			this.checkBoard(game.board[0], game.board[3], game.board[6]);
			this.checkBoard(game.board[1], game.board[4], game.board[7]);
			this.checkBoard(game.board[2], game.board[5], game.board[8]);
			this.checkBoard(game.board[0], game.board[4], game.board[8]);
			this.checkBoard(game.board[2], game.board[4], game.board[6]);
		};
		if (this.turns == 9){
			this.staleMate();
		}

	}

	this.checkBoard = function(boardA, boardB, boardC){
		if  (boardA.letter == boardB.letter && 
			 boardB.letter == boardC.letter && 
			 boardC.letter != "N"){
			
			game.over = true;
			
			return game.winningMove(boardA, boardB, boardC);
		}
	}

	this.winningMove = function(boardA, boardB, boardC){
		this.turn = false;
		$("#"+boardA.id).css("background-color", "477F91");
		$("#"+boardB.id).css("background-color", "477F91");
		$("#"+boardC.id).css("background-color", "477F91");
		
		this.reset();
	}

	this.staleMate = function(){
		this.turn = false;
		game.over = true;
		
		$(".cell").css("background-color", "477F91");
		this.reset();
	}

	this.reset = function(){
		
		
		$("#message").fadeOut(250, function(){ 
			$("#message").text("Click Here To Reset");
			$("#message").fadeIn(250);
		});
		
		$(".menu").click(function(){
			if (game.over == true){
				
				$(".teamLetter").removeClass("selectedTeam");
				$(".options").removeClass("selectedDifficulty");
				$(".options").css("visibility", "hidden");
				$("#message").fadeOut(250, function(){
					$("#message").text("Choose Your Team")
				});
					
				game = null;
				human = null;
				computer = null;
				initMenu();
			}	
		})
	}
}






function Player(controller, letter){
	this.controller = controller;
	this.letter = letter;
	
	this.humanMove = function(id){
		if (game.board[id].letter == "N" && game.turn == human){
			game.updateBoard(id, human.letter);
		}
	}
	
	this.computerMove = function(id){

		
		if (game.difficulty == "Easy"){
			game.updateBoard(this.easyMove(), computer.letter);
		}

		else if (game.difficulty == "Hard"){
			this.hardMove();

		}
		
	}

	this.hardMove = function(){
		
		var bestMove;

		//try to find a winning move
		for (var arr = 0; arr < arrayOfWinningLines.length; arr++){ 
			if (this.lookForWin(arrayOfWinningLines[arr])){ 
				bestMove = this.lookForWin(arrayOfWinningLines[arr]);
				return game.updateBoard(bestMove, computer.letter);
			}
		}
		//if we cant find a winning move, block a threatened win
		for (var arr = 0; arr < arrayOfWinningLines.length; arr++){ //iterate over the board
			if (this.lookForBlock(arrayOfWinningLines[arr])){ // look in this array blocking move
				bestMove = this.lookForBlock(arrayOfWinningLines[arr]);
				return game.updateBoard(bestMove, computer.letter);
			}
		}
		return 	game.updateBoard(this.easyMove(), computer.letter);

	}
	

	this.lookForWin = function(arr){
		var countedArray = this.countPieces(arr);
		if (countedArray[0].length == 0 && countedArray[1].length == 2){
			return countedArray[2];
		}
	};

	this.lookForBlock = function(arr){
		var countedArray = this.countPieces(arr);
		if (countedArray[0].length == 2 && countedArray[2].length == 1){
			return countedArray[2];
		}
	};

	this.countPieces = function(arr){
		var humanArr = [];
		var compArr = [];
		var emptyArr = [];
		for (var i = 0; i < arr.length; i++){
			if (game.board[arr[i]].letter == computer.letter){
				compArr.push(arr[i]);
			}
			if (game.board[arr[i]].letter == human.letter){
				humanArr.push(arr[i]);
			}
			if (game.board[arr[i]].letter == "N"){
				emptyArr.push(game.board[arr[i]].id);
			}
		}
		
		return [humanArr, compArr, emptyArr];
		
	};

	this.easyMove = function(){
		var randomIndex = Math.floor(Math.random() * game.board.length);
		while (game.board[randomIndex].letter != "N"){
			randomIndex = Math.floor(Math.random() * game.board.length);
		}
		return randomIndex;
	};
}
