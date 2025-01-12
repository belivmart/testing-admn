import React from "react";
import "./loader.css";
function Loader() {
  return (
    <div className="main_loader_container" >
      <div>
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg></div>
    </div>
  );
}

export default Loader;
