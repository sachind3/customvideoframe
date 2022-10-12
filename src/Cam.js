import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";

const Cam = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const constraints = useMemo(() => {
    return {
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
    };
  }, []);
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);
  return (
    <>
      <div className="w-[320px] mx-auto relative">
        <Webcam audio={true} ref={webcamRef} videoConstraints={constraints} />
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2 bg-black/80 flex items-center justify-center gap-3">
        {capturing ? (
          <button onClick={handleStopCaptureClick} className="btn">
            Stop Capture
          </button>
        ) : (
          <button onClick={handleStartCaptureClick} className="btn">
            Start Capture
          </button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload} className="btn">
            Download
          </button>
        )}
      </div>
    </>
  );
};

export default Cam;
