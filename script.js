document.addEventListener('DOMContentLoaded', () => {
    console.log("Lavri Zetwal Prestige Initialisé");
    
    // Animation simple des blocs
    const reveals = document.querySelectorAll('.reveal, .info-block-gold');
    reveals.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        el.style.transitionDelay = (index * 0.2) + 's';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});
