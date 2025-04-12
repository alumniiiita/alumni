import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Job = () => {


  let userData = localStorage.getItem("_user_data");
  userData = JSON.parse(userData);

  const userID = userData._id;
  const userName = userData.name;
  const userRole = userData.role;

  const [job_name, set_job_name] = useState("");
  const [job_description, set_job_description] = useState("");
  const [job_link, set_job_link] = useState("");
  const [job_deadline, set_job_deadline] = useState("");

  const createJob = async (e) => {
    e.preventDefault();

    const formdata = {
      username: userName,
      userID: userID,
      job_name: job_name,
      description: job_description,
      link: job_link,
      job_deadline: job_deadline,
    };

    const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/job/create-job`, formdata);
    console.log("data saved from frontend ", data);
    window.location.reload(false);
  };


  return (
    <>
    <div>
      <div className="row" style={{justifyContent :"center"}} >
          <Link
          className="btn btn-light my-1"
          to="/jobs"
          style={{ width: "40%" , background: "#79db84" }}
        >
          Go Back
        </Link>
      </div>
    </div>
    <div className="row" style={{ minHeight: "100vh" }}>
        <div className="col-4">
          {userRole != "student" ? (
            <Form
              onSubmit={(e) => {
                createJob(e);
              }}
              style={{
                background: "#e6e6e6",
                padding: "15px",
                borderRadius: "10px",
                marginLeft: "20px",
                marginTop: "15px",
                width: "100%",
              }}
            >
              <h3>Create New Job Post</h3>
              <Form.Group className="mb-3" controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  onChange={(e) => set_job_name(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="textarea"
                  placeholder="add description"
                  onChange={(e) => set_job_description(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicLink">
                <Form.Label>Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="enter link"
                  onChange={(e) => set_job_link(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicLink">
                <Form.Label>deadline</Form.Label>
                <Form.Control required
                  type="date"
                  placeholder="enter Deadline"
                  onChange={(e) => set_job_deadline(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          ) : 
              <h4>Students cannot create Job</h4>
          }

        </div>

    </div>
    </>

  );
};

export default Job;
