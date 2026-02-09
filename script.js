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
/* --- LOGIQUE INTERACTIVE DES TARIFS --- */

document.querySelectorAll('.price-card').forEach(card => {
    // Effet au survol (Souris)
    card.addEventListener('mouseenter', () => {
        applyFocusEffect(card);
    });

    // Effet au toucher (Téléphone)
    card.addEventListener('touchstart', () => {
        applyFocusEffect(card);
    }, {passive: true});

    // Reset quand on sort de la carte
    card.addEventListener('mouseleave', resetFocusEffect);
});

function applyFocusEffect(activeCard) {
    document.querySelectorAll('.price-card').forEach(otherCard => {
        if (otherCard !== activeCard) {
            otherCard.style.opacity = "0.4";
            otherCard.style.transform = "scale(0.95)";
            otherCard.style.filter = "blur(2px)";
        } else {
            otherCard.style.opacity = "1";
            otherCard.style.transform = activeCard.classList.contains('best-value') ? "scale(1.1)" : "scale(1.05)";
            otherCard.style.filter = "none";
        }
    });
}

function resetFocusEffect() {
    document.querySelectorAll('.price-card').forEach(card => {
        card.style.opacity = "1";
        card.style.filter = "none";
        // On remet la taille d'origine (plus grande pour le Géant)
        if (card.classList.contains('best-value')) {
            card.style.transform = "scale(1.05)";
        } else {
            card.style.transform = "scale(1)";
        }
    });
}
// Fonction pour les étoiles clignotantes en arrière-plan
function createStars() {
    const container = document.getElementById('stars-container');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}
createStars();

// Logique du Calculateur
const baseSelect = document.getElementById('base-price');
const checks = document.querySelectorAll('input[type="checkbox"]');
const result = document.getElementById('total-result');

function updatePrice() {
    let total = parseInt(baseSelect.value);
    checks.forEach(check => {
        if (check.checked) total += parseInt(check.value);
    });
    result.innerText = total;
}

baseSelect.addEventListener('change', updatePrice);
checks.forEach(c => c.addEventListener('change', updatePrice));
const kgInput = document.getElementById('user-kg');
const pliyajRadios = document.getElementsByName('pliyaj');
const sechageCheck = document.getElementById('sechage-opt');
const resultDisplay = document.getElementById('total-result');

function calculateFinalPrice() {
    let kg = parseFloat(kgInput.value) || 0;
    let total = 0;
    let currentForfait = "";

    // 1. Déterminer le forfait de base selon le KG
    if (kg > 0 && kg <= 9) { total = 650; currentForfait = "petit"; }
    else if (kg >= 10 && kg <= 14) { total = 850; currentForfait = "malin"; }
    else if (kg >= 15) { total = 1000; currentForfait = "geant"; }

    // 2. Calcul du Pliyaj par tranche de 10kg (ex: 11kg = 2 tranches)
    let tranches = Math.ceil(kg / 10);
    let pliyajPrice = 0;
    pliyajRadios.forEach(radio => {
        if (radio.checked) pliyajPrice = parseInt(radio.value);
    });
    total += (pliyajPrice * tranches);

    // 3. Séchage (Gratuit pour le Géant)
    if (sechageCheck.checked && currentForfait !== "geant") {
        total += 200;
    }

    resultDisplay.innerText = total;
}

// Écouteurs d'événements
kgInput.addEventListener('input', calculateFinalPrice);
sechageCheck.addEventListener('change', calculateFinalPrice);
pliyajRadios.forEach(r => r.addEventListener('change', calculateFinalPrice));

// Générateur d'étoiles (à mettre une seule fois dans le fichier)
function initStars() {
    const container = document.getElementById('stars-container');
    if(!container) return;
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(star);
    }
}
initStars();
