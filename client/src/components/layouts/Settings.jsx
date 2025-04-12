import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box } from "@mui/material";
import { connect } from "react-redux";
import {
	setRequirePostApproval,
	getRequirePostApproval,
} from "../../actions/post";
import { createChannel } from "../../actions/channel";

const Settings = ({
	setRequirePostApproval,
	getRequirePostApproval,
	createChannel,
	post: {
		settings: { requireApproval },
	},
}) => {
	const [postApproval, setPostApproval] = useState(requireApproval);

	const [open, setOpen] = useState(false);
	const [new_channel_name, setChannelName] = useState("");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 500,
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
	};

	useEffect(() => {
		async function getData() {
			await getRequirePostApproval();
			setPostApproval(requireApproval);
		}
		getData();
	}, []);

	useEffect(() => {
		setPostApproval(requireApproval);
	}, [requireApproval]);

	const onChange = async (e) => {
		await setRequirePostApproval(!postApproval);
		setPostApproval(!postApproval);
	};

	const handleNewChannelSubmit = () => {
		createChannel(new_channel_name);
		setChannelName("");
		handleClose();
	};

	return (
		<div className="request-list-admin-dash float-child">
			<div className="settings-types">
				<h6 style={{ marginTop: "2em", marginLeft: "0.5em" }}>
					Post Settings
				</h6>
				<div className="join-request-card">
					Require Approval for Posting
					<div className="custom-control custom-switch">
						<input
							type="checkbox"
							className="custom-control-input"
							id="customSwitches"
							onChange={(e) => onChange(e)}
							checked={postApproval}
						/>
						{postApproval && (
							<label
								className="custom-control-label"
								htmlFor="customSwitches"
							>
								ON
							</label>
						)}

						{!postApproval && (
							<label
								className="custom-control-label"
								htmlFor="customSwitches"
							>
								OFF
							</label>
						)}
					</div>
				</div>
				<div className="join-request-card">
					Create a new Channel
					<button
						className="btn btn-light btn-sm"
						style={{ padding: "0.2em 1em" }}
						onClick={handleOpen}
					>
						Create
					</button>
				</div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<label>Enter New Channel Name</label>
						<input
							type="text"
							name="new_channel_name"
							value={new_channel_name}
							id="new_channel_name"
							onChange={(e) => setChannelName(e.target.value)}
							style={{ marginBottom: "0.5em" }}
						/>
						<button
							className="btn btn-secondary"
							style={{ width: "100%", marginTop: "0.5em" }}
							onClick={() => handleNewChannelSubmit()}
						>
							Submit
						</button>
					</Box>
				</Modal>
			</div>
		</div>
	);
};

Settings.propTypes = {
	setRequirePostApproval: PropTypes.func.isRequired,
	getRequirePostApproval: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	createChannel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, {
	setRequirePostApproval,
	getRequirePostApproval,
	createChannel,
})(Settings);
