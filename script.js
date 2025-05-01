const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const snapBtn = document.getElementById('snap');
const downloadLink = document.getElementById('download');

const overlay = new Image();
overlay.src = 'overlay.png'; // Make sure this matches your actual file

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

// Wait until overlay is loaded
overlay.onload = () => {
  snapBtn.disabled = false; // Enable button only after frame is ready
};

snapBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video image
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw overlay frame
  ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);

  // Update download link
  const dataURL = canvas.toDataURL('image/png');
  downloadLink.href = dataURL;
});