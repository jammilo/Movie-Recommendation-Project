$(document).ready(function() {
    console.log("Page Loaded");

    $("#filter").click(function() {
        makePredictions();
    });

    $("#movie_name").on("input", function() {
        getMoviesList();
    });

    $("#rldata2").on("click", function() {
        getRecDetails2();
    });


});

function getRecDetails2() {
    var rec_name = $("#rldata2").html();
    console.log(rec_name)
    var payload = {
        "rec_name": rec_name
    }

    $.ajax({
        type: "POST",
        url: "/getRecDetails",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(returnedData) {
            // print it
            console.log(returnedData);

            var tbody = $("#recommendations_info>tbody");

            tbody.empty();
            returnedData.forEach(function(row) {

                var newRow = `<tr>`
                    // loop through each Object (dictionary)
                Object.entries(row).forEach(function([key, value]) {

                    // set the cell data
                    newRow += `<td value="${value}">${value}</td>`;

                });

                //append to table
                newRow += "</tr>";
                tbody.append(newRow);

            });


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        },
    });
}

function getMoviesList() {
    var movie_name = $("#movie_name").val();

    var payload = {
        "movie_name": movie_name
    }

    $.ajax({
        type: "POST",
        url: "/getMoviesList",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(returnedData) {
            // print it
            console.log(returnedData);
            returnedData = returnedData.moviesList
            var tbody = $("#movie_list>tbody");

            tbody.empty();
            moviesList_values = []
            counter = 0
            returnedData.forEach(function(row) {

                var newRow = `<tr>`
                    // loop through each Object (dictionary)
                Object.entries(row).forEach(function([key, value]) {

                    counter += 1
                        // set the cell data
                    newRow += `<td id="mldata${counter}" value="${value}">${value}</td>`;
                    moviesList_values.push(value)
                });

                //append to table
                newRow += "</tr>";
                tbody.append(newRow);

            });
            $("#mldata1").on("click", function() {
                $("#movie_name").empty();
                console.log($("#movie_name").val());
                console.log(moviesList_values);
                $("#movie_name").val(moviesList_values[0]);
            });
            $("#mldata3").on("click", function() {
                $("#movie_name").empty();
                console.log($("#movie_name").val());
                console.log(moviesList_values);
                $("#movie_name").val(moviesList_values[2]);
            });
            $("#mldata5").on("click", function() {
                $("#movie_name").empty();
                console.log($("#movie_name").val());
                console.log(moviesList_values);
                $("#movie_name").val(moviesList_values[4]);
            });
            $("#mldata7").on("click", function() {
                $("#movie_name").empty();
                console.log($("#movie_name").val());
                console.log(moviesList_values);
                $("#movie_name").val(moviesList_values[6]);
            });
            $("#mldata9").on("click", function() {
                $("#movie_name").empty();
                console.log($("#movie_name").val());
                console.log(moviesList_values);
                $("#movie_name").val(moviesList_values[8]);
            });
            // $("#movie_list").text(returnedData["moviesList"])
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}


// call Flask API endpoint
function makePredictions() {
    var movie_name = $("#movie_name").val();
    var obscure = $("#obscure").val();
    var number_recs = $("#number_recs").val();


    // create the payload
    var payload = {
        "movie_name": movie_name,
        "obscure": obscure,
        "number_recs": number_recs
    }

    console.log(payload)

    // Perform a POST request to the query URL
    $.ajax({
        type: "POST",
        url: "/makePredictions",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(returnedData) {
            // print it
            console.log(returnedData);
            returnedData = returnedData.prediction
            var thead = $("#recommendations_list>thead");
            var tbody = $("#recommendations_list>tbody");
            thead.empty();
            tbody.empty();
            headerRow = "<tr><th class='table-head'>Rx Score</th><th class='table-head'>Title (year)</th></tr>";
            thead.append(headerRow);
            recommendationsList_values = []
            counter = 0
            returnedData.forEach(function(row) {

                var newRow = `<tr>`
                    // loop through each Object (dictionary)
                Object.entries(row).forEach(function([key, value]) {

                    counter += 1
                        // set the cell data
                    newRow += `<td id="rldata${counter}" value="${value}">${value}</td>`;
                    recommendationsList_values.push(value)
                });

                //append to table
                newRow += "</tr>";
                tbody.append(newRow);

            });
            console.log(recommendationsList_values);
            $("#rldata2").on("click", function() {
                getRecDetails2();
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}