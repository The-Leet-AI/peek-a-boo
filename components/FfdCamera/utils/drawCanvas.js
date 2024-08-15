import { TRIANGULATION } from "./triangulation";



const drawTriangle = (canvasMat, points) => {
  window.cv.line(
    canvasMat,
    points[0],
    points[1],
    new window.cv.Scalar(0, 0, 0, 255),
    1
  );
  window.cv.line(
    canvasMat,
    points[1],
    points[2],
    new window.cv.Scalar(0, 0, 0, 255),
    1
  );
  window.cv.line(
    canvasMat,
    points[2],
    points[0],
    new window.cv.Scalar(0, 0, 0, 255),
    1
  );
};
