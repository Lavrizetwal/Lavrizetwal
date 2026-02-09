document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const starCount = 100; 

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 4 + 1;
        const duration = Math.random() * 3 + 1.5;
        const delay = Math.random() * 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;

        starContainer.appendChild(star);
    }
});
document.addEventListener('mousemove', (e) => {
    // On ne crée pas une bulle à chaque millimètre pour ne pas ralentir le site
    if (Math.random() > 0.9) { 
        createBubble(e.clientX, e.clientY);
    }
});

function createBubble(x, y) {
    const container = document.getElementById('bubble-container');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Taille aléatoire pour plus de réalisme
    const size = Math.random() * 20 + 10 + "px";
    bubble.style.width = size;
    bubble.style.height = size;
    
    // Position de la bulle sur la souris
    bubble.style.left = x + "px";
    bubble.style.top = y + "px";
    
    container.appendChild(bubble);
    
    // On détruit la bulle après l'animation pour ne pas alourdir le site
    setTimeout(() => {
        bubble.remove();
    }, 3000);
}
// Fonction pour créer une bulle
function createBubble(x, y) {
    const container = document.getElementById('bubble-container');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 20 + 10 + "px";
    bubble.style.width = size;
    bubble.style.height = size;
    bubble.style.left = x + "px";
    bubble.style.top = y + "px";
    container.appendChild(bubble);
    setTimeout(() => { bubble.remove(); }, 3000);
}

// Détection Souris (Ordi)
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) createBubble(e.clientX, e.clientY);
});

// Détection Doigt (Téléphone) - C'est ça qui manquait !
document.addEventListener('touchmove', (e) => {
    if (Math.random() > 0.8) { // Un peu plus de bulles sur mobile pour l'effet
        const touch = e.touches[0];
        createBubble(touch.clientX, touch.clientY);
    }
}, {passive: true});
