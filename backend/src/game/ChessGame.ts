import { Chess } from "chess.js";

export type PlayerColor = "white" | "black";

export class ChessGame {
	private chess = new Chess();

	makeMove(move: { from: string; to: string }) {
		const result = this.chess.move(move);

		if (!result) {
			throw new Error("Illegal move");
		}
	}

	getTurn(): PlayerColor {
		return this.chess.turn() === "w" ? "white" : "black";
	}

	isGameOver(): boolean {
		return this.chess.isGameOver();
	}

	getWinner(): PlayerColor | "draw" {
		if (!this.chess.isCheckmate()) {
			return "draw";
		}

		return this.chess.turn() === "w" ? "black" : "white";
	}

	isCheck(): Boolean {
		return this.chess.isCheck();
	}

	getGameOverReason(): "checkmate" | "stalemate" | "draw" {
		if (this.chess.isCheckmate()) return "checkmate";
		if (this.chess.isStalemate()) return "stalemate";
		return "draw";
	}
}
