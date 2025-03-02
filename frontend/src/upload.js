import React from "react";
import "./Upload.css"
import useWindowSize from "./useWindowSize";
const Upload =()=>{
    const { width }=useWindowSize();

    return(
        <div className="container_upload">
    <div className="box button1">
        <div>Upload PDF Document</div>
        <div className="play-btn"></div>
        
    </div>

    <div className="box button2">
        <div>Aptitude</div>
        <div className="play-btn"></div>
        
    </div>
</div>

    
    );

} 
export default Upload;