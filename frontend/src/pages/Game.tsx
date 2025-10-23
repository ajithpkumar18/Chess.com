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
	const [status, setStatus] = useState(false);
	const [winner, setWinner] = useState<String | null>(null);

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);

			switch (message.type) {
				case INIT_GAME:
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
					setWinner(message.payload.winner);
					break;
			}
		};
	}, [socket]);
	if (!socket) return <div>Connecting</div>;
	return (
		<div className='justify-center flex w-full'>
			{winner && (
				<div className='absolute top-0 left-0 backdrop-brightness-50 backdrop-blur-lg  h-full w-full flex items-center justify-center'>
					<div className='w-2/4 pt-5 h-48 bg-slate-200 font-semibold text-2xl text-center rounded-2xl'>
						The winner is
						<br />
						<p className='text-4xl text-red-400 pt-5'>
							{winner.charAt(0).toUpperCase() +
								winner.slice(1, winner.length)}
						</p>
					</div>
				</div>
			)}
			<div className='pt-8 max-w-screen-lg w-full '>
				<div className='flex  w-full'>
					<div className='  w-full  flex items-center justify-around'>
						<ChessBoard
							board={board}
							socket={socket}
							chess={chess}
							setBoard={setBoard}
						/>
					</div>
					<div className=' bg-red-200 w-full'>
						{!status && (
							<Button
								onClick={() => {
									socket.send(
										JSON.stringify({
											type: INIT_GAME,
										})
									);

									setStatus(true);
								}}
							>
								Play
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Game;
