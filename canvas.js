const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a gradient with multiple colors
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'lightblue');
gradient.addColorStop(0.5, 'lightyellow');
gradient.addColorStop(1, 'lightpink');

// Animation variables
let angle = 0;
const rotationSpeed = 0.002;

function animate() {
    // Update animation variables
    // angle += rotationSpeed;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a rectangle filled with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply rotation transformation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Call animate() recursively to create a smooth animation loop
    requestAnimationFrame(animate);
}

// Start the animation
animate();
