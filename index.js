// Récupération de l'élément canvas et du contexte 2D
let canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    rayonBalle = 9,
    x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
    y = canvas.height - 40,
    dx = 2,
    dy = -2;

// Dimensions du paddle
let hauteurPaddle = 12,
    largeurPaddle = 72;

// Position initiale du paddle
let positionPaddle = (canvas.width - largeurPaddle) / 2;

// Paramètres des briques
let nombreLignes = 5,
    nombreColonnes = 9,
    largeurBrique = 54,
    hauteurBrique = 18,
    espacementBrique = 12,
    offsetHaut = 40,
    offsetGauche = 33,
    score = 0;

// Tableau pour stocker l'état des briques
let briques = [];
for (let c = 0; c < nombreColonnes; c++) {
    briques[c] = [];
    for (let r = 0; r < nombreLignes; r++) {
        briques[c][r] = { x: 0, y: 0, statut: 1 };
    }
}

// Gestionnaire d'événements pour le mouvement de la souris
function gestionSouris(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        positionPaddle = relativeX - largeurPaddle / 2;
    }
}

document.addEventListener("mousemove", gestionSouris, false);

// Dessine le paddle
function dessinerPaddle() {
    ctx.beginPath();
    ctx.rect(positionPaddle, canvas.height - hauteurPaddle, largeurPaddle, hauteurPaddle);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

// Dessine la balle
function dessinerBalle() {
    ctx.beginPath();
    ctx.arc(x, y, rayonBalle, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

// Dessine les briques
function dessinerBriques() {
    for (let c = 0; c < nombreColonnes; c++) {
        for (let r = 0; r < nombreLignes; r++) {
            if (briques[c][r].statut === 1) {
                let briqueX = (c * (largeurBrique + espacementBrique)) + offsetGauche;
                let briqueY = (r * (hauteurBrique + espacementBrique)) + offsetHaut;
                briques[c][r].x = briqueX;
                briques[c][r].y = briqueY;
                ctx.beginPath();
                ctx.rect(briqueX, briqueY, largeurBrique, hauteurBrique);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Affiche le score
function suivreScore() {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Score : ' + score, 8, 24);
}

// Détection des collisions avec les briques
function detectionCollision() {
    for (let c = 0; c < nombreColonnes; c++) {
        for (let r = 0; r < nombreLignes; r++) {
            let b = briques[c][r];
            if (b.statut == 1) {
                if (x > b.x && x < b.x + largeurBrique && y > b.y && y < b.y + hauteurBrique) {
                    dy = -dy;
                    b.statut = 0;
                    score++;
                    if (score === nombreLignes * nombreColonnes) {
                        alert('Vous avez gagné !');
                        // Recharge la page après un court délai
                        setTimeout(() => {
                            document.location.reload();
                        }, 1000);
                    }
                }
            }
        }
    }
}

// Initialisation du jeu
function initialisation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    suivreScore();
    dessinerBriques();
    dessinerPaddle();
    dessinerBalle();
    detectionCollision();

    if (x + dx > canvas.width - rayonBalle || x + dx < rayonBalle) {
        dx = -dx;
    }

    if (y + dy < rayonBalle) {
        dy = -dy;
    } else if (y + dy > canvas.height - rayonBalle) {
        if (x > positionPaddle && x < positionPaddle + largeurPaddle && y + dy > canvas.height - hauteurPaddle) {
            dy = -dy;
        } else {
            alert('Game Over !');
            // Recharge la page après un court délai
            setTimeout(() => {
                document.location.reload();
            }, 1000);
        }
    }

    x += dx;
    y += dy;
}

// Régénère les briques
function regenererBriques() {
    // Réinitialise toutes les briques
    for (let c = 0; c < nombreColonnes; c++) {
        for (let r = 0; r < nombreLignes; r++) {
            briques[c][r] = { x: 0, y: 0, statut: 1 };
        }
    }
    
    // Redessine les briques
    dessinerBriques();
}

// Détection des collisions avec les briques
function detectionCollision() {
    let briquesRestantes = 0; // Compteur pour les briques restantes
    
    for (let c = 0; c < nombreColonnes; c++) {
        for (let r = 0; r < nombreLignes; r++) {
            let b = briques[c][r];
            if (b.statut == 1) {
                briquesRestantes++; // Incrémente le compteur si la brique est intacte
                if (x > b.x && x < b.x + largeurBrique && y > b.y && y < b.y + hauteurBrique) {
                    dy = -dy;
                    b.statut = 0;
                    score++;
                }
            }
        }
    }

    // Si toutes les briques ont été touchées, régénère-les
    if (briquesRestantes === 0) {
        regenererBriques();
    }
}

// Ajout d'un gestionnaire d'événements pour nettoyer les écouteurs de souris avant le rechargement de la page
window.addEventListener("unload", function() {
    document.removeEventListener("mousemove", gestionSouris);
});

// Appel de la fonction d'initialisation à intervalles réguliers
setInterval(initialisation, 10);
