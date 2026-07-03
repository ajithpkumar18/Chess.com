import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";

const ChessBoard = ({
	board,
	socket,
	chess,
	setBoard,
	color,
}: {
	chess: any;
	setBoard: any;
	board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
	socket: WebSocket;
	color: "white" | "black" | null;
}) => {
	const [from, setFrom] = useState<null | Square>(null);
	return (
		<div className='text-white-200'>
			{board.map((row, i) => {
				return (
					<div key={i} className='flex'>
						{row.map((square, j) => {
							const squareRepresentation = (String.fromCharCode(
								97 + (j % 8),
							) +
								"" +
								(8 - i)) as Square;
							return (
								<div
									key={j}
									onClick={() => {
										console.log("click");
										const myTurn =
											color && chess.turn() === color[0];

										if (!myTurn) return;

										if (!from) {
											if (square?.color !== color?.[0]) {
												return;
											}
											setFrom(squareRepresentation);
											console.log(squareRepresentation);
										} else {
											socket.send(
												JSON.stringify({
													type: MOVE,
													payload: {
														from,
														to: squareRepresentation,
													},
												}),
											);
											console.log(
												squareRepresentation,
												"send",
											);
											try {
												chess.move({
													from,
													to: squareRepresentation,
												});
												setBoard(chess.board());
											} catch (err) {
												console.log(
													"Illegal move",
													err,
												);
											}
											setFrom(null);
										}
									}}
									className={`w-16 h-16 font-semibold flex justify-center items-center ${
										(i + j) % 2 === 0
											? "bg-fuchsia-100 text-black"
											: "bg-emerald-600 text-white"
									}`}
								>
									{square ? (
										<img
											src={`${
												square.color == "b"
													? `/assets/${square.type}.png`
													: `/assets/${
															square.type.toUpperCase() +
															"2"
														}.png`
											}`}
											alt=''
										/>
									) : (
										""
									)}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default ChessBoard;
