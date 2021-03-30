$(document).ready(function() {
    console.log("Page Loaded");

    $("#filter").click(function() {
        makePredictions();
    });

    $("#movie_name").on("input", function() {
        getMoviesList();
    });

});

function getRecDetails2(rec_name) {
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
            console.log("success");
            var poster_spot = $("#poster_image")
            var tbody = $("#recommendations_info>tbody");
            poster_spot.empty();
            poster_spot.append(`<img src="${returnedData["rec_details"][0]}" class="card-img-top img-responsive w-100">`)
            tbody.empty();
            tbody.append(`<tr><td>${returnedData["rec_details"][1]}</td></tr>`);
            tbody.append(`<tr><td>${returnedData["rec_details"][2]} | ${returnedData["rec_details"][3]}</td></tr>`);
            tbody.append(`<tr><td>${returnedData["rec_details"][4]}</td></tr>`);
            tbody.append(`<tr><td>${returnedData["rec_details"][5]}</td></tr>`);
            tbody.append(`<tr><td>Stream at: ${returnedData["rec_details"][6]}</td></tr>`);
            tbody.append(`<tr><td>Rent at: ${returnedData["rec_details"][7]}</td></tr>`);
            tbody.append(`<tr><td>Buy at: ${returnedData["rec_details"][8]}</td></tr>`);
            tbody.append(`<tr><td>Powered by <a href="https://www.themoviedb.org/"> <img class="w3-image" src="/static/images/blue_long_tmdb.svg" width="200"></a></td></tr>`);
            $("#recresult_modal").modal("show");

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
    var obscure = $("#obscure").prop('checked');
    // var number_recs = $("#number_recs").val();
    var tbody = $("#movie_list>tbody");
    tbody.empty();

    // create the payload
    var payload = {
        "movie_name": movie_name,
        "obscure": obscure,
        // "number_recs": number_recs
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
            headerRow = "<tr><th class='table-head'>Rx Score</th><th class='table-head'><i>Click to learn more</i></th></tr>";
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
            $("#rldata2").on("click", function() {
                var rec_name = $("#rldata2").html();
                getRecDetails2(rec_name);
            });
            $("#rldata4").on("click", function() {
                var rec_name = $("#rldata4").html();
                getRecDetails2(rec_name);
            });
            $("#rldata6").on("click", function() {
                var rec_name = $("#rldata6").html();
                getRecDetails2(rec_name);
            });
            $("#rldata8").on("click", function() {
                var rec_name = $("#rldata8").html();
                getRecDetails2(rec_name);
            });
            $("#rldata10").on("click", function() {
                var rec_name = $("#rldata10").html();
                getRecDetails2(rec_name);
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}