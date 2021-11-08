function seed() {
  return [...arguments]
}

function same([x, y], [j, k]) {
  if(arguments[0][0] == arguments[1][0] && arguments[0][1] == arguments[1][1]){
    return true
  }else{
    return false
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(c => same(c, cell));
}

const printCell = (cell, state) => {//console.log("print")
  let res = contains.call(state, cell)
  if(res){
    return '\u25A3'
  }else{
    return '\u25A2'
  }
};

const corners = (state = []) => {
  if(state.length == 0){
    return {
      topRight: [0, 0],
      bottomLeft: [0, 0]
    }
  }

  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);
  //console.log([Math.max(...xs), Math.max(...ys)], [Math.min(...xs), Math.min(...ys)])
  return {
    topRight: [Math.max(...xs), Math.max(...ys)],
    bottomLeft: [Math.min(...xs), Math.min(...ys)]
  };
};

const printCells = (state) => {//console.log(state)
  const { bottomLeft, topRight } = corners(state);
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    accumulator += row.join(" ") + "\n";
  }
  return accumulator;
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x-1, y],
    [x+1, y],
    [x+1, y+1],
    [x, y-1],
    [x, y+1],
    [x-1, y-1],
    [x+1, y-1],
    [x-1, y+1]
  ]
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell)
  let livingCells = []
  neighbors.forEach(neighbor=>{

    let newFunc = contains.bind(state)
    if(newFunc(neighbor)){
      livingCells.push(neighbor)
    }
  })
  return livingCells
};

const willBeAlive = (cell, state) => {
  let livingNeighbors = getLivingNeighbors(cell, state)
  let isAlive = contains.call(state, cell)

  if(livingNeighbors.length === 3){
    return true
  }else if(isAlive && livingNeighbors.length === 2){
    return true
  }else{
    return false
  }
};

const calculateNext = (state) => {
  let extents = corners(state)
  //console.log(extents)
  let living = []
  for(let i=extents.bottomLeft[0] - 1; i<=extents.topRight[0]+1; i++){
    for(let j = extents.bottomLeft[1] -1; j<=extents.topRight[1] + 1; j++){
      if(willBeAlive([i, j], state)){
        living.push([i, j])
      }
    }
  }
  return living
};

const iterate = (state, iterations) => {

  let states = [state]
  //states.push(calculateNext(state))
  for(let i=0; i<iterations; i++){
    states.push(calculateNext(states[states.length - 1]))
  }//console.log(states)
  return states
};

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;