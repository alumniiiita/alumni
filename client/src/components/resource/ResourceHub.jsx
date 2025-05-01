import React, { useEffect, useState } from "react";
import axios from "axios";

const ResourceHub = () => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("General");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchResources = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/resources`,
      filter ? { params: { topic: filter } } : {}
    );
    setResources(res.data);
  };

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("topic", topic);

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/resources/upload`, formData, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
    });
    setTitle("");
    setTopic("General");
    setFile(null);
    fetchResources();
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">📚 Resource Hub</h2>

      <form onSubmit={handleUpload} className="mb-4">
        <input type="text" placeholder="Title" className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <select className="form-control mb-2" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="General">General</option>
          <option value="Placement">Placement</option>
          <option value="Higher Studies">Higher Studies</option>
          <option value="Research">Research</option>
        </select>
        <input type="file" className="form-control mb-2" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>

      <div className="mb-3">
        <label>Filter by Topic:</label>
        <select className="form-control" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Placement">Placement</option>
          <option value="Higher Studies">Higher Studies</option>
          <option value="Research">Research</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="row">
        {resources.map((res) => (
          <div className="col-md-6 mb-3" key={res._id}>
            <div className="card p-3">
              <h5>{res.title}</h5>
              <p><strong>Topic:</strong> {res.topic}</p>
              <p><strong>Uploaded By:</strong> {res.uploadedBy?.name || "Unknown"}</p>
              <a href={res.fileUrl} className="btn btn-outline-primary" target="_blank" rel="noreferrer">View Resource</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceHub;