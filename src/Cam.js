import React, { useRef } from "react";

const Cam = () => {
  let videoRef = useRef();
  let recordingRef = useRef();
  let downloadLink = useRef();
  let camera_stream = null;
  let media_recorder = null;
  let blobs_recorded = [];

  const startCamera = async () => {
    camera_stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        sampleSize: 16,
        volume: 1,
      },
      video: {
        height: 720,
        width: 1280,
        facingMode: "user",
      },
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
      recordingRef.current.src = video_local;
      downloadLink.current.href = video_local;
    });
    media_recorder.start();
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
        <video
          ref={videoRef}
          width="320"
          height="240"
          playsInline
          autoPlay
          muted
        ></video>
        <video
          ref={recordingRef}
          width="320"
          height="240"
          playsInline
          controls
        ></video>
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
