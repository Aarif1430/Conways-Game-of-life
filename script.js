
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




		this.currentGenCells = [];
		this.nextGenCells = [];

		this.dead = "is-dead";
		this.alive = "is-alive";

		// Start App
		this.createSetup();
	
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
	}










}

const gol = document.querySelector("#gameoflife");
new GameOfLife(gol);
