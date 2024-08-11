import React, { useState, useRef, useEffect } from "react";
import { Button, Select, Layout } from "antd";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./utils/detector";

const { Option } = Select;
const { Content } = Layout;

export const inputResolution = {
  width: 640,
  height: 480,
};

const FfdCamera = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isStartCamButtonLoading, setIsStartCamButtonLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const frameCount = useRef(0);
  const [frameRate, setFrameRate] = useState(0);
  const detecterRunningFlag = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameRate(frameCount.current);
      frameCount.current = 0;
    }, 1000);

    // Clear the timer
    return () => clearInterval(interval);
  }, []);

  const handleEachDetectCallback = (result) => {
    frameCount.current += 1;
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    videoRef.current = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    detecterRunningFlag.current = true;
    runDetector(
      videoRef.current,
      canvasRef.current,
      detecterRunningFlag,
      handleEachDetectCallback
    );

    setLoaded(true);
    setIsStartCamButtonLoading(false);
  };

  // Get the list of available video devices
  const getVideoDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    setDevices(videoDevices);
  };

  // Switch camera device
  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId);
  };

  // Start the camera
  const startCamera = async () => {
    setIsStartCamButtonLoading(true);
    if (!loaded) {
      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (detecterRunningFlag.current) {
      stopDetector();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setSelectedDevice(null);
      setLoaded(false);
    }
  };

  const stopDetector = () => {
    detecterRunningFlag.current = false;
  };

  // Get the list of video devices
  React.useEffect(() => {
    getVideoDevices();
  }, []);

  return (
    <Content
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Select
        placeholder="Select Camera"
        style={{ width: "150px", marginBottom: 16 }}
        onChange={handleDeviceChange}
      >
        {devices.map((device) => (
          <Option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </Option>
        ))}
      </Select>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <Button onClick={startCamera} loading={isStartCamButtonLoading}>
          Start Camera
        </Button>
        <Button onClick={stopCamera} style={{ marginLeft: 8 }}>
          Stop Camera
        </Button>
      </div>
      <div
        style={{
          height: String(inputResolution.height) + "px",
          width: String(inputResolution.width) + "px",
          margin: "10px",
          position: "relative",
        }}
      >
        {stream && (
          <Webcam
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              left: "0",
              right: "0",
            }}
            // style={{
            //   position: "absolute",
            //   top: "0",
            //   bottom: "0",
            //   left: "0",
            //   right: "0",
            // }}
            width={Math.floor(inputResolution.width)}
            height={Math.floor(inputResolution.height)}
            videoConstraints={{
              deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
            }}
            onLoadedData={handleVideoLoad}
          />
        )}
        <div style={{ fontFamily: "consolas" }}>
          {String(frameRate) + " FPS"}
        </div>
        <canvas
          id="faceMesh"
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            borderRadius: "5px",
            boxShadow: "2px 2px 5px #888888",
          }}
          ref={canvasRef}
          width={inputResolution.width}
          height={inputResolution.height}
        />
      </div>
    </Content>
  );
};

export default FfdCamera;
