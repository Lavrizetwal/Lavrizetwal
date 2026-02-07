document.addEventListener('DOMContentLoaded', () => {
    // Création des éclats dorés (Sparkles)
    const container = document.querySelector('.sparkle-container');
    
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        const size = Math.random() * 5 + 2 + 'px';
        sparkle.style.width = size;
        sparkle.style.height = size;
        
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    setInterval(createSparkle, 150);

    // Animation au défilement
    const reveal = document.querySelector('.reveal');
    reveal.style.opacity = '1';
});
