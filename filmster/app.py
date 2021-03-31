from flask import Flask, render_template, jsonify, send_from_directory, request
import json
import pandas as pd
import numpy as np
import os
from modelHelper import ModelHelper
import requests

#init app and class
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
modelHelper = ModelHelper()

#endpoint
# Favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')

# Route to render recommendor.html template
@app.route("/")
def home():
    # Return template and data
    return render_template("recommendor.html")

@app.route("/makePredictions", methods=["POST"])
def makePredictions():
    content = request.json["data"]
    print(content)
    # parse
    movie_name = str(content["movie_name"])
    obscure = str(content["obscure"])
    number_recs = int(content["number_recs"])

    prediction = modelHelper.makePredictions(movie_name, obscure, number_recs)
    print(prediction)
    return(jsonify({"ok": True, "prediction": json.loads(prediction.to_json(orient='records'))}))

####################################
# ADD MORE ENDPOINTS
@app.route("/getMoviesList", methods=["POST"])
def getMoviesList():
    content = request.json["data"]
    # parse
    movie_name = str(content["movie_name"])
    
    moviesList = modelHelper.getMoviesList(movie_name)
    print(moviesList)
    return(jsonify({"moviesList": json.loads(moviesList.to_json(orient='records'))}))
###########################################
@app.route("/getRecDetails", methods=["POST"])
def getRecDetails():
    content = request.json["data"]
    print(content)
    # parse
    rec_name = str(content["rec_name"])
    
    rec_details_list = modelHelper.getRecDetails(rec_name)
    print(rec_details_list)
    return(jsonify({"rec_details": rec_details_list}))
    #return(jsonify({"rec_details": json.loads(rec_details_list.to_json(orient='records'))}))
#############################################################

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

#main
if __name__ == "__main__":
    app.run(debug=True)