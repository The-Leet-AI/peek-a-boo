import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawCanvas } from "./drawCanvas";

export const runDetector = async (
  video,
  canvas,
  runningFlag,
  eachDetectCallback = (result) => {}
) => {
  console.log("Initializing detector...");  // Debugging: Confirm the function is called

  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
    detectorModelUrl: "models/face-detect-short/model.json",
    landmarkModelUrl: "models/face-mesh/model.json",
  };

  try {
    const detector = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );

    console.log("Detector created successfully");  // Debugging: Confirm detector creation

    const detect = async (net) => {
      const estimationConfig = { flipHorizontal: false };
      if (runningFlag.current) {
        try {
          const faces = await net.estimateFaces(video, estimationConfig);
          console.log("Faces detected:", faces);  // Debugging: Check what faces are detected

          if (faces.length > 0) {
            requestAnimationFrame(() => drawCanvas(faces[0], canvas));
            eachDetectCallback(faces[0]);
          } else {
            console.log("No faces detected");  // Debugging: When no faces are detected
          }
          
          detect(detector);  // Continue detecting
        } catch (error) {
          console.error("Error during face detection:", error);  // Debugging: Handle detection errors
        }
      }
    };
    
    detect(detector);

  } catch (error) {
    console.error("Error creating detector:", error);  // Debugging: Handle errors during detector creation
  }
};
