import React from "react";
import "./aboutSection.css";
import {AiFillGithub} from "react-icons/ai"

const About = () => {
 
  return (
    <div className="aboutSection">
      
        <div className="aboutContainer" >
        <h1>About Us</h1>
          <div className="aboutContent">

            <div  >
             <p> This Project was created  to integrate a normal ecommerce platform with real-time auctions for watches.</p>
            </div>
<div >


      <a  href="https://github.com/sagr612">
        <AiFillGithub/> 
      </a>
</div>
          </div>
        </div>

      
    </div>
  );
};

export default About;
