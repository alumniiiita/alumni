import { Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

const CreateEvent = () => {
  const [event_name, set_event_name] = useState("");
  const [event_description, set_event_description] = useState("");
  const [event_link, set_event_link] = useState("");
  const [loading, setLoading] = useState(false);

  let userData = localStorage.getItem("_user_data");
  userData = JSON.parse(userData);

  const userID = userData._id;
  const userName = userData.name;
  const userRole = userData.role;

  const createEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = {
        username: userName,
        userID: userID,
        event_name: event_name,
        description: event_description,
        link: event_link,
      };

      const data = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/event/create-event`,
        formdata
      );

      console.log("Event created:", data);
      window.location.reload(false);
    } catch (error) {
      console.error("Error creating event:", error);
      setLoading(false);
    }
  };

  return (
    <div className="row" style={{ justifyContent: "center" }}>
      {userRole === "Admin" && (
        <Form
          onSubmit={createEvent}
          style={{
            background: "#e6e6e6",
            padding: "15px",
            borderRadius: "10px",
            marginLeft: "20px",
            marginTop: "15px",
            width: "70%",
          }}
        >
          <h3>Create New Event</h3>

          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              onChange={(e) => set_event_name(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Add description"
              onChange={(e) => set_event_description(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLink">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter link"
              onChange={(e) => set_event_link(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Creating...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default CreateEvent;
