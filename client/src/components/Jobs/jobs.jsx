import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Job = () => {
  const [jobData, setJobData] = useState([]);
  const [ArchiveJobData, setArchiveJobData] = useState([]);
  const [showArchive, setshowArchive] = useState(0);
  let myCurrentDate = new Date();
  // console.log("date = ", myCurrentDate);

  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/job/get/getjob`);
      console.log("d = ", data.data);
      let jobData=data.data.dt.reverse();
      setJobData(jobData);
      setArchiveJobData(data.data.archive);
    };

    getData();
  }, []);

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
    // console.log("data saved from frontend ", data);
    window.location.reload(false);
  };
  const deleteJob = async (e) => {
    e.preventDefault();
    const senddata = {
      userID: userID,
      userRole: userRole,
      jobID: e.target.jobid.value,
    };
    // console.log("id = ",e.target.jobid.value);
    const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/job/deletejob`, senddata);
    console.log(data.data.invalid_msg);
    if (data.data.invalid_msg == "invalid") {
      alert("invalid");
    } else {
      window.location.reload(false);
    }
  };

  const generateLink = (link) => {
    return `/profile/${link}`;
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          className="row"
          style={{
            justifyContent: "center",
            marginRight: "30px",
            backgroundColor: "#f8f9fa",
            borderColor: "#f8f9fa",
          }}
        >
          <Link className="btn  my-1" to="/archiveJobs">
            Archive Jobs
          </Link>
        </div>
        {userRole != "student" ? (
          <div
            className="row"
            style={{
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              borderColor: "#f8f9fa",
            }}
          >
            <Link className="btn  my-1" to="/createjob">
              Create Jobs
            </Link>
          </div>
        ) : null}
      </div>
      <div className="row" style={{ minHeight: "100vh" }}>
        <div
          className="col"
          style={{
            overflowY: "scroll",
            display: "flex",
            flexDirection: "wrap",
            alignItems: "baseline",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          {/* {console.log("jobs = ", jobData)} */}
          {jobData.map((ele) => {
            return (
              <Card style={{ width: "35%", margin: "15px", height: "auto" }}>
                <Card.Body>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Card.Text>
                      <a
                        style={{ fontWeight: "900" }}
                        href={generateLink(ele.userID)}
                        target="_blank"
                      >
                        {ele.created_by_user}
                      </a>
                    </Card.Text>
                    {/* <Card.Text>created at -  {formatDate(ele.Job_post_date)} </Card.Text> */}
                    <Card.Text style={{ fontSize: "10px" }}>
                      created at - {ele.Job_post_date.slice(0, 10)}
                    </Card.Text>
                  </div>

                  <Card.Title>{ele.Job_name}</Card.Title>
                  <Card.Text> {ele.Description}</Card.Text>
                  <Card.Text>
                    Deadline - {ele.Job_deadline.slice(0, 10)}
                  </Card.Text>

                  <div
                    className="row"
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <div className="col">
                      <Card.Text>
                        <Button>
                          <a
                            href={ele.Link}
                            target="_blank"
                            style={{ color: "white" }}
                          >
                            Apply here
                          </a>
                        </Button>
                      </Card.Text>
                    </div>

                    <div className="col">
                      <Card.Text>
                        <form onSubmit={(e) => deleteJob(e)}>
                          {ele.created_by_user == userName ||
                          userRole == "Admin" ? (
                            <Button
                              type="submit"
                              name="jobid"
                              variant="danger"
                              value={ele._id}
                            >
                              Delete
                            </Button>
                          ) : null}
                        </form>
                      </Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Job;
