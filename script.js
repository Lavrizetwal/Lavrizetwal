document.addEventListener('DOMContentLoaded', () => {
    // Animation d'entrée
    const reveal = document.querySelector('.reveal');
    reveal.style.opacity = '0';
    reveal.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        reveal.style.transition = 'all 1s ease-out';
        reveal.style.opacity = '1';
        reveal.style.transform = 'translateY(0)';
    }, 200);
});
