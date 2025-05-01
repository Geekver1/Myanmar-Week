const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const snapBtn = document.getElementById('snap');
const downloadLink = document.getElementById('download');
const startCamBtn = document.getElementById('startCam');
const stopCamBtn = document.getElementById('stopCam');
const frameSelect = document.getElementById('frameSelect');

let stream = null;
let overlay = new Image();
overlay.src = frameSelect.value;

// Start the camera
startCamBtn.addEventListener('click', async () => {
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not available.");
    }
  }
});

// Stop the camera
stopCamBtn.addEventListener('click', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    stream = null;
  }
});

// Update overlay when user changes frame
frameSelect.addEventListener('change', () => {
  overlay.src = frameSelect.value;
});

// Take photo with overlay
snapBtn.addEventListener('click', () => {
  if (!stream) {
    alert("Please turn on the camera first.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  overlay.onload = () => {
    ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
  };

  // If the overlay is already loaded
  if (overlay.complete) {
    ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
  }
});
