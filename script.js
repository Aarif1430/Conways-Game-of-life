class GameOfLife {
	constructor(container) {
		this.container = container;

		this.EVOLVING = false;
		this.ALIVE = false;

		this.TIMER_ID;
		this.timerSpeed = 250; // 1 sec is 1000ms

		this.root = document.querySelector(":root");
		this.dBody = document.body;

		this.intro = document.querySelector("#intro");

		this.controls = document.querySelector("#controls");
		this.createBtn = document.querySelector("#create");
		this.evolveBtn = document.querySelector("#start");
		this.resetBtn = document.querySelector("#reset");

		this.shapeBtns = document.querySelectorAll("[data-type]");
		this.colorBtns = document.querySelectorAll("[data-color]");
		this.textInput = document.querySelector("#text");

		this.speedRange = document.querySelector("#speed");
		this.speedInput = this.speedRange.querySelector("input");

		this.gridBtn = document.querySelector("#grid");
		this.modeBtn = document.querySelector("#mode");

		this.currentGenCells = [];
		this.nextGenCells = [];

		this.dead = "is-dead";
		this.alive = "is-alive";

		// Start App
		this.createSetup();
		this.addEvents();
		this.addWindowEvents();
	}

	/* SETUP GAME BASICS */
	createGrid() {
		// Check if there's already a table grid and remove it if so - useful for resize()
		if (this.container.hasChildNodes()) this.container.innerHTML = "";

		// Create HTML table
		const table = document.createElement("table");
		this.container.appendChild(table);

		if (table) {
			const tbody = document.createElement("tbody");
			table.appendChild(tbody);

			this.Rows = Math.round(window.innerHeight * 0.031); // Horizontal 0.036
			this.Cols = Math.round(window.innerWidth * 0.04); // Vertical

			// Create rows
			for (let i = 0; i < this.Rows; i++) {
				const tRow = document.createElement("tr");
				tbody.appendChild(tRow);

				// Create cells
				for (let j = 0; j < this.Cols; j++) {
					const tCell = document.createElement("td");
					tRow.appendChild(tCell);

					tCell.id = `${i}_${j}`;
					tCell.className = this.dead;
				}
			}
		}
	}

	createTwoDArrays() {
		this.Cells = document.querySelectorAll("td");

		if (this.Cells) {
			// Create current generation of cells
			for (let i = 0; i < this.Rows; i++) {
				this.currentGenCells[i] = new Array(this.Cols);
				this.nextGenCells[i] = new Array(this.Cols);

				// Create next generation of cells
				for (let j = 0; j < this.Cols; j++) {
					this.currentGenCells[i][j] = 0;
					this.nextGenCells[i][j] = 0;
				}
			}
		}
	}

	enableStartAndResetBtns() {
		if (this.evolveBtn.disabled) {
			this.evolveBtn.disabled = false;
			this.resetBtn.disabled = false;
		}
	}

	disableStartAndResetBtns() {
		if (!this.evolveBtn.disabled) {
			this.evolveBtn.disabled = true;
			this.resetBtn.disabled = true;
		}
	}
	
	hideIntro() {
		if (this.intro.offsetHeight > 0) this.intro.style.display = "none";
	}

	addToggleCellClick() {
		this.Cells.forEach((el) => {
			const cellStatus = el.id.split("_");
			const row = Number(cellStatus[0]);
			const col = Number(cellStatus[1]);

			el.addEventListener("click", (e) => {
				this.hideIntro();

				if (el.className === this.alive) {
					el.className = this.dead;
					this.currentGenCells[row][col] = 0;
				} else {
					el.className = this.alive;
					this.currentGenCells[row][col] = 1;

					this.enableStartAndResetBtns();
					if (!this.createBtn.disabled) this.createBtn.disabled = true;
				}
			});
		});
	}

	createSetup() {
		this.createGrid();
		this.createTwoDArrays();
		this.addToggleCellClick();
		this.randomlyPopulateGrid();
        this.addeventListeners();
	}
	/* EVOLUTION GAME RULES */
	getNeighborCount(row, col) {
		let nCount = 0;
		const nRow = Number(row);
		const nCol = Number(col);

		// Make sure we are not at the first row
		if (nRow - 1 >= 0) {
			// Check top neighbor
			if (this.currentGenCells[nRow - 1][nCol] === 1) {
				nCount++;
			}
		}

		// Make sure we are not in the first cell
		// Upper left corner
		if (nRow - 1 >= 0 && nCol - 1 >= 0) {
			// Check upper left neighbor
			if (this.currentGenCells[nRow - 1][nCol - 1] === 1) {
				nCount++;
			}
		}

		// Make sure we are not on the first row last column
		// Upper right corner
		if (nRow - 1 >= 0 && nCol + 1 < this.Cols) {
			//Check upper right neighbor
			if (this.currentGenCells[nRow - 1][nCol + 1] === 1) {
				nCount++;
			}
		}

		// Make sure we are not on the first column
		if (nCol - 1 >= 0) {
			// Check left neighbor
			if (this.currentGenCells[nRow][nCol - 1] === 1) {
				nCount++;
			}
		}

		// Make sure we are not on the last column
		if (nCol + 1 < this.Cols) {
			// Check right neighbor
			if (this.currentGenCells[nRow][nCol + 1] === 1) {
				nCount++;
			}
		}

		// Make sure we are not on the bottom left corner
		if (nRow + 1 < this.Rows && nCol - 1 >= 0) {
			// Check bottom left neighbor
			if (this.currentGenCells[nRow + 1][nCol - 1] === 1) {
				nCount++;
			}
		}

		// Make sure we are not on the bottom right
		if (nRow + 1 < this.Rows && nCol + 1 < this.Cols) {
			// Check bottom right neighbor
			if (this.currentGenCells[nRow + 1][nCol + 1] === 1) {
				nCount++;
			}
		}

		// Make sure we are not on the last row
		if (nRow + 1 < this.Rows) {
			// Check bottom neighbor
			if (this.currentGenCells[nRow + 1][nCol] === 1) {
				nCount++;
			}
		}

		return nCount;
	}

	createNextGenerationArr() {
		for (const row in this.currentGenCells) {
			for (const col in this.currentGenCells[row]) {
				let neighbors = this.getNeighborCount(row, col);

				if (this.currentGenCells[row][col] === 1) {
					// Alive Cells
					if (neighbors < 2) {
						this.nextGenCells[row][col] = 0;
					} else if (neighbors === 2 || neighbors === 3) {
						this.nextGenCells[row][col] = 1;
					} else if (neighbors > 3) {
						this.nextGenCells[row][col] = 0;
					}
				} else if (this.currentGenCells[row][col] === 0) {
					//  Dead Cells
					if (neighbors === 3) {
						this.nextGenCells[row][col] = 1;
					}
				}
			}
		}
	}

	reformCurrGenerationArr() {
		for (const row in this.currentGenCells) {
			for (const col in this.currentGenCells[row]) {
				this.currentGenCells[row][col] = this.nextGenCells[row][col];
				this.nextGenCells[row][col] = 0;
			}
		}
	}

	reformCellsStatus() {
		for (const row in this.currentGenCells) {
			for (const col in this.currentGenCells[row]) {
				const cell = document.getElementById(`${row}_${col}`);
				if (cell) {
					cell.className =
						this.currentGenCells[row][col] === 0 ? this.dead : this.alive;
				}
			}
		}
	}
	/* SETUP EVOLUTION EVENTS */
	evolveCells() {
		if (this.Cells) {
			this.createNextGenerationArr();
			this.reformCurrGenerationArr();
			this.reformCellsStatus();
		}

		if (this.EVOLVING)
			this.TIMER_ID = setTimeout(() => this.evolveCells(), this.timerSpeed);
	}

	startEvolve() {
		this.EVOLVING = true;
		this.evolveBtn.innerText = "Stop";
		this.evolveBtn.title = "Pause alive cells evolution";
		this.evolveCells();

		if (!this.createBtn.disabled) this.createBtn.disabled = true;
		if (this.speedInput.disabled) this.speedInput.disabled = false;
	}

	stopEvolve() {
		this.EVOLVING = false;
		this.evolveBtn.innerText = "Evolve";
		this.evolveBtn.title = "Start alive cells evolution";
		clearTimeout(this.TIMER_ID);
	}

	evolveBtnClick() {
		// Toggle the evolve/stop of cell generation
		if (!this.EVOLVING) {
			this.startEvolve();
			return;
		}

		this.stopEvolve();
	}

	resetBtnClick() {
		this.intro.style.display = "block";

		this.Cells.forEach((el) => {
			const cellStatus = el.id.split("_");
			const row = Number(cellStatus[0]);
			const col = Number(cellStatus[1]);

			el.className = this.dead;
			this.currentGenCells[row][col] = 0;
		});

		if (this.EVOLVING) this.stopEvolve();

		if (this.createBtn.disabled) this.createBtn.disabled = false;
		if (!this.speedInput.disabled) this.speedInput.disabled = true;

		this.disableStartAndResetBtns();
	}
	/* RANDOM CELL GENERATION BEFORE EVOLUTION */
	createBtnClick() {
		this.enableStartAndResetBtns();

		// Check if there's already alive cells and kill them if so
		for (let i = 0; i < this.Rows; i++) {
			if (this.currentGenCells[i].includes(1)) {
				this.ALIVE = true;

				if (this.ALIVE) {
					this.ALIVE = false;
					this.resetBtnClick();
					this.enableStartAndResetBtns();
				}
			}
		}

		this.hideIntro();

		// Generate random alive cells
		const totalCells = this.Cells.length;
		const maxCells = totalCells * 0.35;

		const uniqueSet = new Set();
		while (uniqueSet.size < maxCells) {
			const random = Math.floor(Math.random() * totalCells);
			uniqueSet.add(random);

			this.Cells.forEach((el, i) => {
				const cellStatus = el.id.split("_");
				const row = Number(cellStatus[0]);
				const col = Number(cellStatus[1]);

				if (i === random) {
					el.className = this.alive;
					this.currentGenCells[row][col] = 1;
				}
			});
		}
	}

	randomlyPopulateGrid() {
        if (this.Cells) {
            for (let i = 0; i < this.Rows; i++) {
                for (let j = 0; j < this.Cols; j++) {
                    if (Math.random() > 0.6){
                        const random = Math.floor(Math.random() * 2);
                        if (random === 1) {
                            this.Cells[i * this.Cols + j].classList.add(this.alive);
                            this.currentGenCells[i][j] = 1;
                        }
                    }
                }
            }
        }
    }


    addeventListeners() {
        // Intialize grid with random cells
        this.createBtn.addEventListener("click", () => {
            this.resetEntireGrid();
            this.randomlyPopulateGrid();
        });
    }

	/* AESTHETICS */
	gridBtnClick(e) {
		const btn = e.currentTarget;
		const container = this.container;

		if (container.dataset.grid === "on") {
			container.dataset.grid = "off";
			btn.textContent = "Grid on";
		} else {
			container.dataset.grid = "on";
			btn.textContent = "Grid off";
		}
	}

	CSSVars(el, bg, base) {
		this.root.style.setProperty("--c_bg", bg);

		// If black/white color is/was-last selected, replace color base
		if (this.controls.dataset.hue === "06")
			this.root.style.setProperty("--c_base", base);
	}

	modeBtnClick(e) {
		const btn = e.currentTarget;
		const bwColor = document.querySelector('[data-color="06"]');

		const cWhite = "var(--c_06)";
		const cBlack = "var(--c_07)";

		if (this.dBody.dataset.mode === "dark") {
			// Light mode
			this.dBody.dataset.mode = "light";
			btn.textContent = "Dark mode";
			bwColor.title = "Black cells";

			this.CSSVars(bwColor, cWhite, cBlack);
		} else {
			// Dark mode
			this.dBody.dataset.mode = "dark";
			btn.textContent = "Light mode";
			bwColor.title = "White cells";

			this.CSSVars(bwColor, cBlack, cWhite);
		}
	}

	resetAllInputRadios(all) {
		all.forEach((el) => {
			const input = el.querySelector("input");
			input.removeAttribute("checked");
			input.checked = false;
		});
	}

	checkInputRadio(el) {
		const input = el.querySelector("input");
		input.setAttribute("checked", "checked");
		input.checked = true;
	}

	shapeBtnsClick(e) {
		this.resetAllInputRadios(this.shapeBtns);

		// Apply input radio selected rules
		const btn = e.currentTarget;
		this.checkInputRadio(btn);

		const container = this.container;
		const gridType = btn.dataset.type;
		container.dataset.shape = gridType;

		const controls = this.controls;
		controls.dataset.form = gridType;
	}

	colorBtnsClick(e) {
		this.resetAllInputRadios(this.colorBtns);

		// Apply input radio selected rules
		const btn = e.currentTarget;
		this.checkInputRadio(btn);

		const colorPrefix = btn.dataset.color;

		// Add data attribute to style cell's emojis
		if (colorPrefix === "emoji") this.container.dataset.td = "emoji";

		// Add color prefix only if real color
		if (colorPrefix !== "emoji") {
			this.container.dataset.td = "color";
			this.controls.dataset.hue = colorPrefix;
		}

		if (this.dBody.dataset.mode === "light") {
			// Light mode
			if (colorPrefix !== "emoji") {
				if (colorPrefix === "06") {
					this.root.style.setProperty("--c_base", "var(--c_07)");
				} else {
					this.root.style.setProperty("--c_base", `var(--c_${colorPrefix})`);
				}
			}
		} else {
			// Dark mode
			if (colorPrefix !== "emoji")
				this.root.style.setProperty("--c_base", `var(--c_${colorPrefix})`);
		}
	}

	textInputChange(e) {
		const input = e.currentTarget;
		const inputVal = input.value;

		this.root.style.setProperty("--c_emoji", `"${inputVal}"`);
	}

	speedRangeChange(e) {
		const range = e.currentTarget;
		const rangeVal = range.querySelector("input").value;
		const rangeNr = Number(rangeVal);

		this.timerSpeed = rangeNr;
	}
	/* RESTART GOL AND RECREATE GRID WHEN RESIZED */
	resize() {
		this.resetBtnClick();
		this.createSetup();
	}

	addWindowEvents() {
		window.addEventListener("resize", this.resize.bind(this));
	}
	/* ALL CLICK EVENTS */
	addEvents() {
		this.createBtn.addEventListener("click", this.createBtnClick.bind(this));
		this.evolveBtn.addEventListener("click", this.evolveBtnClick.bind(this));
		this.resetBtn.addEventListener("click", this.resetBtnClick.bind(this));
		this.gridBtn.addEventListener("click", this.gridBtnClick.bind(this));
		this.modeBtn.addEventListener("click", this.modeBtnClick.bind(this));

		this.shapeBtns.forEach((el) =>
			el.addEventListener("click", this.shapeBtnsClick.bind(this))
		);
		this.colorBtns.forEach((el) =>
			el.addEventListener("click", this.colorBtnsClick.bind(this))
		);

		this.textInput.addEventListener("keyup", this.textInputChange.bind(this));
		this.speedRange.addEventListener("change", this.speedRangeChange.bind(this));
	}
}

const gol = document.querySelector("#gameoflife");
new GameOfLife(gol);
