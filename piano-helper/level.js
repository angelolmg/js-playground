document.addEventListener("DOMContentLoaded", function () {
  let isRunning = false;

  // Global constants
  const letters = [
    "A (Lá)",
    "B (Sí)",
    "C (Dó)",
    "D (Ré)",
    "E (Mí)",
    "F (Fá)",
    "G (Sol)",
  ];
  const directions = ["Right Hand", "Left Hand", "Both Hands"];
  const majorScales = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const minorScales = [
    "Cm",
    "C#m",
    "Dm",
    "D#m",
    "Em",
    "Fm",
    "F#m",
    "Gm",
    "G#m",
    "Am",
    "A#m",
    "Bm",
  ];
  const harmonicMinorScales = [
    "Cm (h)",
    "C#m (h)",
    "Dm (h)",
    "D#m (h)",
    "Em (h)",
    "Fm (h)",
    "F#m (h)",
    "Gm (h)",
    "G#m (h)",
    "Am (h)",
    "A#m (h)",
    "Bm (h)",
  ];
  const motions = ["Same motion", "Contrary motion"]; // Added for scale levels
  const octaves = [1, 2, 3];
  const bpms = [80, 100, 120];
  let currBPM;

  const levelType = getQueryParameter("levelType", "1"); // Default to Level 1
  const iterations = getQueryParameter("iterations", 25);
  const fontSize = getQueryParameter("fontSize", 45);
  const delay = getQueryParameter("delay", 3);

  // Helper functions
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getQueryParameter(name, defaultValue) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name) || defaultValue;
  }

  function showBackButton() {
    document.getElementById("backButton").style.display = "inline";
  }

  function hideBackButton() {
    document.getElementById("backButton").style.display = "none";
  }

  function updateBpmDot(bpm) {
    if (bpm) {
      document.querySelector(".bpm-dot").style.animation = `blink ${
        30 / bpm
      }s infinite alternate`;
    }
  }

  async function showCountdown() {
    for (let count = 3; count > 0; count--) {
      document.getElementById(
        "appContainer"
      ).innerHTML = `<p style='font-size:24px;color:red'>Starting in: ${count}</p>`;
      await sleep(1000);
    }
  }

  // Generate notes level logic for levels 1-5
  function generateNotesLevel(levelType) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const randomNumber = Math.floor(Math.random() * 5) + 1;

    let content = "";
    switch (levelType) {
      case "1":
        content = `<p style='font-size:${fontSize}px'><strong>Hit: </strong>${letter}</p>`;
        break;

      case "2":
        content = `<p style='font-size:${fontSize}px'><strong>Hit: </strong>${letter}</p>
        <p style='font-size:${fontSize}px'><strong>Use: </strong>Finger ${randomNumber}</p>`;
        break;

      case "3":
        content = `<p style='font-size:${fontSize}px'><strong>Hit: </strong>${letter}</p>
                            <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction} - Finger ${randomNumber}</p>`;
        break;

      case "4":
        content = `<p style='font-size:${fontSize}px'><strong>Hit every: </strong>${letter}</p>
                            <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction} - Finger ${randomNumber}</p>`;
        break;

      case "5":
        const nFiles = 34; // Number of images inside note-images
        const randomIndex = Math.floor(Math.random() * nFiles) + 1;
        const baseUrl =
          "https://raw.githubusercontent.com/angelolmg/js-playground/main/piano-helper/note-images";
        content = `<img src="${baseUrl}/${randomIndex}.png">`;
        break;

      default:
        console.error(`Invalid levelType: ${levelType}`);
        break;
    }

    return content;
  }

  // LEVEL 6-9: Generate Scales
  function generateScalesLevel(levelType) {
    // 50/50 chance for major or minor
    const isMajor = Math.random() < 0.5;

    let scale;
    if (isMajor) {
      scale = majorScales[Math.floor(Math.random() * majorScales.length)];
    } else {
      // 50/50 chance for natural or harmonic minor
      const isHarmonicMinor = Math.random() < 0.5;
      if (isHarmonicMinor) {
        scale =
          harmonicMinorScales[
            Math.floor(Math.random() * harmonicMinorScales.length)
          ];
      } else {
        scale = minorScales[Math.floor(Math.random() * minorScales.length)];
      }
    }

    const direction = directions[Math.floor(Math.random() * directions.length)];

    if (levelType === "6") {
      return `
                <div>
                    <p style='font-size:${fontSize}px'><strong>Play: </strong>${scale}</p>
                    <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction}</p>
                </div>
            `;
    } else if (levelType === "7") {
        const octave = octaves[Math.floor(Math.random() * octaves.length)];
      return `
                <div>
                    <p style='font-size:${fontSize}px'><strong>Play: </strong>${scale} - ${octave} octaves</p>
                    <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction}</p>
                </div>
            `;
      
    } else if (levelType === "8") {
        const bpm = bpms[Math.floor(Math.random() * bpms.length)];
        currBPM = bpm;
        const octave = octaves[Math.floor(Math.random() * octaves.length)];
        return `
                  <div>
                      <p style='font-size:${fontSize}px'><strong>Play: </strong>${scale} - ${octave} octaves</p>
                      <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction}</p>
                      <p style='font-size:${fontSize}px' class="l9p"><strong>BPM: </strong>${bpm}<span class="bpm-dot">●</span></p>
                  </div>
              `;
        
    } else if (levelType === "9") {
        const bpm = bpms[Math.floor(Math.random() * bpms.length)];
        currBPM = bpm;
        const octave = octaves[Math.floor(Math.random() * octaves.length)];
        const motion = motions[Math.floor(Math.random() * motions.length)];
        return `
                  <div>
                  
                  <p style='font-size:${fontSize}px'><strong>Play: </strong>${scale} - ${octave} octaves</p>
                  <p style='font-size:${fontSize}px'><strong>Use: </strong> Both hands</p>
                      <p style='font-size:${fontSize}px' class="l9p"><strong>BPM: </strong> ${bpm} <span class="bpm-dot">●</span></p>
                      <p style='font-size:${fontSize}px'><strong>At: </strong>${motion}</p>
                  </div>
              `;
        
    }
  }

  async function printRandomContent() {
    isRunning = true;
    showBackButton();

    // Display welcome message
    document.getElementById(
      "appContainer"
    ).innerHTML = `<p class='welcome-message'>Welcome to Level ${levelType} training session!</p>`;
    await sleep(3000); // Pause for 3 seconds to display the welcome message

    // Countdown before starting the content loop
    await showCountdown();

    for (let i = 1; i <= iterations && isRunning; i++) {
      let content = "";
      if (levelType >= "1" && levelType <= "5") {
        content = generateNotesLevel(levelType);
      } else if (levelType >= "6" && levelType <= "9") {
        content = generateScalesLevel(levelType);
      }

      const trackerMessage = `<p style='font-size:14px'>(${i}/${iterations})</p>`;
      document.getElementById("appContainer").innerHTML =
        content + trackerMessage;
      updateBpmDot(currBPM);
      await sleep(delay * 1000);
    }

    // Display colorful message after the loop
    document.getElementById("appContainer").innerHTML =
      "<p class='welcome-message'>Session is over. <br> Good job!</p>";
    hideBackButton();
    isRunning = false;
    // Redirect to index.html when the app is finished
    window.location.href = "index.html";
  }

  // Stop the app and return to index.html on back button click
  document.getElementById("backButton").addEventListener("click", function () {
    isRunning = false;
    // Redirect to index.html when the back button is clicked
    window.location.href = "index.html";
  });

  // Start the random content printing when the page is loaded
  printRandomContent();
});
