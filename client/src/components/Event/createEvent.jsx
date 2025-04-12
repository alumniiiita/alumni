import { Button, Form } from "react-bootstrap";
import axios from "axios";
import {  useState } from "react";


const CreateEvent = () => {
  // console.log("create")
  const [EventData, setEventData] = useState([]);

  let userData = localStorage.getItem("_user_data");
  userData = JSON.parse(userData);

  const userID = userData._id;
  const userName = userData.name;
  const userRole = userData.role;


  const [event_name, set_event_name] = useState("");
  const [event_description, set_event_description] = useState("");
  const [event_link, set_event_link] = useState("");

  const createEvent = async (e) => {
    e.preventDefault();

    const formdata = {
      username: userName,
      userID: userID,
      event_name: event_name,
      description: event_description,
      link: event_link,
    };

    const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/event/create-event`, formdata);
    // console.log("data saved from frontend ", data);

    window.location.reload(false);
  };



  return (
    <div className="row" style={{ justifyContent:"center"}}>
      
      {userRole == "Admin" ? (
        <Form
          onSubmit={(e) => {
            createEvent(e);
          }}
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
              placeholder="add description"
              onChange={(e) => set_event_description(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLink">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter link"
              onChange={(e) => set_event_link(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : null}
    </div>
  );
};

export default CreateEvent;
