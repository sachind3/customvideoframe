import React, { useRef } from "react";

const Cam = () => {
  let videoRef = useRef();
  let downloadLink = useRef();
  let camera_stream = null;
  let media_recorder = null;
  let blobs_recorded = [];

  const startCamera = async () => {
    camera_stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = camera_stream;
  };

  const startRecording = () => {
    media_recorder = new MediaRecorder(camera_stream, {
      mimeType: "video/webm",
    });
    media_recorder.addEventListener("dataavailable", function (e) {
      blobs_recorded.push(e.data);
    });
    media_recorder.addEventListener("stop", function () {
      let video_local = URL.createObjectURL(
        new Blob(blobs_recorded, { type: "video/webm" })
      );
      downloadLink.current.href = video_local;
    });
    media_recorder.start(1000);
  };

  const stopRecording = () => {
    media_recorder.stop();
  };
  return (
    <div className="w-[320px] mx-auto">
      <div className="flex flex-col gap-2">
        <button onClick={startCamera} className="btn">
          Start Camera
        </button>
        <video ref={videoRef} width="320" height="240" autoPlay></video>
        <div className="flex flex-wrap gap-2">
          <button onClick={startRecording} className="btn">
            Start Recording
          </button>
          <button onClick={stopRecording} className="btn">
            Stop Recording
          </button>
          <a
            ref={downloadLink}
            href="test.webm"
            download="test.webm"
            className="btn"
          >
            Download Video
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cam;
