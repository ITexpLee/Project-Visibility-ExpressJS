// Playing deafult Audio when window is loaded
window.addEventListener("load", () => {
  //get audio by id
  const initial = document.querySelector("#initial-audio");
  initial.play();
  //Start Recording after the audio stops
  initial.addEventListener("ended", startRecording);
});

//function defined for error or success callback
function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
  navigator.mediaDevices
    .getUserMedia(mediaConstraints)
    .then(successCallback)
    .catch(errorCallback);
}

//Defining mediaConstraint to record audio
let mediaConstraints = {
  audio: true,
};

const startRecording = async () => {
  // Start Capturing Audio
  await audioRecorder();
};

const audioRecorder = () => {
  // When recording audio successfully
  const onMediaSuccess = (stream) => {
    // Creating Audio for recorded sound
    let audio = document.createElement("audio");
    // Audio tag must be muted
    audio = mergeProps(audio, {
      muted: true,
    });
    // Adding src as url and stream
    audio.srcObject = stream;
    audio.play();
    //Append audio tag to page
    audiosContainer.appendChild(audio);
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    // Defining Recorder type and audio format
    mediaRecorder.recorderType = StereoAudioRecorder;
    // don't force any mimeType; use above "recorderType" instead.
    mediaRecorder.mimeType = "audio/wav"; // audio/ogg or audio/wav or audio/webm
    mediaRecorder.ondataavailable = async function (blob) {
      var a = document.createElement("a");
      a.target = "_blank";
      a.innerHTML =
        "Open Recorded Audio No. " +
        index++ +
        " (Size: " +
        bytesToSize(blob.size) +
        ") Time Length: " +
        getTimeLength(5000);
      a.href = URL.createObjectURL(blob);
      //   audiosContainer.appendChild(a);
      //   Convert Blob into string
      //   var text = await blob.text();
      //   console.log(text);
    };
    // get blob after specific time interval
    mediaRecorder.start(5000);
    console.log("started");
  };
  // On Error we will get it here
  const onMediaError = (e) => {
    console.error("media error", e);
  };
  captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
  let mediaRecorder;

  //Record audio for 5000ms and then save it in server
  setTimeout(() => {
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
    // Submit auto form
    let autoFormSubmit = document.querySelector("#express");
    autoFormSubmit.submit();
    // mediaRecorder.save();
    // Ajax call to express on success of saving the data
    // $.ajax({
    //   type: "post",
    //   url: "/",
    //   data: { audio: "success" },
    // }).done(function (data) {
    //   console.log(data);
    // });
  }, 1000);
};

let audiosContainer = document.getElementById("audios-container");
let index = 1;

function bytesToSize(bytes) {
  let k = 1000;
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

function getTimeLength(milliseconds) {
  let data = new Date(milliseconds);
  return (
    data.getUTCHours() +
    " hours, " +
    data.getUTCMinutes() +
    " minutes and " +
    data.getUTCSeconds() +
    " second(s)"
  );
}
