'use strict';
			
			var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
			
			var game = null;
			var bestScore = 0;
			var scoreDiv = document.getElementById('score');
			var bestScoreDiv = document.getElementById('bestScore');
			var addDiv = document.getElementById('add');
			var endDiv = document.getElementById('end');
			var size = 4;
			var nextId = 1;
			var score = 0;
			
			function initGame() {
			  game = Array(size * size).fill(null); // 4 x 4 grid, represented as an array
			  initBestScore();
			}
			
			function initBestScore() {
			  bestScore = localStorage.getItem('bestScore') || 0;
			  bestScoreDiv.innerHTML = bestScore;
			}
			
			function updateDOM(before, after) {
			  var newElements = getNewElementsDOM(before, after);
			  var existingElements = getExistingElementsDOM(before, after);
			  var mergedTiles = getMergedTiles(after);
			  removeElements(mergedTiles);
			  drawGame(newElements, true);
			  drawGame(existingElements);
			}
			
			function removeElements(mergedTiles) {
			  for (var _iterator = mergedTiles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			    var _ref;
			
			    if (_isArray) {
			      if (_i >= _iterator.length) break;
			      _ref = _iterator[_i++];
			    } else {
			      _i = _iterator.next();
			      if (_i.done) break;
			      _ref = _i.value;
			    }
			
			    var tile = _ref;
			
			    var _loop = function _loop() {
			      if (_isArray2) {
			        if (_i2 >= _iterator2.length) return 'break';
			        _ref2 = _iterator2[_i2++];
			      } else {
			        _i2 = _iterator2.next();
			        if (_i2.done) return 'break';
			        _ref2 = _i2.value;
			      }
			
			      var id = _ref2;
			
			      var currentElm = document.getElementById(id);
			      positionTile(tile, currentElm);
			      currentElm.classList.add('tile--shrink');
			      setTimeout(function () {
			        currentElm.remove();
			      }, 100);
			    };
			
			    for (var _iterator2 = tile.mergedIds, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			      var _ref2;
			
			      var _ret = _loop();
			
			      if (_ret === 'break') break;
			    }
			  }
			}
			
			function getMergedTiles(after) {
			  return after.filter(function (tile) {
			    return tile && tile.mergedIds;
			  });
			}
			
			function getNewElementsDOM(before, after) {
			  var beforeIds = before.filter(function (tile) {
			    return tile;
			  }).map(function (tile) {
			    return tile.id;
			  });
			  var newElements = after.filter(function (tile) {
			    return tile && beforeIds.indexOf(tile.id) === -1;
			  });
			  return newElements;
			}
			
			function getExistingElementsDOM(before, after) {
			  var beforeIds = before.filter(function (tile) {
			    return tile;
			  }).map(function (tile) {
			    return tile.id;
			  });
			  var existingElements = after.filter(function (tile) {
			    return tile && beforeIds.indexOf(tile.id) !== -1;
			  });
			  return existingElements;
			}
			
			function drawBackground() {
			  var tileContainer = document.getElementById('tile-container');
			  tileContainer.innerHTML = '';
			  for (var i = 0; i < game.length; i++) {
			    var tile = game[i];
			    var tileDiv = document.createElement('div');
			    var x = i % size;
			    var y = Math.floor(i / size);
			    tileDiv.style.top = y * 67.5 + 'px';
			    tileDiv.style.left = x * 67.5 + 'px';
			
			    tileDiv.classList.add("background");
			    tileContainer.appendChild(tileDiv);
			  }
			}
			
			function positionTile(tile, elm) {
			  var x = tile.index % size;
			  var y = Math.floor(tile.index / size);
			  elm.style.top = y * 67.5 + 'px';
			  elm.style.left = x * 67.5 + 'px';
			}
			
			function drawGame(tiles, isNew) {
			  var tileContainer = document.getElementById('tile-container');
			  for (var i = 0; i < tiles.length; i++) {
			    var tile = tiles[i];
			    if (tile) {
			      if (isNew) {
			        (function () {
			          var tileDiv = document.createElement('div');
			          positionTile(tile, tileDiv);
			          tileDiv.classList.add('tile', 'tile--' + tile.value);
			          tileDiv.id = tile.id;
			          setTimeout(function () {
			            tileDiv.classList.add("tile--pop");
			          }, tile.mergedIds ? 1 : 150);
			          tileDiv.innerHTML = '<p>' + tile.value + '</p>';
			          tileContainer.appendChild(tileDiv);
			        })();
			      } else {
			        var currentElement = document.getElementById(tile.id);
			        positionTile(tile, currentElement);
			      }
			    }
			  }
			}
			
			function gameOver() {
			  if (game.filter(function (number) {
			    return number === null;
			  }).length === 0) {
			    var sameNeighbors = game.find(function (tile, i) {
			      var isRightSame = game[i + 1] && (i + 1) % 4 !== 0 ? tile.value === game[i + 1].value : false;
			      var isDownSame = game[i + 4] ? tile.value === game[i + 4].value : false;
			      if (isRightSame || isDownSame) {
			        return true;
			      }
			      return false;
			    });
			    return !sameNeighbors;
			  }
			}
			
			function generateNewNumber() {
			  // 0.9 probability of 2, 0.1 probability of 4
			  var p = Math.random() * 100;
			  return p <= 90 ? 2 : 4;
			}
			
			function addRandomNumber() {
			  // Adds either a 2 or a 4 to an empty position in the game array
			  var emptyCells = game.map(function (_, index) {
			    return index;
			  }).filter(function (index) {
			    return game[index] === null;
			  });
			  if (emptyCells.length === 0) {
			    return;
			  }
			  var newPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
			  var newObj = {
			    id: nextId++,
			    index: newPos,
			    value: generateNewNumber()
			  };
			  game.splice(newPos, 1, newObj);
			}
			
			function getIndexForPoint(x, y) {
			  return y * size + x;
			}
			
			function reflectGrid(grid) {
			  var reflectedGame = Array(size * size).fill(0);
			  for (var row = 0; row < size; row++) {
			    for (var col = 0; col < size; col++) {
			      var index1 = getIndexForPoint(col, row);
			      var index2 = getIndexForPoint(size - col - 1, row);
			      reflectedGame[index1] = grid[index2];
			    }
			  }
			  return reflectedGame;
			}
			
			function rotateLeft90Deg(grid) {
			  var rotatedGame = Array(size * size).fill(0);
			  for (var row = 0; row < size; row++) {
			    for (var col = 0; col < size; col++) {
			      var index1 = getIndexForPoint(col, row);
			      var index2 = getIndexForPoint(size - 1 - row, col);
			      rotatedGame[index1] = grid[index2];
			    }
			  }
			  return rotatedGame;
			}
			
			function rotateRight90Deg(grid) {
			  var rotatedGame = Array(size * size).fill(0);
			  for (var row = 0; row < size; row++) {
			    for (var col = 0; col < size; col++) {
			      var index1 = getIndexForPoint(col, row);
			      var index2 = getIndexForPoint(row, size - 1 - col);
			      rotatedGame[index1] = grid[index2];
			    }
			  }
			  return rotatedGame;
			}
			
			/*
			For any cell whose neighbor to the right is empty, move that cell
			to the right. For any cell whose neighbor to the right is equal
			to the same value, combine the values together (e.g. 2+2 = 4)
			*/
			function shiftGameRight(gameGrid) {
			  // reflect game grid
			  var reflectedGame = reflectGrid(gameGrid);
			  // shift left
			  reflectedGame = shiftGameLeft(reflectedGame);
			  // reflect back
			  return reflectGrid(reflectedGame);
			}
			
			function shiftGameLeft(gameGrid) {
			  var newGameState = [];
			  var totalAdd = 0;
			  // for rows
			  for (var i = 0; i < size; i++) {
			    // for columns
			    var firstPos = 4 * i;
			    var lastPos = size + 4 * i;
			    var currentRow = gameGrid.slice(firstPos, lastPos);
			    var filteredRow = currentRow.filter(function (row) {
			      return row;
			    });
			    for (var _iterator3 = filteredRow, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			      var _ref3;
			
			      if (_isArray3) {
			        if (_i3 >= _iterator3.length) break;
			        _ref3 = _iterator3[_i3++];
			      } else {
			        _i3 = _iterator3.next();
			        if (_i3.done) break;
			        _ref3 = _i3.value;
			      }
			
			      var row = _ref3;
			
			      delete row.mergedIds;
			    }
			
			    for (var j = 0; j < filteredRow.length - 1; j++) {
			      if (filteredRow[j].value === filteredRow[j + 1].value) {
			        var sum = filteredRow[j].value * 2;
			        filteredRow[j] = {
			          id: nextId++,
			          mergedIds: [filteredRow[j].id, filteredRow[j + 1].id],
			          value: sum
			        };
			        filteredRow.splice(j + 1, 1);
			        score += sum;
			        totalAdd += sum;
			      }
			    }
			    while (filteredRow.length < size) {
			      filteredRow.push(null);
			    };
			    newGameState = [].concat(newGameState, filteredRow);
			  }
			
			  if (totalAdd > 0) {
			    scoreDiv.innerHTML = score;
			    addDiv.innerHTML = '+' + totalAdd;
			    addDiv.classList.add('active');
			    setTimeout(function () {
			      addDiv.classList.remove("active");
			    }, 800);
			    if (score > bestScore) {
			      localStorage.setItem('bestScore', score);
			      initBestScore();
			    }
			  }
			  return newGameState;
			}
			
			function shiftGameUp(gameGrid) {
			  var rotatedGame = rotateLeft90Deg(gameGrid);
			  rotatedGame = shiftGameLeft(rotatedGame);
			  return rotateRight90Deg(rotatedGame);
			}
			
			function shiftGameDown(gameGrid) {
			  var rotatedGame = rotateRight90Deg(gameGrid);
			  rotatedGame = shiftGameLeft(rotatedGame);
			  return rotateLeft90Deg(rotatedGame);
			}
			
			var buttons = document.querySelectorAll(".js-restart-btn");
			var length = buttons.length;
			for (var i = 0; i < length; i++) {
			  if (document.addEventListener) {
			    buttons[i].addEventListener("click", function () {
			      newGameStart();
			    });
			  } else {
			    buttons[i].attachEvent("onclick", function () {
			      newGameStart();
			    });
			  };
			};
			
			document.addEventListener("keydown", handleKeypress);
			document.addEventListener('touchstart', handleTouchStart, false);
			document.addEventListener('touchmove', handleTouchMove, false);
			
			var xDown = null;
			var yDown = null;
			
			function handleTouchStart(evt) {
			  xDown = evt.touches[0].clientX;
			  yDown = evt.touches[0].clientY;
			};
			
			function handleTouchMove(evt) {
			  var prevGame = [].concat(game);
			  if (!xDown || !yDown) {
			    return;
			  }
			  var xUp = evt.touches[0].clientX;
			  var yUp = evt.touches[0].clientY;
			
			  var xDiff = xDown - xUp;
			  var yDiff = yDown - yUp;
			
			  if (Math.abs(xDiff) > Math.abs(yDiff)) {
			    if (xDiff > 0) {
			      game = shiftGameLeft(game);
			    } else {
			      game = shiftGameRight(game);
			    }
			  } else {
			    if (yDiff > 0) {
			      game = shiftGameUp(game);
			    } else {
			      game = shiftGameDown(game);
			    }
			  }
			  game = game.map(function (tile, index) {
			    if (tile) {
			      return _extends({}, tile, {
			        index: index
			      });
			    } else {
			      return null;
			    }
			  });
			  addRandomNumber();
			  updateDOM(prevGame, game);
			  if (gameOver()) {
			    setTimeout(function () {
			      endDiv.classList.add('active');
			    }, 800);
			    return;
			  }
			  xDown = null;
			  yDown = null;
			};
			
			function handleKeypress(evt) {
			  var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
			  var whichKey = event.which;
			
			  var prevGame = [].concat(game);
			
			  if (!modifiers) {
			    event.preventDefault();
			    switch (whichKey) {
			      case 37:
			        game = shiftGameLeft(game);
			        break;
			      case 38:
			        game = shiftGameUp(game);
			        break;
			      case 39:
			        game = shiftGameRight(game);
			        break;
			      case 40:
			        game = shiftGameDown(game);
			        break;
			    }
			    game = game.map(function (tile, index) {
			      if (tile) {
			        return _extends({}, tile, {
			          index: index
			        });
			      } else {
			        return null;
			      }
			    });
			    addRandomNumber();
			    updateDOM(prevGame, game);
			    if (gameOver()) {
			      setTimeout(function () {
			        endDiv.classList.add('active');
			      }, 800);
			      return;
			    }
			  }
			}
			
			function newGameStart() {
			  document.getElementById('tile-container').innerHTML = '';
			  endDiv.classList.remove('active');
			  score = 0;
			  scoreDiv.innerHTML = score;
			  initGame();
			  drawBackground();
			  var previousGame = [].concat(game);
			  addRandomNumber();
			  addRandomNumber();
			  updateDOM(previousGame, game);
			}
			
			newGameStart();