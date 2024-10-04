class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createGrid();

        this.maxGridWidth = 800;  
        this.maxGridHeight = 800; 

        this.cellSize = Math.min(
            Math.floor(this.maxGridWidth / (cols + 1)),
            Math.floor(this.maxGridHeight / (rows + 1))
        );
    }

    // Générer la grille
    createGrid() {
        let grid = [];
        for (let y = 0; y < this.rows; y++) {
            let row = [];
            for (let x = 0; x < this.cols; x++) {
                const traversable = Math.random() >= 0.3; // 70% traversable
                row.push(new Cell(x, y, traversable));
            }
            grid.push(row);
        }
        return grid;
    }

    render() {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';

        const fullGrid = document.createElement('div');
        fullGrid.classList.add('grid');

        fullGrid.style.gridTemplateColumns = `repeat(${this.cols + 1}, ${this.cellSize}px)`;
        fullGrid.style.gridTemplateRows = `repeat(${this.rows + 1}, ${this.cellSize}px)`;

        const emptyCorner = document.createElement('div');
        emptyCorner.classList.add('coord-cell');
        emptyCorner.style.width = `${this.cellSize}px`;
        emptyCorner.style.height = `${this.cellSize}px`;
        fullGrid.appendChild(emptyCorner);

        for (let x = 0; x < this.cols; x++) {
            const xCoordCell = document.createElement('div');
            xCoordCell.classList.add('coord-cell');
            xCoordCell.textContent = x;
            xCoordCell.style.width = `${this.cellSize}px`;
            xCoordCell.style.height = `${this.cellSize}px`;
            fullGrid.appendChild(xCoordCell);
        }

        for (let y = 0; y < this.rows; y++) {
            const yCoordCell = document.createElement('div');
            yCoordCell.classList.add('coord-cell');
            yCoordCell.textContent = y;
            yCoordCell.style.width = `${this.cellSize}px`;
            yCoordCell.style.height = `${this.cellSize}px`;
            fullGrid.appendChild(yCoordCell);

            for (let x = 0; x < this.cols; x++) {
                this.grid[y][x].render(fullGrid, this.cellSize);
            }
        }

        gridContainer.appendChild(fullGrid);
    }

    setStartAndGoal() {
        let startCell = this.grid[0][0];
        let goalCell = this.grid[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)];

        if (!startCell.traversable) {
            startCell.traversable = true;
            startCell.element.classList.remove('wall');
        }

        if (!goalCell.traversable) {
            goalCell.traversable = true;
            goalCell.element.classList.remove('wall');
        }

        startCell.setStart();
        goalCell.setGoal();
    }

    // Vérification de l'existence d'un chemin entre le départ et l'arrivée
    isPathExist() {
        const visited = new Set();
        const start = { x: 0, y: 0 };
        const goal = { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) };
        const directions = [
            [0, 1],  // droite
            [1, 0],  // bas
            [0, -1], // gauche
            [-1, 0]  // haut
        ];

        const stack = [start];
        visited.add(`${start.x},${start.y}`);

        while (stack.length > 0) {
            const { x, y } = stack.pop();

            // Si nous avons atteint l'objectif
            if (x === goal.x && y === goal.y) {
                return true;
            }

            // Explorer les voisins
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;

                if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows) {
                    const neighbor = this.grid[newY][newX];
                    const key = `${newX},${newY}`;

                    if (neighbor.traversable && !visited.has(key)) {
                        visited.add(key);
                        stack.push({ x: newX, y: newY });
                    }
                }
            }
        }

        return false; // Aucun chemin trouvé
    }

    // Génération avec vérification de chemin valide
    static generateValidGrid(rows, cols) {
        let grid;
        do {
            grid = new Grid(rows, cols);
            grid.setStartAndGoal();
        } while (!grid.isPathExist());  // Tant qu'il n'y a pas de chemin valide, on recrée la grille
        return grid;
    }
}
