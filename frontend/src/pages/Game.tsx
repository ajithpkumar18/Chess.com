import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
	const socket = useSocket();
	const [chess, setChess] = useState(new Chess());
	const [board, setBoard] = useState(chess.board());
	const [status, setStatus] = useState(false);
	const [winner, setWinner] = useState<String | null>(null);
	const [color, setColor] = useState<"white" | "black" | null>(null);
	const [whiteTime, setWhiteTime] = useState(5 * 60 * 1000);
	const [blackTime, setBlackTime] = useState(5 * 60 * 1000);
	const navigate = useNavigate();

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);

			switch (message.type) {
				case INIT_GAME:
					setColor(message.payload.color);
					setWhiteTime(message.payload.whiteTime);
					setBlackTime(message.payload.blackTime);
					setBoard(chess.board());
					console.log("Game Initialized");
					break;
				case MOVE:
					const move = message.payload.move;
					setWhiteTime(message.payload.whiteTime);
					setBlackTime(message.payload.blackTime);

					if (!message.payload.self) {
						chess.move(move);
						setBoard(chess.board());
					}
					console.log("Move made");
					break;
				case GAME_OVER:
					setWinner(message.payload.winner);
					break;
			}
		};
	}, [socket]);

	const formatTime = (ms: number) => {
		const totalSeconds = Math.ceil(ms / 1000);
		const m = Math.floor(totalSeconds / 60);
		const s = totalSeconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	if (!socket) return <div>Connecting</div>;

	return (
		<div className='justify-center flex w-full'>
			{winner && (
				<div className='absolute top-0 left-0 backdrop-brightness-50 backdrop-blur-lg  h-full w-full flex items-center justify-center'>
					<div className='w-1/4 pt-12 min-h-4/12 bg-slate-200 font-semibold text-2xl text-center rounded-2xl'>
						The winner is
						<br />
						<p className='text-4xl text-red-400 pt-5'>
							{winner.charAt(0).toUpperCase() +
								winner.slice(1, winner.length)}
						</p>
						<button
							type='button'
							className='bg-green-500 rounded-md p-2 mt-7 min-w-32 text-amber-50 cursor-pointer'
							onClick={() => navigate("/")}
						>
							Home
						</button>
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
							color={color}
						/>
					</div>
					<div className=' bg-red-200 w-full'>
						<div className='flex flex-col items-center gap-2 py-4'>
							<div className='px-4 py-2 bg-slate-800 text-white rounded font-mono text-xl'>
								Black: {formatTime(blackTime)}
							</div>
							<div className='px-4 py-2 bg-slate-100 text-black rounded font-mono text-xl'>
								White: {formatTime(whiteTime)}
							</div>
						</div>
						{!status && (
							<Button
								onClick={() => {
									socket.send(
										JSON.stringify({
											type: INIT_GAME,
										}),
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
