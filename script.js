document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const starCount = 100; // J'ai doublé le nombre d'étoiles pour plus d'éclat

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Position aléatoire sur tout l'écran
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Taille variée pour donner de la profondeur
        const size = Math.random() * 4 + 1;
        
        // Vitesse de scintillement différente pour chaque étoile
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
    console.log("100 étoiles générées avec succès.");
});
