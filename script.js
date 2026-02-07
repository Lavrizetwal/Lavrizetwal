document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const starCount = 50; // Nombre d'étoiles

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Position aléatoire
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Taille aléatoire (entre 2px et 5px)
        const size = Math.random() * 3 + 2;
        
        // Durée d'animation aléatoire (entre 2s et 5s)
        const duration = Math.random() * 3 + 2;
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
