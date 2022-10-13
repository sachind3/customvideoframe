import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

function LiveStreamPreview({ stream }) {
  let videoPreviewRef = React.useRef();

  React.useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    console.log("No stream available");
    return null;
  }

  return <video ref={videoPreviewRef} width={520} height={480} autoPlay />;
}

const Cam = () => {
  const onRecordStop = (blobURL, blob) => {
    console.log({ blob });
    var fileOfBlob = new File([blob], `Recorded-${Math.random() * 10}-version`);
    console.log({ fileOfBlob });
    //startRecording();
  };

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    //clearBlobUrl,
    previewStream,
  } = useReactMediaRecorder({
    onStop: onRecordStop,
    video: true,
    askPermissionOnMount: true,
    blobOptions: { type: "video/webm" },
    mediaStreamConstraints: { audio: true, video: true },
  });

  console.log({ previewStream });

  const stopCurrentRecording = () => {
    stopRecording();
  };
  return (
    <div>
      <h5>Status: {status}</h5>
      <div>
        <button onClick={startRecording} disabled={status === "recording"}>
          Start Recording
        </button>
        <button
          onClick={stopCurrentRecording}
          disabled={status !== "recording"}
        >
          Stop Recording
        </button>
      </div>
      <h3>Live:</h3>
      <div>{previewStream && <LiveStreamPreview stream={previewStream} />}</div>
      <h3>Recorded:</h3>
      <div>
        {mediaBlobUrl && <video src={mediaBlobUrl} controls autoPlay loop />}
      </div>
    </div>
  );
};

export default Cam;
