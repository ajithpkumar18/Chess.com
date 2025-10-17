import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Landing = () => {
	const navigate = useNavigate();
	return (
		<div className='flex justify-center'>
			<div className='pt-8 max-w-screen-lg'>
				<div className='grid grid-cols-2 gap-4 md:grid-cols-2'>
					<div className='flex justify-center'>
						<img
							src={"chessboard.jpg"}
							alt=''
							className='max-w-96 max-h-96 h-screen'
						/>
					</div>
					<div className='pt-16'>
						<div className='flex justify-center'>
							<h1 className='text-4xl font-bold text-white'>
								{" "}
								Play chess online on the #2 Site!
							</h1>
						</div>
						<div className='mt-4'>
							<Button onClick={() => navigate("/game")}>
								Play Now
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
