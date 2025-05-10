const checkbox = document.getElementById('camera-toggle');
const video = document.getElementById('camera-feed');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const snapBtn = document.getElementById('snap');
const downloadLink = document.getElementById('download');
const startCamBtn = document.getElementById('startCam');
const stopCamBtn = document.getElementById('stopCam');
const switchCamBtn = document.getElementById('switchCam');
const frameSelect = document.getElementById('frameSelect');
const liveFrame = document.getElementById('liveFrame');

let stream = null;
let overlay = new Image();
overlay.src = frameSelect.value;
let usingFrontCamera = true;
let currentDeviceId = null;

/* camera on*/
checkbox.addEventListener('change', async () => {
if (checkbox.checked) {
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    } catch (err) {
    console.error("Error accessing camera:", err);
    }
} else {
    if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    stream = null;
    }
}
});
/* turn camera*/
switchCamBtn.addEventListener('click', () => {
  usingFrontCamera = !usingFrontCamera;
  startCamera(usingFrontCamera ? 'user' : 'environment');
});

// Event: Change Frame
frameSelect.addEventListener('change', () => {
  overlay.src = frameSelect.value;
  liveFrame.src = frameSelect.value;
});

// Take photo
snapBtn.addEventListener('click', () => {
  if (!stream) {
    alert("Please turn on the camera first.");
    return;
  }

  // Set canvas to video size
  canvas.width = 3024;
  canvas.height = 4032;

  // Draw the video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Ensure overlay is drawn AFTER it's loaded
  const drawFinalImage = () => {
    ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.download = "event-photo.png"; // Ensure filename
  };

  if (!overlay.complete) {
    overlay.onload = drawFinalImage;
  } else {
    drawFinalImage();
  }
});
