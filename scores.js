function getScores() {
    //access local storage. Parse JSON string into JS object.
    //Each element of the array will be an object representing one entry in the score table
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
        scores = JSON.parse(scoresText);
    }
    return scores;
}
function getTestScores() {
    let scores = [{name: "TEST", score: 9, date: '9/9/9999'}];
    return scores;
}
function writeScoresToHTML(scores) {
    const tableBodyFromHTML = document.querySelector('#scores');

    if (scores.length) {
        for (const [i, score] of scores.entries()) { //destructuring scores
            //i is the index of each object, score will be an object with all the info for a row in the table
            const positionTableCell = document.createElement('td');
            const nameTableCell = document.createElement('td');
            const scoreTableCell = document.createElement('td');
            const dateTableCell = document.createElement('td');

            positionTableCell.textContent = i + 1;
            nameTableCell.textContent = score.name;
            scoreTableCell.textContent = score.score;
            dateTableCell.textContent = score.date;

            const rowElem = document.createElement('tr');
            rowElem.appendChild(positionTableCell);
            rowElem.appendChild(nameTableCell);
            rowElem.appendChild(scoreTableCell);
            rowElem.appendChild(dateTableCell);

            tableBodyFromHTML.appendChild(rowElem);
        }
    } else {
        tableBodyFromHTML.innerHTML = '<tr><td colSpan = 4> no scores yet </td></tr>'
    }
}

function loadScores() {
    const scores = getScores();
    writeScoresToHTML(scores);
}

loadScores();