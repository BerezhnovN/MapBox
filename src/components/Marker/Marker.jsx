import React, { useState } from "react";
import Cancel from "../../images/cancel.svg";
import Done from "../../images/done.svg";
import "./style.css";

const Marker = ({ setFlag, lng, lat, setMarkers, markers }) => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const makeDescription = () => {
    setMarkers([
      ...markers,
      {
        latitude: lat,
        longitude: lng,
        title: title,
        description: description,
      },
    ]);
    setFlag(false);
  };

  return (
    <div className="marker">
      <input type="text" onChange={(e) => setTitle(e.target.value)} />
      <input type="text" onChange={(e) => setDescription(e.target.value)} />
      <div className="marker-img">
        <img src={Done} alt="Done" onClick={() => makeDescription()} />
        <img src={Cancel} alt="Cancel" onClick={() => setFlag(false)} />
      </div>
    </div>
  );
};

export default Marker;
