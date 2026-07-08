// Fundamentals Pipeline — starter script
// Delete whichever branch (Teachable Machine / Roboflow) you are not using.

const startBtn = document.getElementById("start-btn");
const labelContainer = document.getElementById("label-container");
const webcam = document.getElementById("webcam");

// ---------- OPTION A: Teachable Machine ----------
// Use the shareable link you already got from "Export Model > Upload my
// model" in Teachable Machine (the same one you paste into your end-
// assessment report). No need to download/commit model.json or weights.bin
// — just point at your hosted TM link, e.g.:
// const MODEL_URL = "https://teachablemachine.withgoogle.com/models/XXXXXXXXX/";
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/XXXXXXXXX/";

async function initTeachableMachine() {
  const modelURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";

  const model = await tmImage.load(modelURL, metadataURL);
  const maxPredictions = model.getTotalClasses();

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcam.srcObject = stream;
  await webcam.play();

  window.requestAnimationFrame(loop);

  async function loop() {
    const prediction = await model.predict(webcam);
    labelContainer.innerHTML = prediction
      .map(p => `${p.className}: ${(p.probability * 100).toFixed(1)}%`)
      .join("<br>");
    window.requestAnimationFrame(loop);
  }
}

// ---------- OPTION B: Roboflow ----------
// NEVER hardcode your API key here. Prompt for it client-side, or read it
// from a config.js file that is listed in .gitignore.
const ROBOFLOW_MODEL_ENDPOINT = "https://detect.roboflow.com/YOUR_PROJECT/YOUR_VERSION";

async function initRoboflow() {
  const apiKey = prompt("Enter your Roboflow API key (not stored, session only):");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcam.srcObject = stream;
  await webcam.play();

  setInterval(async () => {
    const canvas = document.getElementById("output-canvas");
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    canvas.getContext("2d").drawImage(webcam, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

    const res = await fetch(`${ROBOFLOW_MODEL_ENDPOINT}?api_key=${apiKey}`, {
      method: "POST",
      body: base64,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const result = await res.json();
    labelContainer.innerText = JSON.stringify(result.predictions, null, 2);
  }, 1000);
}

startBtn.addEventListener("click", () => {
  // Call whichever function matches your pipeline:
  initTeachableMachine();
  // initRoboflow();
});
