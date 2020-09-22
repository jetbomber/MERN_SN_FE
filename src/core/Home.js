import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2>Social Network</h2>
      <p className="lead">Built on the MERN Stack</p>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>
);

export default Home;
