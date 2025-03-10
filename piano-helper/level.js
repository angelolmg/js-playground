document.addEventListener("DOMContentLoaded", function () {
  let isRunning = false;
  let canvas;
  let ctx;

  const cleff = new Image();
  const staffLines = 9;
  const lineSpacing = 16;
  const startX = 20;
  const startY = 20;
  const noteRadius = 10;

  // Notes mapping (lines and spaces on the staff)
  const notes = [
    { name: "G", yOffset: -2.5 },
    { name: "F", yOffset: -2 },
    { name: "E", yOffset: -1.5 },
    { name: "D", yOffset: -1 },
    { name: "C", yOffset: -0.5 },
    { name: "B", yOffset: 0 },
    { name: "A", yOffset: 0.5 },
    { name: "G", yOffset: 1 },
    { name: "F", yOffset: 1.5 },
    { name: "E", yOffset: 2 },
    { name: "D", yOffset: 2.5 },
  ];

  // Draw staff
  function drawStaff() {
    ctx.lineWidth = 2;
    for (let i = 0; i < staffLines; i++) {
      let y = startY + i * lineSpacing;
      ctx.beginPath();
      ctx.moveTo(startX + (i < 2 || i > 6 ? (9 * canvas.width) / 20 : 0), y);
      ctx.lineTo(
        canvas.width - 20 - (i < 2 || i > 6 ? (5 * canvas.width) / 20 : 0),
        y
      );
      ctx.stroke();
    }
  }

  // Randomly choose a note
  function getRandomNote() {
    return notes[Math.floor(Math.random() * notes.length)];
  }

  // Randomly choose an accidental (50% none, 25% sharp, 25% flat)
  function getRandomAccidental() {
    const rand = Math.random();
    if (rand < 0.5) return ""; // 50% chance for none
    return rand < 0.75 ? "#" : "♭"; // 25% chance for sharp, 25% for flat
  }

  // Draw accidental
  function drawAccidental(accidental, noteX, noteY) {
    if (accidental) {
      ctx.font = "32px bold Arial";
      ctx.fillStyle = "black";
      ctx.fillText(accidental, noteX - 35, noteY + 10);
    }
  }

  // Draw a note
  function drawNote() {
    let note = getRandomNote();
    let accidental = getRandomAccidental();
    let noteY =
      startY + (staffLines * lineSpacing) / 2 + note.yOffset * lineSpacing;
    let noteX = (3 * canvas.width) / 5;

    drawAccidental(accidental, noteX, noteY);

    ctx.beginPath();
    ctx.ellipse(noteX, noteY, noteRadius, noteRadius * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();

    let selectedCleff = Math.random() < 0.5 ? "G" : "F";

    cleff.onload = function () {
      let myX = startX + 10;
      let myY = startY - (selectedCleff === "G" ? -12 : -28);
      ctx.drawImage(cleff, myX, myY);
    };

    cleff.src = `scale-base/${selectedCleff}cleff.png`;
  }

  // Draw everything
  function drawRandomNote() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStaff();
    drawNote();
  }

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

  let currBPM;
  const directions = ["Right Hand", "Left Hand", "Both Hands"];
  const motions = ["Same motion", "Contrary motion"];
  const octaves = [1, 2, 3];
  const bpms = [
    { speed: "Andante", bpm: 80 },
    { speed: "Moderato", bpm: 108 },
    { speed: "Allegro", bpm: 126 },
  ];

  const levelType = getQueryParameter("levelType", "1"); // Default to Level 1
  const iterations = getQueryParameter("iterations", 5);
  const fontSize = getQueryParameter("fontSize", 35);
  const delay = getQueryParameter("delay", 30);

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
        30 / bpm.bpm
      }s infinite alternate`;
    }
  }

  async function showCountdown() {
    for (let count = 3; count > 0; count--) {
      document.getElementById(
        "appContainer"
      ).innerHTML = `<p style='font-size:24px;color:red' class="iterations">Starting in: ${count}</p>`;
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
        content = `<canvas id="musicCanvas" width="250" height="170"></canvas>`;
        break;

      default:
        console.error(`Invalid levelType: ${levelType}`);
        break;
    }

    return content;
  }

  // LEVEL 6-9: Generate Scales
  function generateScalesLevel(levelType) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    const bpm = bpms[Math.floor(Math.random() * bpms.length)];
    const motion = motions[Math.floor(Math.random() * motions.length)];

    if (levelType === "6") {
      return `
                <div>
                    <canvas id="musicCanvas" width="250" height="170"></canvas>
                    <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction}</p>
                </div>
            `;
    } else if (levelType === "7") {
      return `
                <div>
                    <canvas id="musicCanvas" width="250" height="170"></canvas>
                    <p style='font-size:${fontSize}px'><strong>Play: </strong>${octave} octaves</p>
                    <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction}</p>
                </div>
            `;
    } else if (levelType === "8") {
      currBPM = bpm;
      return `
                  <div>
                      <canvas id="musicCanvas" width="250" height="170"></canvas>
                      <p style='font-size:${fontSize}px'><strong>Play: </strong>${octave} octaves</p>
                      <p style='font-size:${fontSize}px'><strong>Use: </strong>${direction}</p>

                      <p style='font-size:${fontSize}px' class="l9p">
                        <strong>BPM: </strong>${bpm.bpm} (${bpm.speed})
                        <span class="bpm-dot">●</span>
                      </p>
                  </div>
              `;
    } else if (levelType === "9") {
      currBPM = bpm;
      return `
                  <div>
                      <canvas id="musicCanvas" width="250" height="170"></canvas>
                      <p style='font-size:${fontSize}px'><strong>Play: </strong>${octave} octaves</p>
                      <p style='font-size:${fontSize}px'><strong>Use: </strong> Both hands</p>
                      <p style='font-size:${fontSize}px' class="l9p">
                        <strong>BPM: </strong>${bpm.bpm} (${bpm.speed})
                        <span class="bpm-dot">●</span>
                      </p>
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

      const trackerMessage = `<p style='font-size:14px' class="iterations" >(${i}/${iterations})</p>`;
      document.getElementById("appContainer").innerHTML =
        content + trackerMessage;
      updateBpmDot(currBPM);
      canvas = document.getElementById("musicCanvas");
      if (canvas) {
        ctx = canvas.getContext("2d");
        drawRandomNote();
      }

      await sleep(delay * 1000);
    }

    // Display colorful message after the loop
    document.getElementById("appContainer").innerHTML =
      "<p class='welcome-message'>Session is over. <br> Good job!</p>";
    hideBackButton();
    isRunning = false;
    await sleep(2000);
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
