import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UserCardModal = ({ profile }) => {
	return (
		<div
			className="profile-card bg-light grid-item"
			style={{ maxWidth: "540px" }}
		>
			<div style={{ width: "100%", maxWidth: "540px" }}>
				<div className="card profile-header">
					<div className="body">
						<div className="row">
							<div
								className="col-lg-4 col-md-4 col-12"
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								<div className="profile-image float-md-right">
									<img
										src={profile.avatar}
										alt="avatar"
										style={{
											width: "70px",
											height: "70px",
                                            borderRadius:"50%"
										}}
									/>
								</div>
								{profile.isAdmin && (
									<span
										className="profile-tag"
										style={{ textTransform: "capitalize" }}
									>
										{profile.adminType === "head"
											? "Head"
											: profile.role}{" "}
										{"Admin"}
									</span>
								)}
							</div>
							<div className="col-lg-8 col-md-8 col-12">
								<h4 className="m-t-0 m-b-0">
									<Link to={`/profile/${profile._id}`}>
										<strong>{profile.name}</strong>
									</Link>
								</h4>

								{profile.role === "alumni" && (
									<span
										style={{
											textTransform: "capitalize",
										}}
									>
										{profile.designation}
										{" @ "}
										{profile.organisation}
									</span>
								)}

								{profile.role === "student" &&
									"Student @ IIITA"}

								{profile.role === "faculty" && (
									<React.Fragment>
										<p
											style={{
												textTransform: "capitalize",
												marginBottom: "0",
												marginTop: "0",
											}}
										>
											{profile.designation}
										</p>

										<p>
											{"Department of"}
											<span
												style={{
													textTransform: "uppercase",
												}}
											>
												{profile.department}
											</span>
										</p>
									</React.Fragment>
								)}

								{profile.role === "student" && (
									<p>
										{profile.starting_year}-
										{profile.passing_year}
									</p>
								)}

								{profile.role === "alumni" && (
									<div>
										<p style={{ marginBottom: "0" }}>
											{profile.location}
										</p>
										{/* <br/> */}
										<p>
											{"Alumni @ IIITA"}
											{" ( "}
											{profile.passing_year}
											{" Passout )"}
										</p>
									</div>
								)}

								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

UserCardModal.propTypes = {
	profile: PropTypes.object.isRequired
};

export default UserCardModal;
