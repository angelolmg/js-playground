document.addEventListener("DOMContentLoaded", function () {
    let isRunning = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getQueryParameter(name) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(name);
    }

    const levelType = getQueryParameter('levelType') || '1';  // Default to Level 1
    const iterations = getQueryParameter('iterations') || 25;
    const fontSize = getQueryParameter('fontSize') || 45;
    const delay = getQueryParameter('delay') || 3;

    async function printRandomContent() {
        isRunning = true;
        document.getElementById('backButton').style.display = 'inline';

        const letters = ['A (Lá)', 'B (Sí)', 'C (Dó)', 'D (Ré)', 'E (Mí)', 'F (Fá)', 'G (Sol)'];

        // Display welcome message
        document.getElementById('appContainer').innerHTML = `<p class='welcome-message'>Welcome to Level ${levelType} training session!</p>`;
        await sleep(3000);  // Pause for 3 seconds to display the welcome message

        // Countdown before starting the content loop
        for (let count = 3; count > 0; count--) {
            document.getElementById('appContainer').innerHTML = `<p style='font-size:24px;color:red'>Starting in: ${count}</p>`;
            await sleep(1000);
        }

        // Content loop
for (let i = 1; i <= iterations && isRunning; i++) {
    let content;
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const direction = ['Dir', 'Esq'][Math.floor(Math.random() * 2)];
    const randomNumber = Math.floor(Math.random() * 5) + 1;

    switch (levelType) {
        case '1':
            content = `<p style='font-size:${fontSize}px'>${letter}</p>`;
            break;

        case '2':
            content = `<p style='font-size:${fontSize}px'>${direction} - ${randomNumber}</p>
                       <p style='font-size:${fontSize}px'>${letter}</p>`;
            break;

        case '3':
            content = `<p style='font-size:${fontSize}px'>${letter} - ${randomNumber}</p>`;
            break;

        case '4':
            content = `<p style='font-size:${fontSize}px'>${letter} - ${direction}</p>`
            break;
        
        case '5':
            nFiles = 34  // Number of images inside note-images 
            
            const randomIndex = Math.floor(Math.random() * nFiles) + 1;
            const baseUrl = "https://raw.githubusercontent.com/angelolmg/js-playground/main/piano-helper/note-images"

            content = `<img src="${baseUrl}/${randomIndex}.png">`
            break;
            
        default:
            console.error(`Invalid levelType: ${levelType}`);
            break;
    }

    const trackerMessage = `<p style='font-size:14px'>(${i}/${iterations})</p>`;
    document.getElementById('appContainer').innerHTML = content + trackerMessage;
    await sleep(delay * 1000);
}

        // Display colorful message after the loop
        document.getElementById('appContainer').innerHTML = "<p class='welcome-message'>Session is over. <br> Good job!</p>";
        document.getElementById('backButton').style.display = 'none';
        isRunning = false;
        // Redirect to index.html when the app is finished
        window.location.href = "index.html";
    }

    // Stop the app and return to index.html on back button click
    document.getElementById('backButton').addEventListener('click', function () {
        isRunning = false;
        // Redirect to index.html when the back button is clicked
        window.location.href = "index.html";
    });

    // Start the random content printing when the page is loaded
    printRandomContent();
});
