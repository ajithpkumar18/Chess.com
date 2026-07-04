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

	const legalMoves: { to: Square; captured?: string }[] = from
		? chess.moves({ square: from, verbose: true })
		: [];

	const legalTargets = new Set(legalMoves.map((m) => m.to));

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

							const isSelected = from === squareRepresentation;
							const isLegalTarget =
								legalTargets.has(squareRepresentation);

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
											return;
										}

										if (from === squareRepresentation) {
											setFrom(null);
											return;
										}

										if (square?.color === color?.[0]) {
											setFrom(squareRepresentation);
											return;
										}

										if (
											!legalTargets.has(
												squareRepresentation,
											)
										) {
											setFrom(null);
											return;
										}

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
											console.log("Illegal move", err);
										}
										setFrom(null);
									}}
									className={`relative w-16 h-16 font-semibold flex justify-center items-center cursor-pointer ${
										(i + j) % 2 === 0
											? "bg-fuchsia-100 text-black"
											: "bg-emerald-600 text-white"
									} ${
										isSelected
											? "outline outline-4 outline-yellow-400 outline-offset-[-4px]"
											: ""
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
									{isLegalTarget && (
										<div
											className={
												square
													? "absolute inset-0 border-4 border-red-500/70 rounded-full pointer-events-none"
													: "absolute w-4 h-4 rounded-full bg-black/30 pointer-events-none"
											}
										/>
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
