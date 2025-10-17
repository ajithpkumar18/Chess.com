import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import Button from "../components/Button";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
	const socket = useSocket();
	const [chess, setChess] = useState(new Chess());
	const [board, setBoard] = useState(chess.board());

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);

			switch (message.type) {
				case INIT_GAME:
					setChess(new Chess());
					setBoard(chess.board());
					console.log("Game Initialized");
					break;
				case MOVE:
					const move = message.payload;
					chess.move(move);
					setBoard(chess.board());
					console.log("Move made");
					break;
				case GAME_OVER:
					console.log("Game Over");
					break;
			}
		};
	}, [socket]);
	if (!socket) return <div>Connecting</div>;
	return (
		<div className='justify-center flex w-full'>
			<div className='pt-8 max-w-screen-lg w-full '>
				<div className='flex  w-full'>
					<div className='  w-full  flex items-center justify-around'>
						<ChessBoard board={board} />
					</div>
					<div className=' bg-red-200 w-full'>
						<Button
							onClick={() => {
								socket.send(
									JSON.stringify({
										type: INIT_GAME,
									})
								);
							}}
						>
							Play
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Game;
