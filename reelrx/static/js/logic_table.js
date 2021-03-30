$(document).ready(function() {
    console.log("page loaded");
    buildTable();

    $("#filter-btn").on("click", function(e) {
        e.preventDefault();
        buildTable();
    });

    $("#form").on("submit", function(e) {
        e.preventDefault();
        buildTable();
    });
    $("#export-btn").on('click', function(event) {

        exportTableToCSV.apply(this, [$('#ufo-table'), 'export.csv']);
        //courtesy of https://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html/16203218

    });
});

function buildTable() {
    var titleInput = $("#titleInput").val();
    var genreInput = $("#genreInput").val();
    var ratingInput = $("#ratingInput").val();

    d3.csv("/static/data/Table_Data.csv").then(function(data) {
        console.log(data);

        var filteredData = data;
        if (titleInput) {
            filteredData = filteredData.filter(row => row.title.includes(titleInput));
        }
        if (genreInput) {
            filteredData = filteredData.filter(row => row.genres.includes(genreInput));
        }

        // if (ratingInput) {
        //     filteredData = filteredData.filter(row => row.rating_avg === ratingInput);
        // }

        // see if we have any data left
        if (filteredData.length === 0) {
            alert("No Data Found!");
        }
        buildTableString(filteredData);
    });

}


function buildTableString(data) {
    var tbody = $("#ufo-table>tbody");
    tbody.empty();
    data.forEach(function(row) {
        var newRow = "<tr>";
        Object.entries(row).forEach(function([key, value]) {
            newRow += `<td>${value}</td>`
        });
        newRow += "</tr>";
        tbody.append(newRow);
    });

}

function exportTableToCSV($table, filename) {

    var $rows = $table.find('tr:has(td),tr:has(th)'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function(i, row) {
            var $row = $(row),
                $cols = $row.find('td,th');

            return $cols.map(function(j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
        .split(tmpRowDelim).join(rowDelim)
        .split(tmpColDelim).join(colDelim) + '"',



        // Data URI
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    console.log(csv);

    if (window.navigator.msSaveBlob) { // IE 10+
        //alert('IE' + csv);
        window.navigator.msSaveOrOpenBlob(new Blob([csv], { type: "text/plain;charset=utf-8;" }), "csvname.csv")
    } else {
        $(this).attr({ 'download': filename, 'href': csvData, 'target': '_blank' });
    }
    //courtesy of https://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html/16203218
}