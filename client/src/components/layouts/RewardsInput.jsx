import React, { useState } from "react";

const RewardsInput = () => {
	const [rewards, setRewards] = useState(`Title of Award:

Type of Award:

Name of Awarding Organisation:

Received Jointly / Solo:

Cash Prize Received:`);

	const onChange = (e) => {
		setRewards(e.target.value);
	};

	return (
		<textarea
			className="form-group"
			name="rewards"
			id="rewards"
			rows="12"
			required
			value={rewards}
			onChange={onChange}
		/>
	);
};

export default RewardsInput;
