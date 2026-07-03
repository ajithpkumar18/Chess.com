import { ChessGame } from "./ChessGame.js";
import { Player } from "./Player.js";
import { GAME_OVER, INIT_GAME, MESSAGE, MOVE } from "../messages.js";
import type WebSocket from "ws";

const GAME_TIME_MS = 5 * 60 * 1000;

export class Game {
	private chessGame = new ChessGame();
	private white: Player;
	private black: Player;

	private whiteTime = GAME_TIME_MS;
	private blackTime = GAME_TIME_MS;

	private lastMoveTimestamp = Date.now();
	private isOver = false;

	constructor(player1: WebSocket, player2: WebSocket) {
		this.white = new Player(player1, "white");
		this.black = new Player(player2, "black");

		this.white.send(INIT_GAME, { color: "white", time: this.whiteTime });
		this.black.send(INIT_GAME, { color: "black", time: this.blackTime });
	}

	makeMove(socket: WebSocket, move: { from: string; to: string }) {
		console.log(move);
		const currentPlayer = this.getPlayerBySocket(socket);

		if (this.isOver) {
			currentPlayer?.send(MESSAGE, "Game Over");
			return;
		}

		if (!currentPlayer) {
			console.log("No current player");
			return;
		}

		if (this.chessGame.getTurn() !== currentPlayer.color) {
			console.log("Not your turn");

			currentPlayer.send(MESSAGE, "Not your turn");
			return;
		}

		this.updateClock(currentPlayer);

		if (this.isTimedOut(currentPlayer)) {
			this.endGame(
				currentPlayer.color === "white" ? "black" : "white",
				"timeout",
			);

			return;
		}

		try {
			this.chessGame.makeMove(move);
		} catch (err) {
			console.log("Invalid move");

			currentPlayer.send(MESSAGE, `Invalid move ${err}`);
			return;
		}

		const opponent =
			currentPlayer.color === "white" ? this.black : this.white;

		opponent.send(MOVE, {
			move,
			whiteTime: this.whiteTime,
			blackTime: this.blackTime,
		});

		console.log(`move made by ${currentPlayer.color}`);

		if (this.chessGame.isGameOver()) {
			const winner = this.chessGame.getWinner();
			this.endGame(winner, "checkmate");
		}
	}

	private updateClock(player: Player) {
		const now = Date.now();

		const elapsed = now - this.lastMoveTimestamp;

		if (player.color === "white") {
			this.whiteTime -= elapsed;
		} else {
			this.blackTime -= elapsed;
		}

		this.lastMoveTimestamp = now;
	}

	private isTimedOut(player: Player): Boolean {
		return player.color === "white"
			? this.whiteTime <= 0
			: this.blackTime <= 0;
	}

	private endGame(
		winner: "white" | "black" | "draw",
		reason: "checkmate" | "timeout",
	) {
		if (this.isOver) return;
		this.isOver = true;

		this.white.send(GAME_OVER, {
			winner,
			reason,
			whiteTime: this.whiteTime,
			blackTime: this.blackTime,
		});

		this.black.send(GAME_OVER, {
			winner,
			reason,
			whiteTime: this.whiteTime,
			blackTime: this.blackTime,
		});
	}

	private getPlayerBySocket(socket: WebSocket): Player | null {
		if (this.white.socket === socket) return this.white;
		if (this.black.socket === socket) return this.black;

		return null;
	}
}
