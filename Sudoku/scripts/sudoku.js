
var selectedCell, selectedDigit, disableSelect = null;
var moves = new Array();
var errors = new Array();
var error_count = 0;

let board_pieces = [[-1,1,-1,-1,-1,-1,-1,9,-1],
                    [-1,-1,4,-1,-1,-1,2,-1,-1],
                    [-1,-1,8,-1,-1,5,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,3,-1],
                    [2,-1,-1,-1,4,-1,1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,1,8,-1,-1,6,-1,-1],
                    [-1,3,-1,-1,-1,-1,-1,8,-1],
                    [-1,-1,6,-1,-1,-1,-1,-1,-1]];

window.onload = function() {
    generateBoard();
    generatePalette()
}

/**
 * Dynamically generates board using preexisting board stored in board_pieces
 */
function generateBoard(){
    var tableArea = document.getElementById('board');
    let table = document.createElement('table');
    // Creates colgroups to format the board table
    for (let k = 0; k < 3; k++) {
        let colgroup = document.createElement('colgroup');
        for (let l = 0; l < 3; l++) {
            let col = document.createElement('col');
            colgroup.appendChild(col);
        }   
        table.prepend(colgroup);
    }

    // Creates the board
    for (var i = 0; i < 9; i++) {
        if (i == 0 | i == 3 | i == 6) {
            var tbody = document.createElement('tbody');
        }
        var tr = document.createElement('tr');
        
        // Creates cells of the board
        for (var j = 0; j < 9; j++) {
            var td = document.createElement('td');
            var cellName = 'cell' + i + j;
            td.setAttribute('id', cellName);
            td.classList.add('cell');
            if (board_pieces[i][j] !=  -1){
                td.textContent = board_pieces[i][j];
            }
            else {
                td.addEventListener('click', selectCell);
            }      
            tr.appendChild(td)     
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
    }

    tableArea.appendChild(table);
    document.body.append(tableArea);
    let linebreak = document.createElement("br");
    document.body.append(linebreak);
}

/**
 * Generates the number palette
 */
function generatePalette(){
    var tableArea = document.getElementById('palette');
    let table = document.createElement('table');
    var tr = document.createElement('tr');
    // Creates the board
    for (let i = 1; i <= 10; i++) {
        var td = document.createElement('td');
        // Creates the number cell
        if (i != 10){
            td.textContent = i;
            td.setAttribute('name', i);
        }
        // Creates the back button
        if (i == 10){
            let img = document.createElement('img');
            img.src = 'images/undo.png';
            td.appendChild(img);
            td.setAttribute('id', 'back');
        }
        tr.appendChild(td);
        td.addEventListener('click', selectDigit);
        td.classList.add('digit');
    }
    table.appendChild(tr);
    tableArea.appendChild(table);
    document.body.append(tableArea);
}

/**
 * Handles when the user selects a cell from the game board
 */
function selectCell() {
    // If there is an error, prevents the user from selecting anything other than the back button
    if (disableSelect == true){
        return;
    }
    // Removes previously selected cell from the user-input class
    if (selectedCell != null) {
        selectedCell.classList.remove('user-input');
    }
    // Deselects cell if a selected cell is selected again
    if (selectedCell == this){
        selectedCell = null;
        return;
    }
    // Updates selectedCell
    selectedCell = this;
    selectedCell.classList.add('user-input')
    addDigit();
}

/**
 * Handles when the user selects a cell from the number palette
 */
function selectDigit() {
    // If there is an error, prevents the user from selecting anything other than the back button
    if (disableSelect == true && this.getAttribute('id') != 'back'){
        return;
    }
    // Removes previously selected digit from the user-input class
    if (selectedDigit != null) {
        selectedDigit.classList.remove('user-input');
    }
    // Deselects cell if a selected digit is selected again
    if (selectedDigit == this){
        selectedDigit = null;
        return;
    }

    // Updates selectedDigit
    selectedDigit = this;
    selectedDigit.setAttribute('id', this.getAttribute('id'));   
    selectedDigit.classList.add('user-input');
    
    if (selectedDigit.getAttribute('id') == 'back'){
        goBack();
    }
    else {
        addDigit();
    }
}

/**
 * Handles when user clicks the go back button in the number palette
 */
function goBack() {  
    // Does nothing if there are no moves  
    if (moves.length < 1){
        selectedDigit.classList.remove('user-input');
        return;
    }
    // Undos last move
    var cell = document.getElementById(moves.slice(-1));
    cell.textContent = null;

    // Removes from error class if last move was an error
    if (selectedCell){
        if (selectedCell.classList.contains('error')) {
            selectedCell.classList.remove('error');
            for (let i = 0; i <= errors.length; i++) {
                var error = document.getElementById(errors.pop());
                console.log('error', error);
                error.classList.remove('error');
                
            }
        }
    }
    moves.pop();

    error_count = 0;
    selectedDigit.classList.remove('user-input');
    selectedDigit = null;
    selectedCell = null;
    disableSelect = false;
}

/**
 * Adds user selected digit to the game board
 */
function addDigit() {
    if (selectedCell != null && selectedDigit != null){
        selectedCell.textContent = selectedDigit.textContent;
        moves.push(selectedCell.getAttribute('id'));
        // Checks if the added digit causes an error
        if (isError()) {
            selectedCell.classList.add('error');
            selectedCell.classList.remove('user-input');
            selectedDigit.classList.remove('user-input');
            return;
        }

        selectedCell.classList.remove('user-input');
        selectedDigit.classList.remove('user-input');
        selectedCell = null;
        selectedDigit = null;
    }

}

/**
 * Checks if the digit added to the board causes an error
 */
function isError() {
    if (checkRow() == false | checkColumn() == false | checkBox() == false){
        disableSelect = true;
        return true;
    }
    else {
        disableSelect = false;
        return false;
    }
}

/**
 * Checks the board row for an error
 */
function checkRow() {
    const rowSet = new Set();
    var rowName = selectedCell.getAttribute('id');
    const row = rowName.charAt(4);
    const column = rowName.charAt(5);
    for (let j = 0; j < 9; j++) {
        var cellName = 'cell' + row + j;
        // Adds each value in the row that the recently added digit is in to a set
        if (document.getElementById(cellName).textContent != null && j != column){
            rowSet.add(document.getElementById(cellName).textContent);
        }
        // Checks the set values for the value of the selectedDigit
        if (rowSet.has(selectedDigit.textContent)) {
            document.getElementById(cellName).classList.add('error');
            // Keeps track of error using errors array
            if (!errors.includes(document.getElementById(cellName).getAttribute('id'))){
                errors.push(document.getElementById(cellName).getAttribute('id'));
                error_count += 1;
            }
            return false;
        }
    }
    rowSet.clear();
    return true;
}

/**
 * Checks the game board column for an error
 */
function checkColumn() {
    const colSet = new Set();
    var colName = selectedCell.getAttribute('id');
    const row = colName.charAt(4);
    const column = colName.charAt(5);
    for (let i = 0; i < 9; i++) {
        var cellName = 'cell' + i + column;
        // Adds each value in the column that the recently added digit is in to a set
        if (document.getElementById(cellName).textContent != null && i != row){
            colSet.add(document.getElementById(cellName).textContent);
        }
        // Checks the set values for the value of the selectedDigit
        if (colSet.has(selectedDigit.textContent)) {
            document.getElementById(cellName).classList.add('error');
            // Keeps track of error using errors array
            if (!errors.includes(document.getElementById(cellName).getAttribute('id'))){
                errors.push(document.getElementById(cellName).getAttribute('id'));
                error_count += 1;
            }
            return false;
        }     
    }
    colSet.clear();
    return true;
}

/**
 * Checks the 3x3 block the added digit is in for an error
 */
function checkBox() {
    var cellID = selectedCell.getAttribute('id');
    const row = cellID.charAt(4);
    const column = cellID.charAt(5);
    // Calculating the index of the first row and column of the block that the recently added digit is in
    let firstRow = Math.floor(row / 3) * 3;
    let firstCol = Math.floor(column / 3) * 3;
    const boxSet = new Set();
    for (let i = firstRow; i < firstRow+3; i++) {   
        for (let j = firstCol; j < firstCol+3; j++) {
            var cellName = 'cell' + i + j;
            const boxCharacter = document.getElementById(cellName).textContent;
            var skipCurrent = ((i == row) && (j == column));
            // Adds each value in the block that the recently added digit is in to a set
            if (boxCharacter != '' && !skipCurrent) {
                boxSet.add(document.getElementById(cellName).textContent);
                if (boxSet.has(document.getElementById(cellID).textContent)) {
                    document.getElementById(cellName).classList.add('error');
                    // Keeps track of error using errors array
                    if (!errors.includes(document.getElementById(cellName).getAttribute('id'))){
                        errors.push(document.getElementById(cellName).getAttribute('id'));
                        error_count += 1;
                    }
                    return false;
                }
            }
        }
    }
    boxSet.clear();
    return true;
}