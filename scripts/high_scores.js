
let scores = [{"date": "2021/01/17", duration: "3:41"},
              {"date": "2021/01/21", duration: "4:01"},
              {"date": "2021/02/01", duration: "2:52"},
              {"date": "2021/02/17", duration: "3:08"},
              {"date": "2021/03/02", duration: "2:51"}]


window.onload = function() {
    generateScoreboard();
}

/**
 * Dynamically generates the scoreboard using the array of objects, scores
 */
function generateScoreboard() {
    var tableArea = document.getElementById('high_scores');
    let table = document.createElement('scores_table');
    var tbody1 = document.createElement('tbody');
    var tr = document.createElement('tr');
    tr.setAttribute('id', 'header');
    var date = document.createElement('th');
    date.textContent = 'Date';
    var duration = document.createElement('th');
    duration.textContent = 'Duration';
    tr.appendChild(date);
    tr.appendChild(duration);
    tbody1.appendChild(tr);

    // Dynamically adds the scores to the scoreboard using the score array
    for (let i = 0; i < 5; i++) {
        var rowData = document.createElement('tr');
        var dateData = document.createElement('td');
        dateData.textContent = scores[i]['date'];
        var scoreData = document.createElement('td');
        scoreData.textContent = scores[i]['duration'];
        rowData.appendChild(dateData);
        rowData.appendChild(scoreData);
        tbody1.appendChild(rowData);
    }

    table.appendChild(tbody1);
    tableArea.appendChild(table);
    document.body.appendChild(tableArea);
}