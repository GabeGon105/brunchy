import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { API_BASE } from "../constants";

export default function Logout() {
	const { setUser } = useOutletContext();
	const navigate = useNavigate();

	useEffect(() => {
		fetch(API_BASE + "/logout", { credentials: "include" })
			.then(() => {
				setUser(null);
				navigate("/");
			});
	}, [setUser, navigate]);

	return <main className="container">
		<div className="row justify-content-around mt-5">
			<p>Logging out...</p>
		</div>
	</main>
}