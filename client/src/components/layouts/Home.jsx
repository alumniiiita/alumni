import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { closeSideNav } from "../../actions/alert";

const Home = ({ closeSideNav, isAuth}) => {
	useEffect(() => {
		closeSideNav();
	},[]);
	if (isAuth) {
		return <Redirect to="/feed/topic/Placements?search=" />;
	}
	return (
		<section className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1 className="x-large">AlumniConnect</h1>
					<p className="lead lead-1">
						Create a profile, share and interact
					</p>
					<p className="lead lead-2">
						with your Alumni Network
					</p>

					<div className="auth-buttons">
						<Link
							to="/register"
							className="btn btn-primary"
							style={{ marginRight: "0.5em" }}
						>
							Sign Up
						</Link>
						<Link
							to="/login"
							style={{ marginLeft: "0.5em" }}
							className="btn btn-light"
						>
							Log In
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

Home.propTypes = {
	isAuth: PropTypes.bool,
	closeSideNav:  PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isAuth: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {closeSideNav})(Home);
