// Typewriter function implementation
function typewriterEffect(text, delay = 50) {
    const element = document.getElementById('text_prompt');
    let i = 0;

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, delay);
      } else {
        console.log("done.");
      }
    }

    // Clear the element and start typing
    element.innerHTML = '';
    type();
  }

  typewriterEffect('Hello, World!');

  function placeImage(slot, imageName, shouldFlip = false) {
    // Determine the target div based on the slot number
    const targetDiv = document.querySelector(`.character_${slot}`);
    if (!targetDiv) {
      console.error(`Invalid slot number: ${slot}`);
      return;
    }
  
    // Create a new img element
    const img = document.createElement('img');
    img.src = `images/${imageName}`;
    
    // Apply the flip class if shouldFlip is true
    if (shouldFlip) {
      img.style.transform = 'scaleX(-1)';
    }
  
    // Clear any existing content and append the new image
    targetDiv.innerHTML = '';  // Optional: Clear any existing content
    targetDiv.appendChild(img);
  }
  
  // Place an image named "character1.png" in slot 1, not flipped
  placeImage(1, 'character1.png', true);
  
  // Place an image named "character2.png" in slot 2, flipped horizontally
  placeImage(2, 'character2.png');