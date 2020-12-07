// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { nextFrame } from "@tensorflow/tfjs";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import {drawRect} from "./utilities"; 
import c3 from 'c3';
import 'c3/c3.css';
import "./tensorflowboard.png"
import { red } from "color-name";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [accuracy, setAccuracy] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    // https://storage.cloud.google.com/facemaskbucket/model.json'
    // https://storage.cloud.google.com/facemaskvalidator/model.json
    const net = await tf.loadGraphModel('https://storage.cloud.google.com/facemaskvalidator/model.json')
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
      // console.log(obj)

      const boxes = await obj[7].array() 
      // the array id that has size 400 in it and it represent the set of boxes which 
      // represents x,y,width,height coordinates. boxes has values with 4 arrays elements [0.08575773239135742, 0.35986530780792236, 0.9350180625915527, 0.7453494071960449]
      const classes = await obj[4].array() 
      // console.log("classes", classes[0]);
      // We will have 3 arrays in the tenorflow array that has size 100 the array with size 100 and 
      // the 2nd array with 100 represents the type of class  302. Classes has continuos values of 1 or 2.
      const scores = await obj[5].array()
      // We will have 3 arrays in the tenorflow array that has size 100 the array with size 100 and 0(class),1(score),3(score)
      // we need to consider the 3rd array with size 100 which represents the accuracy score
      // scores[0][0] displays accuracy in an Array[100] = [0: 0.9893999695777893, 1: 0.023379910737276077, 2: 0.022201498970389366]
      // console.log(scores[0])
  
      let tempAccuracy = accuracy;
      if(tempAccuracy.length === 100) {
        tempAccuracy = tempAccuracy.slice(0);
      }
      tempAccuracy.push(scores[0][0]);
      setAccuracy(tempAccuracy);
      renderChart(tempAccuracy);
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      requestAnimationFrame(()=>{drawRect(boxes[0], classes[0], scores[0], 0.5, videoWidth, videoHeight, ctx, changeErrorMessage)}); 

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)
    }
  };

  let changeErrorMessage = (msg) => {
    setErrorMessage(msg);
  }

  let renderChart = (dataArray) => {
  var chart = c3.generate({
    bindto: '#accuracy-chart',
    data: {
        columns: [
          ['Accuracy', ...dataArray]
        ]
    }
  });
}
  
  useEffect(()=>{
    runCoco()
    renderChart(accuracy)
  },[]);

  return (
    <div className="App">
      <h1>Face Mask Detection</h1>
      <p style={{color:"red"}}>{errorMessage}</p>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
      <div> <h2>Visualization Dashboard</h2>
      {/* Temporarily displaying image but use canvasjs graphs to plot live visualization of accuracy https://canvasjs.com/react-stockcharts/spline-area-stockchart-range-selector-react/ */}
      {/* <img src={require('./tensorflowboard.png')} /> */}
      <div id="accuracy-chart"></div>
    </div>
    </div>

  );
}

export default App;

