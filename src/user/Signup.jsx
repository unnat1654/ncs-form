import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Navbar from "../component/Navbar";
import Lottie from "lottie-react";
import robotAnimation from "../assets/robot-amation.json";

const Signup = () => {
	const [resendTimer, setResendTimer] = useState(0);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [otpSent, setOTPSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [user_id, setUser_id] = useState("");
	const [auth, setAuth] = useAuth({});
	const location = useLocation();
	const redirectPath = new URLSearchParams(location.search.split("?")[1]).get(
		"redirect"
	);
	const navigate = useNavigate();

	useEffect(() => {
		let interval;
		if (resendTimer > 0) {
			interval = setInterval(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
		} else if (interval) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [resendTimer]);

	const handleBeforeInput = (e) => {
		// Allow only numeric characters
		if (!/^\d*$/.test(e.data)) {
			e.preventDefault();
		}
	};

	const sendOTP = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER}/api/auth/signup`,
				{ email, phone, password }
			);
			if (data?.success) {
				toast.success(data.message);
				setUser_id(data.user_id);
				setResendTimer(60);
				setOTPSent(true);
			}
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data?.message);
		}
	};

	const reSendOTP = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER}/api/auth/resend-otp`,
				{ user_id, action: "SIGNUP" }
			);
			if (data?.success) {
				toast.success(data.message);
				setUser_id(data.user_id);
				setResendTimer(60);
			}
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data?.message);
		}
	};

	const verifyOTP = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER}/api/auth/verify-signup-otp`,
				{ user_id, otp: +otp }
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
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<div>
			<Navbar />
			<div className="signup-container flex flex-col md:flex-row justify-between items-center">
				<div className="signup-left flex flex-col items-center justify-center text-center p-8 w-1/2">
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

				<div className="signup-right flex flex-col items-center justify-center p-8 w-1/2">
					{!otpSent && (
						<SignupForm
							email={email}
							setEmail={setEmail}
							password={password}
							setPassword={setPassword}
							phone={phone}
							setPhone={setPhone}
							sendOTP={sendOTP}
							otpSent={otpSent}
							reSendOTP={reSendOTP}
							resendTimer={resendTimer}
							handleBeforeInput={handleBeforeInput}
							redirectPath={redirectPath}
						/>
					)}

					{otpSent && (
						<VerifyOTPForm
							otp={otp}
							setOtp={setOtp}
							verifyOTP={verifyOTP}
							handleBeforeInput={handleBeforeInput}
							otpSent={otpSent}
						/>
					)}
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

const SignupForm = ({
	email,
	setEmail,
	password,
	setPassword,
	phone,
	setPhone,
	sendOTP,
	otpSent,
	reSendOTP,
	resendTimer,
	handleBeforeInput,
	redirectPath = "",
}) => {
	return (
		<form
			className="signup-form max-w-[360px]"
			onSubmit={otpSent ? reSendOTP : sendOTP}
		>
			<input
				value={email}
				onInput={(e) => setEmail(e.target.value)}
				type="email"
				className="signup-input p-3 w-full text-md font-semibold rounded-lg outline-0 mb-4 border border-gray-300"
				placeholder="Enter Email"
				disabled={otpSent}
				required
			/>
			<input
				value={phone}
				onInput={(e) => setPhone(e.target.value)}
				onBeforeInput={handleBeforeInput}
				type="tel"
				className="signup-input p-3 w-full text-md font-semibold rounded-lg outline-0 mb-4 border border-gray-300"
				placeholder="Enter Phone"
				disabled={otpSent}
				required
			/>
			<input
				value={password}
				onInput={(e) => setPassword(e.target.value)}
				type="password"
				className="signup-input p-3 w-full text-md font-semibold rounded-lg outline-0 mb-4 border border-gray-300"
				placeholder="Enter Password"
				disabled={otpSent}
				required
			/>
			<br />
			<Link
				to={`/login${redirectPath ? `?redirect=${redirectPath}` : ""}`}
				className="text-primary-100"
			>
				Already have an account?
			</Link>
			<br />
			<button
				type="submit"
				className="sendotp-button p-3 w-full text-lg font-semibold rounded-lg bg-primary-100 text-white hover:bg-primary-200 transition-colors duration-100 cursor-pointer mt-4"
				disabled={resendTimer}
			>
				{otpSent
					? `Resend OTP ${resendTimer ? `(${resendTimer}s)` : ""}`
					: "Send OTP"}
			</button>
		</form>
	);
};

const VerifyOTPForm = ({
	otp,
	setOtp,
	verifyOTP,
	handleBeforeInput,
	otpSent,
}) => {
	return (
		<form className="otp-form" onSubmit={verifyOTP}>
			<input
				value={otp}
				onInput={(e) => setOtp(e.target.value)}
				onBeforeInput={handleBeforeInput}
				type="text"
				className="signup-input p-3 w-full text-md font-semibold rounded-lg outline-0 mb-4 border border-gray-300"
				placeholder="Enter OTP"
				disabled={!otpSent}
				required
			/>
			<button
				type="submit"
				disabled={!otpSent}
				className="sendotp-button p-3 w-full text-lg font-semibold rounded-lg bg-primary-100 text-white hover:bg-primary-200 transition-colors duration-100 cursor-pointer"
			>
				Verify and Join
			</button>
		</form>
	);
};

export default Signup;
