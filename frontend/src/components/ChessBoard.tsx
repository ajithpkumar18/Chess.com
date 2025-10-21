import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";

const ChessBoard = ({
	board,
	socket,
	chess,
	setBoard,
}: {
	chess: any;
	setBoard: any;
	board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
	socket: WebSocket;
}) => {
	const [from, setFrom] = useState<null | Square>(null);
	const [to, setTo] = useState<null | Square>(null);
	return (
		<div className='text-white-200'>
			{board.map((row, i) => {
				return (
					<div key={i} className='flex'>
						{row.map((square, j) => {
							const squareRepresentation = (String.fromCharCode(
								97 + (j % 8)
							) +
								"" +
								(8 - i)) as Square;
							return (
								<div
									key={j}
									onClick={() => {
										console.log("click");
										if (!from) {
											setFrom(squareRepresentation);
											console.log(squareRepresentation);
										} else {
											socket.send(
												JSON.stringify({
													type: MOVE,
													payload: {
														move: {
															from,
															to: squareRepresentation,
														},
													},
												})
											);
											console.log(
												squareRepresentation,
												"send"
											);
											chess.move({
												from,
												to: squareRepresentation,
											});
											setBoard(chess.board());
											setFrom(null);
										}
									}}
									className={`w-16 h-16 font-semibold flex justify-center items-center ${
										(i + j) % 2 === 0
											? "bg-fuchsia-100 text-black"
											: "bg-emerald-600 text-white"
									}`}
								>
									{square ? square.type : ""}
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
