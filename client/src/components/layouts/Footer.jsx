import React from "react";
import { Link } from "react-router-dom";

function Footer() {
	return (
		// <div className="footer-container" style={{width: "100%"}}>
		// 	<div
		// 		className="footer-section"
		// 		style={{
		// 			padding: "2em",
		// 			alignSelf: "center",
		// 			textAlign: "center",
		// 			alignItems:"center"
		// 		}}
		// 	>
		// 		<p className="contact-info-text" style={{"fontSize":"14px"}}>Copyrights @ IIITA Alumni Office</p>
		// 	</div>
		// 	<div
		// 		className="footer-section"
		// 		style={{ padding: "1em", alignSelf: "center" }}
		// 	>
		// 		<h6 className="text-primary">Contact us:</h6>
		// 		<div className="help-section help-location-div">
		// 			<i
		// 				className="fas fa-map-marker-alt location-icon"
		// 				aria-hidden="false"
		// 				style={{"fontSize":"14px"}}
		// 			></i>
		// 			<p className="contact-info contact-info-text" style={{"fontSize":"14px"}}>
		// 				Office of Alumni Affairs Admin Extension-1, IIIT
		// 				Allahabad, Devghat, Jhalwa Prayagraj - 211015 Uttar
		// 				Pradesh, India
		// 			</p>
		// 		</div>
		// 		<div className="help-section help-mail-div">
		// 			<i className="fa fa-envelope mail-icon" style={{"fontSize":"14px"}}></i>
		// 			<div className="contact-info">
		// 				<p className="contact-info-text" style={{"fontSize":"14px"}}>alumni.coordinator@iiita.ac.in</p>
		// 				<p className="contact-info-text" style={{"fontSize":"14px"}}>dean.aa@iiita.ac.in</p>
		// 			</div>
		// 		</div>
		// 		<div className="help-section help-phone-div">
		// 			<i
		// 				className="fa fa-phone phone-icon"
		// 				aria-hidden="true"
		// 				style={{"fontSize":"14px"}}
		// 			></i>
		// 			<p className="contact-info contact-info-text" style={{"fontSize":"14px"}}>(91) 0532 292 2042/2290</p>
		// 		</div>
		// 	</div>
		// </div>
		// style={{position: "absolute", top:"95vh", left: "10%"}}
		<footer className="page-footer font-small teal footer-class">
			<div
				className="container-fluid text-center pt-5 pb-5 text-md-left"
				style={{
					backgroundColor: "#eee",
					borderBottom: "1px solid #c5c5c5",
				}}
			>
				<div className="row">
					<div className="col-md-6 mt-md-0 mt-3">
						<h6
							className="text-uppercase font-weight-bold"
							style={{ textAlign: "center" }}
						>
							Important Links
						</h6>
						<ul>
							<li style={{ textAlign: "center" }}>
								<Link
									to="/add-achievement"
									className="navbar-link"
								>
									<span className="hide-sm">
										Achievements/Awards
									</span>
								</Link>
							</li>
							<li style={{ textAlign: "center" }}>
								<Link to="/help" className="navbar-link">
									<span className="hide-sm">Help</span>
								</Link>
							</li>
							{/* <li>Achievements/Awards</li> */}
						</ul>
					</div>

					<hr className="clearfix w-100 d-md-none pb-3" />

					<div className="col-md-6 mb-md-0 mb-3">
						<h6
							className="text-uppercase font-weight-bold"
							style={{ textAlign: "center" }}
						>
							Contact us:
						</h6>
						{/* <p>
							Lorem ipsum, dolor sit amet consectetur adipisicing
							elit. Optio deserunt fuga perferendis modi earum
							commodi aperiam temporibus quod nulla nesciunt
							aliquid debitis ullam omnis quos ipsam, aspernatur
							id excepturi hic.
						</p> */}
						<div className="help-section help-location-div pt-1 pb-1">
							
							
							<p
								className="contact-info contact-info-text"
								style={{ fontSize: "15px" }}
							>
								Office of Alumni Affairs Admin Extension-1, IIIT
								Allahabad, Devghat, Jhalwa Prayagraj - 211015
								Uttar Pradesh, India
							</p>
						</div>
						<div className="help-section help-mail-div pt-1 pb-1">
							<i
								className="fa fa-envelope mail-icon"
								style={{ fontSize: "15px" }}
							></i>
							<div className="contact-info">
								<p
									className="contact-info-text"
									style={{ fontSize: "15px" }}
								>
									alumni.coordinator@iiita.ac.in
								</p>
								<p
									className="contact-info-text"
									style={{ fontSize: "15px" }}
								>
									alumni.connect@iiita.ac.in
								</p>
							</div>
						</div>
						<div className="help-section help-phone-div pt-1 pb-1 mt-2">
							<i
								className="fa fa-phone phone-icon mt-3"
								aria-hidden="true"
								style={{ fontSize: "15px" }}
							></i>
							<div className="contact-info">
								<p
									className="contact-info contact-info-text"
									style={{ fontSize: "15px" }}
								>
									(91) 0532 292 2599/2308
								</p>
								<p
									className="contact-info contact-info-text"
									style={{ fontSize: "15px" }}
								>
									(91) 7317319062
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="footer-copyright text-center py-3">
				© 2022 Copyright:
				<a
					href="https://www.linkedin.com/in/iiita-alumni-affairs/"
					target="_blank"
					rel="noreferrer"
				>
					{" "}
					IIITA Alumni Affairs
				</a>
			</div>
		</footer>
	);
}

export default Footer;
