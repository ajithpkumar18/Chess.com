import type WebSocket from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./game/Game.js";

export class GameManager {
	private pendingUser: WebSocket | null = null;
	private activeGames = new Map<WebSocket, Game>();

	addUser(socket: WebSocket) {
		this.addHandlers(socket);
	}

	removeUser(socket: WebSocket) {
		// If user was waiting, remove them
		if (this.pendingUser === socket) {
			this.pendingUser = null;
		}

		// If user was in a game, clean up
		const game = this.activeGames.get(socket);
		if (game) {
			this.activeGames.delete(socket);
			// optional: notify opponent about forfeit
		}
	}

	private addHandlers(socket: WebSocket) {
		socket.on("message", (data) => {
			let message: any;

			try {
				message = JSON.parse(data.toString());
			} catch {
				return;
			}

			switch (message.type) {
				case INIT_GAME:
					console.log("init game");
					this.handleInitGame(socket);
					break;

				case MOVE:
					this.handleMove(socket, message.payload);
					break;
			}
		});

		socket.on("close", () => {
			this.removeUser(socket);
		});
	}

	private handleInitGame(socket: WebSocket) {
		if (this.pendingUser) {
			const game = new Game(this.pendingUser, socket);

			// map both players to the same game
			this.activeGames.set(this.pendingUser, game);
			this.activeGames.set(socket, game);

			this.pendingUser = null;
		} else {
			this.pendingUser = socket;
		}
	}

	private handleMove(socket: WebSocket, move: { from: string; to: string }) {
		const game = this.activeGames.get(socket);
		if (!game) {
			console.log("No game found");
			return;
		}

		let msg = game.makeMove(socket, move);
		return msg;
	}
}
