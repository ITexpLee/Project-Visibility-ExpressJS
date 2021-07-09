// Fetching audio file and playing it with audio controls.
const player = document.querySelector("#player");

const handleSuccess = async function (stream) {
  if (window.URL) {
    player.srcObject = stream;
  } else {
    player.src = stream;
  }
};

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: false,
  })
  .then(handleSuccess);
