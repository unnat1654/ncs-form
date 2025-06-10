import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../authContext";
import Navbar from "../component/Navbar";
import Lottie from "lottie-react";
import robotAnimation from "../assets/robot-chat.json";
import robot2 from "../assets/chat_robot.svg";
import userIcon from "../assets/user_icon.svg";
import { IoSend } from "react-icons/io5";

const useStateWithCallback = (initialState) => {
	const [state, setState] = useState(initialState);
	const callbackRef = useRef(null);

	const setStateWithCallback = (newState, callback) => {
		callbackRef.current = callback;
		setState(newState);
	};

	useEffect(() => {
		if (callbackRef.current) {
			callbackRef.current(state);
			callbackRef.current = null;
		}
	}, [state]);

	return [state, setStateWithCallback];
};

const ChatBot = () => {
	const { id } = useParams();
	const [auth, setAuth] = useAuth();
	const [formData, setFormData] = useState({});
	const inputRef = useRef(null);
	//formData:{_id:String,name:string,description:string,questions:[{_id:string,type:string,description:string,options:[String],nextQuestions:[String]}]}
	const [currentQuestion, setCurrentQuestion] = useState({});
	const [showOptions, setShowOptions] = useState(false);
	const [nextQuestionId, setNextQuestionId] = useState("");
	const [messages, setMessages] = useState([
		{ message: "how was your day. i hope youre doing well", isQuestion: true },
	]);
	const [prompt, setPrompt] = useState("");
	const [doc, setDoc] = useState("");
	const [fileName, setFileName] = useState("");
	const [qa, setQa] = useStateWithCallback({});
	const navigate = useNavigate();
	const location = useLocation();
	const chatContainerRef = useRef(null);
	const scrollBottomRef = useRef(null);

	// auto scroll the chat to bottom...
	useEffect(() => {
		if (scrollBottomRef.current) {
			scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const fetchForm = async () => {
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER}/emily/get-form/${id}`
			);
			if (data && data.success) {
				setFormData(data.form);
				setCurrentQuestion(() => {
					let newCurrQues = data.form.questions[0];
					addMessage(newCurrQues.description, true);
					chatContainerRef.current.scrollTop =
						chatContainerRef.current.scrollHeight;
					let count = 1;
					while (newCurrQues.type === "message") {
						newCurrQues = data.form.questions.find(
							(question) => question._id === newCurrQues.nextQuestions[0]
						);
						setTimeout(() => {
							addMessage(newCurrQues.description, true);
							chatContainerRef.current.scrollTop =
								chatContainerRef.current.scrollHeight;
						}, 1000 * count++);
					}
					if (newCurrQues.type !== "multi-choice") {
						setNextQuestionId(newCurrQues.nextQuestions[0]);
					} else {
						setTimeout(() => {
							setShowOptions(true);
						}, 2000);
					}
					return newCurrQues;
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (!localStorage.getItem("form-auth"))
			if (!auth?.token)
				// navigate(`/login?redirect=${location.pathname}`);
				return;
		fetchForm();
		const img = new Image();
		img.src = userIcon;
	}, [auth?.token]);

	const handleDoc = (e) => {
		const file = e.target.files[0];
		if (file) {
			console.log(file);
			if (file.size > 2000000) {
				e.preventDefault();
				toast.error("Image size too large");
				return;
			}
			setFileName(file.name);
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setDoc(reader.result);
			};
		}
	};

	const moveToNextQuestion = () => {
		if (
			(!prompt && !doc) ||
			(prompt && doc) ||
			prompt.startsWith("SZwgRYmUydiqLph6J7A6Adbck0fis3fy") ||
			(currentQuestion.type == "multi-choice" &&
				!currentQuestion.options.includes(prompt))
		)
			return;

		if (prompt) addMessage(prompt, false);
		if (doc) addMessage(`📁${fileName}`, false);
		setPrompt("");
		setDoc("");
		setFileName("");
		setShowOptions(false);
		setQa((prev) => {
			const newQa = { ...prev };
			if (doc)
				newQa[
					currentQuestion.description
				] = `SZwgRYmUydiqLph6J7A6Adbck0fis3fy${doc}`;
			else newQa[currentQuestion.description] = prompt;

			if (!nextQuestionId) {
				submitResponse(newQa, 1000);
				return;
			}
			let newCurrQues = formData.questions.find(
				(question) => question._id === nextQuestionId
			);
			let count = 1;
			while (newCurrQues.type === "message") {
				const messageText = newCurrQues.description;

				setTimeout(() => {
					addMessage(messageText, true);
					chatContainerRef.current.scrollTop =
						chatContainerRef.current.scrollHeight;
				}, 1500 * count++);
				if (!newCurrQues.nextQuestions[0]) {
					submitResponse(newQa, 1000 * (count + 1));
					setNextQuestionId("");
					setCurrentQuestion({});
					return;
				}
				newCurrQues = formData.questions.find(
					(question) => question._id === newCurrQues.nextQuestions[0]
				);
			}
			setTimeout(() => {
				addMessage(newCurrQues.description, true);
				chatContainerRef.current.scrollTop =
					chatContainerRef.current.scrollHeight;
			}, 1500 * count++);

			if (newCurrQues.type !== "multi-choice") {
				setNextQuestionId(newCurrQues.nextQuestions[0]);
			} else {
				setTimeout(() => {
					setShowOptions(true);
				}, 1500 * count);
			}

			setCurrentQuestion(newCurrQues);
			return newQa;
		});
	};

	// useEffect(() => {
	//   else setShowOptions(false);
	// }, [currentQuestion]);

	//add messages to chat(both questions and answers) using this function
	const addMessage = (message, isQuestion) => {
		if (!message) return;
		setMessages((prev) => [...prev, { message, isQuestion }]);
	};

	const submitResponse = async (quesAns, time) => {
		try {
			const { data } = await axios.patch(
				`${import.meta.env.VITE_SERVER}/emily/submit-response`,
				{
					formId: id,
					userResponse: quesAns,
				}
			);
			if (data?.success) {
				setTimeout(() => {
					toast.success(data?.message);
				}, time);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	// Handle Enter key press
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			moveToNextQuestion();
		}
	};
	return (
		<div className="chatbot">
			<ToastContainer />
			<Navbar />
			<div
				className="chat-container flex md:flex-row md:justify-between md:h-[calc(100vh-4rem)]
		flex-col"
				ref={chatContainerRef}
			>
				<div className="bot-intro hidden md:w-1/2 w-full md:h-full h-[calc(100vh-4rem)] p-8 bg-[#f9f9f9] md:flex flex-col items-center justify-center">
					<Lottie
						animationData={robotAnimation}
						loop={true}
						style={{ width: "50%", height: "50%" }}
						className="bot-avatar"
					/>
					<h2 className="bot-intro-name">{formData.name}</h2>
					<p className="bot-intro-greeting">Emily presents to you,</p>
					<p className="bot-intro-description">{formData.description}</p>
				</div>

				<div className="chat-box md:w-1/2 w-full h-[calc(100vh-4rem)]">
					<div
						className="display h-[calc(100vh-4rem-3rem)] overflow-auto py-4"
						ref={chatContainerRef}
					>
						<div className="bot-intro md:hidden md:w-1/2 w-full h-fit p-8 pt-0 bg-transparent flex flex-col items-center justify-center">
							<Lottie
								animationData={robotAnimation}
								loop={true}
								style={{ width: "50%", height: "50%" }}
								className="bot-avatar"
							/>
							<h2 className="bot-intro-name">{formData.name}</h2>
							<p className="bot-intro-greeting">Emily presents to you,</p>
							<p className="bot-intro-description">{formData.description}</p>
						</div>

						{messages.map(({ message, isQuestion }, index) => (
							<div
								key={index}
								className={`message-wrapper flex items-center mx-1 mt-2 ${
									isQuestion ? "justify-start" : "justify-end"
								}`}
							>
								{isQuestion && (
									<img
										src={robot2}
										alt="Bot Avatar"
										className="inline-bot-avatar w-10 h-10 mt-auto mr-2"
									/>
								)}
								<div
									className={`message px-4 py-2 mb-4 break-words rounded-tl-lg rounded-tr-lg text-md text-[#333] max-w-[60%] ${
										isQuestion
											? "bg-gray-200 self-start rounded-br-lg"
											: "bg-[#d1e7dd] self-end rounded-bl-lg"
									}`}
								>
									{isQuestion
										? message.split(" ").map((word, index) => (
												<span
													key={index}
													className="word"
													style={{ animationDelay: `${index * 0.2}s` }}
												>
													{word}&nbsp;
												</span>
										  ))
										: message}
								</div>

								{!isQuestion && (
									<img
										src={userIcon}
										alt="user-icon"
										className="inline-user-avatar inline-bot-avatar w-10 h-10 mt-auto mr-2"
									/>
								)}
							</div>
						))}
						<ul className="options">
							{currentQuestion?.type === "multi-choice" &&
								showOptions &&
								currentQuestion.options.map((option, index) => (
									<li
										className="option"
										key={`${currentQuestion._id}.${index}`}
										onClick={() => {
											setNextQuestionId(currentQuestion.nextQuestions[index]);
											setPrompt(option);
										}}
									>
										{option}
									</li>
								))}
						</ul>
						<div ref={scrollBottomRef}></div>
					</div>

					<div
						onClick={(e) => {
							if (e.target.tagName !== "BUTTON") {
								inputRef?.current?.focus();
							}
						}}
						className="input-box w-full max-h-[3rem] flex items-center justify-between bg-[#ecfdff] p-4 rounded-md"
					>
						{currentQuestion?.type !== "file" ? (
							<input
								placeholder="Type your message"
								value={prompt}
								ref={inputRef}
								onChange={(e) => setPrompt(e.target.value)}
								type="text"
								className="prompt h-[3rem] w-[calc(100%-24px)] p-4 outline-0"
								onKeyDown={handleKeyDown}
								// temporarily disabled
								// disabled={
								// 	!currentQuestion.type ||
								// 	currentQuestion.type !== "text-response"
								// }
							/>
						) : (
							<>
								<label htmlFor="upload-file" className="file-prompt">
									{fileName ? fileName : "Upload Image"}
								</label>
								<input
									type="file"
									id="upload-file"
									onChange={handleDoc}
									onKeyDown={handleKeyDown}
									name="file-input"
									accept="image/*"
									hidden
								/>
							</>
						)}
						<button
							onClick={moveToNextQuestion}
							className="send-btn cursor-pointer"
						>
							<IoSend className="arrow hover:text-primary-100 w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBot;
