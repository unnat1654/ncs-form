// components/Navbar.jsx
import { useState, useEffect } from "react";
import logo from "../assets/NCS_Logo.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(true);
	const [auth, setAuth] = useAuth();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setMenuOpen(false);
			} else {
				setMenuOpen(true);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="navbar flex w-full justify-between items-center p-4 px-8 h-[4rem] bg-white shadow-md z-1000">
			{/* NCS Logo */}
			<div className="navbar-left flex items-center w-fit">
				<img src={logo} alt="NCS Logo" className="logo" />
			</div>

			{/* Navbar Links */}
			<div className="navbar-right flex items-center w-full justify-end">
				<Hamburger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

				<div
					className={`navbar-links ${
						menuOpen ? "max-h-[500px] py-4" : "max-h-0 p-0"
					} 
					transition-all duration-500 overflow-hidden 
					font-bold md:relative flex md:flex-row md:top-0 md:bg-transparent md:items-center md:justify-between md:w-3/4 md:max-w-[400px] md:shadow-none
					absolute top-16 left-0 flex-col w-full bg-white items-center gap-4 shadow-md z-10001`}
				>
					<Link
						to="https://hackncs.in"
						className="navbar-link hover:text-primary-100"
					>
						Home
					</Link>
					<Link
						to="https://hackncs.in/projects"
						className="navbar-link hover:text-primary-100"
					>
						Projects
					</Link>
					<Link
						to="https://hackncs.in/team"
						className="navbar-link hover:text-primary-100"
					>
						Team
					</Link>
					<Link to="/login" className="navbar-link hover:text-primary-100">
						Login
					</Link>
					<Link to="https://hackncs.in/#connect">
						<button className="connect-btn px-4 py-2 rounded-full bg-primary-200 hover:bg-primary-300 cursor-pointer text-white">
							Connect
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

const Hamburger = ({ menuOpen, setMenuOpen }) => {
	return (
		<div
			className="relative md:hidden w-8 h-6 flex items-center justify-center cursor-pointer"
			onClick={() => setMenuOpen((prev) => !prev)}
		>
			<div
				className={`absolute w-full h-1 bg-black rounded transition-all duration-300 ${
					menuOpen ? "rotate-45" : "-translate-y-2"
				}`}
			/>
			<div
				className={`absolute w-full h-1 bg-black rounded transition-all duration-300 ${
					menuOpen ? "opacity-0" : ""
				}`}
			/>
			<div
				className={`absolute w-full h-1 bg-black rounded transition-all duration-300 ${
					menuOpen ? "-rotate-45" : "translate-y-2"
				}`}
			/>
		</div>
	);
};

export default Navbar;
