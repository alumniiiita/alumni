import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Alert = ({ alerts: {alerts}}) => {
	if (alerts !== null && alerts.length > 0) {
		const Alerts = alerts.map((alert) => (
			<div key={alert.id} className={`alert alert-${alert.alertType}`}>
				{alert.msg}
			</div>
		));
		return <div className="alerts-container">{Alerts}</div>;
	} else return <div className="alerts-container"></div>;
};

Alert.propTypes = {
	alerts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
