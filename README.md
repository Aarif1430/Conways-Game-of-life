# Game of life by Conway
 
  
Rules:
1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

* Steps to add scss styke  file in your project
 npm init
 npm i sass --save
 Add {"sass": "sass --watch sass/style.scss:css/style.css"} in pacakge.josn
 create two folders scss and css
#Add style.scss in sass folder, then run
  npm run sass