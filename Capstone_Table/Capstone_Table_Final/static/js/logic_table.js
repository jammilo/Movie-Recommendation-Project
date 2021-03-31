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
});

function buildTable() {
    var titleInput = $("#titleInput").val();
    var genreInput = $("#genreInput").val();
    var ratingInput = $("#ratingInput").val();

    d3.csv("static/data/Table_Data.csv").then(function(data) {
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