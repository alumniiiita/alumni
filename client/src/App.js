import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/layouts/Home";
import Navbar from "./components/layouts/Navbar.jsx";
import { loadUser } from "./actions/auth";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import Routes from "./components/routing/Routes";
import Footer from "./components/layouts/Footer";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<React.Fragment>
					<Navbar />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route component={Routes} />
					</Switch>
					<Footer/>
				</React.Fragment>
				
			</Router>
		</Provider>
	);
};

export default App;
