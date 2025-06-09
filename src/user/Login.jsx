import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../authContext";
import Navbar from "../component/Navbar";
import Lottie from "lottie-react";
import robotAnimation from "../assets/robot-amation.json";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [auth, setAuth] = useAuth({});
	const location = useLocation();
	const redirectPath = new URLSearchParams(location.search.split("?")[1]).get(
		"redirect"
	);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER}/api/auth/login`,
				{ email, password }
			);
			if (data?.success) {
				setAuth({
					username: data.role ? "admin" : "user",
					user_id: data.user_id,
					token: data.token,
				});
				localStorage.setItem(
					"form-auth",
					JSON.stringify({
						username: data.role ? "admin" : "user",
						user_id: data.user_id,
						token: data.token,
					})
				);
				toast.success(data.message);
				if (redirectPath) navigate(redirectPath);
				else if (data.role) navigate("/all-forms");
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};
	return (
		<div>
			<Navbar />
			<div className="login-container flex flex-col md:flex-row justify-between items-center">
				<div className="login-left flex flex-col items-center justify-center text-center p-8 w-1/2">
					<Lottie
						animationData={robotAnimation}
						loop={true}
						className="md:w-64 w-48"
					/>
					<h1 className="text-3xl font-bold mt-4">Welcome back!</h1>
					<p className="mt-4">
						Emily, your Personal NCS Guide presents herself!
					</p>
					<p className="mt-2">
						Google forms weren’t cool enough, so we built our own! Emily is a
						conversational chatbot which makes filling forms easy & fun. Also,
						you can use the in-built form builder to create personalized forms.
					</p>
				</div>

				<div className="login-right flex flex-col items-center justify-center p-8 w-1/2">
					<form className="login-form max-w-[360px]" onSubmit={handleSubmit}>
						<input
							value={email}
							onInput={(e) => setEmail(e.target.value)}
							type="email"
							className="p-3 w-full text-md font-semibold rounded-lg outline-0 mb-4 border border-gray-300"
							placeholder="Enter Email"
							required
						/>
						<input
							value={password}
							onInput={(e) => setPassword(e.target.value)}
							type="password"
							className="p-3 w-full text-md font-semibold rounded-lg outline-0 mb-4 border border-gray-300"
							placeholder="Enter Password"
							required
						/>
						<br />
						<Link
							to={`/signup${redirectPath ? `?redirect=${redirectPath}` : ""}`}
							className="text-primary-100"
						>
							Create a new account
						</Link>
						<br />
						<button
							type="submit"
							className="p-3 w-full text-lg font-semibold rounded-lg bg-primary-100 text-white hover:bg-primary-200 transition-colors duration-100 cursor-pointer mt-4"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Login;
