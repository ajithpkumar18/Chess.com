import type { Color, PieceSymbol, Square } from "chess.js";

const ChessBoard = ({
	board,
}: {
	board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
}) => {
	return (
		<div className='text-white-200'>
			{board.map((row, i) => {
				return (
					<div key={i} className='flex'>
						{row.map((square, j) => {
							return (
								<div
									key={j}
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
