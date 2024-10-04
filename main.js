let grid; // Déclaration globale de la grille

// Fonction pour générer la grille aléatoire
function generateRandomCircuit() {
    const rows = parseInt(document.getElementById('rows').value, 10);
    const cols = parseInt(document.getElementById('cols').value, 10);

    // Utilisation de la génération avec chemin valide
    grid = Grid.generateValidGrid(rows, cols);  // Ne pas redéclarer `grid` ici
    grid.render();
    grid.setStartAndGoal(); // S'assurer de définir le point de départ et d'arrivée après la génération
}

// Fonction pour résoudre le labyrinthe avec DFS et animation
async function dfsWithAnimation() {
    if (!grid) {
        alert("La grille n'est pas générée.");
        return;
    }

    // Identifier les cellules de départ et d'arrivée
    let start, goal;
    for (let row of grid.grid) {
        for (let cell of row) {
            if (cell.element.classList.contains('start')) {
                start = cell;
            }
            if (cell.element.classList.contains('goal')) {
                goal = cell;
            }
        }
    }

    if (!start || !goal) {
        alert("Départ ou arrivée non définis.");
        return;
    }

    const visited = new Set();
    const path = [];
    const directions = [
        [0, 1],  // droite
        [1, 0],  // bas
        [0, -1], // gauche
        [-1, 0]  // haut
    ];

    // Fonction pour introduire un délai
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function explore(x, y) {
        // Si on a atteint l'objectif
        if (x === goal.x && y === goal.y) {
            path.push([x, y]);
            return true;
        }

        // Marquer la cellule actuelle comme visitée
        visited.add(`${x},${y}`);
        const currentCell = grid.grid[y][x];
        currentCell.element.classList.add('visited');
        currentCell.element.classList.add('current');

        // Attendre un peu pour visualiser
        await sleep(200);

        // Explorer les directions possibles
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < grid.cols && newY >= 0 && newY < grid.rows) {
                const neighbor = grid.grid[newY][newX];

                if (neighbor.traversable && !visited.has(`${newX},${newY}`)) {
                    if (await explore(newX, newY)) {
                        path.push([x, y]);
                        currentCell.element.classList.remove('current'); // Retirer la classe current quand le personnage avance
                        return true;
                    }
                }
            }
        }

        // Retirer la classe current (le personnage revient en arrière)
        currentCell.element.classList.remove('current');
        return false;
    }

    // Commencer l'exploration
    const found = await explore(start.x, start.y);

    if (found) {
        // Afficher le chemin trouvé
        path.reverse(); // Inverser pour aller du départ à l'arrivée
        for (const [x, y] of path) {
            const cell = grid.grid[y][x];
            if (!cell.element.classList.contains('start') && !cell.element.classList.contains('goal')) {
                cell.element.classList.add('path');
                await sleep(100); // Délai pour l'animation du chemin
            }
        }
    } else {
        alert("Aucun chemin trouvé.");
    }
}

// Lier les événements aux boutons
document.getElementById('solve').addEventListener('click', dfsWithAnimation);
document.getElementById('generate').addEventListener('click', generateRandomCircuit);

// Générer une grille au chargement de la page
window.onload = generateRandomCircuit;
