import type WebSocket from "ws";

export class Player {
	constructor(
		public socket: WebSocket,
		public color: "white" | "black",
	) {}

	send(type: string, payload: any) {
		if (this.socket.readyState !== this.socket.OPEN) return;

		try {
			this.socket.send(JSON.stringify({ type, payload }));
		} catch (err) {
			console.log("Failed to send message", err);
		}
	}
}
