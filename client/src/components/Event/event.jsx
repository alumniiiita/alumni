import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Event = () => {
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    const getData = async () => {
        try{
            const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/event/get/getevent`);
            // console.log("event data = ", data.data);
            let eventData=data.data.reverse();
            setEventData(eventData);
            
        }
        catch(err){
            console.log(err);
        }
    };

    getData();
  }, []);

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
    console.log("data saved from frontend ", data);
    window.location.reload(false);
  };

  const deleteJob = async (e) => {
    e.preventDefault();
    const senddata = {
      userID: userID,
      userRole: userRole,
      eventID: e.target.eventid.value,
    };
    // console.log("id = ",e.target.eventid.value);
    const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/event/deleteevent`, senddata);
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
    <div>
      <div className="row" style={{justifyContent :"center"}} >
        {userRole == "Admin" ? (
          <Link
          className="btn btn-light my-1"
          to="/createEvent"
          style={{ width: "40%" , background: "#79db84" }}
        >
          Create New Event
        </Link>
        ) : null}
      </div>

      <div
        className="row"
        style={{
          overflowY: "scroll",
          display: "flex",
          flexDirection: "wrap",
          alignItems: "baseline",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        
        <div className="col" >
        <h1 style={{textAlign:"center"}}>EVENTS</h1>
        {EventData.map((ele) => {
          return (
            <div className="row" style={{justifyContent:"center"  }}> 
            <Card style={{ width: "65%", margin: "15px", height: "auto" }}>
              <Card.Body>
                
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <Card.Title style={{fontSize:"50px"}}>{ele.title}</Card.Title>
                <Card.Text>
                  created at - {ele.Event_post_date.slice(0, 10)}{" "}
                </Card.Text>
                </div>
                <Card.Text> {ele.Description}</Card.Text>
                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <div className="col" style={{ display: "flex"}}>
                    <Card.Text style={{marginRight:"50px"}}>
                      <Button style={{padding:"8px"}}>
                        <a
                          href={ele.Link}
                          target="_blank"
                          style={{ color: "white" }}
                        >
                          Join Here
                        </a>
                      </Button>
                    </Card.Text>

                    <Card.Text>
                      <form 
                      onSubmit={(e) => deleteJob(e)}
                      >
                        { userRole == "Admin" ? (
                        
                        <Button style={{padding:"8px"}}
                            type="submit"
                            name="eventid"
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
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default Event;
