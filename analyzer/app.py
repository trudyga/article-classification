from flask import Flask, request, Response
import json
from identifier import Identifier
from os.path import abspath

app = Flask(__name__)

host = "0.0.0.0"
port = 6000

suicidePath = abspath("../resources/articles/suicide")
generalPath = abspath("../resources/articles/general")

preprocessorEndpoint = 'http://localhost:5000/article'

print(suicidePath, generalPath, preprocessorEndpoint)
suicideIdentifier = Identifier(
    suicidePath, generalPath, preprocessorEndpoint)
suicideIdentifier.train(suicideIdentifier.articleDataFrame)


@app.route('/api/identifier', methods=['GET', 'POST'])
def identifier():
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        pass


@app.route('/api/identifier/suicide', methods=['POST'])
def suicide_identify():
    content = ""
    if (request.form):
        content = request.form
    else:
        content = request.json

    article = content['text']
    print(article)

    vectorizedArticle = suicideIdentifier.vectorizeText(article)
    print('vectorizedArticle', vectorizedArticle)
    svmResult = suicideIdentifier.predictSVM(vectorizedArticle, False)
    svmResultProba = suicideIdentifier.predictSVM(vectorizedArticle, True)
    naiveResult = suicideIdentifier.predictNaive(vectorizedArticle, False)
    naiveResultProba = suicideIdentifier.predictNaive(vectorizedArticle, True)

    print('svmResult', svmResult)
    print('naiveResult', naiveResult)

    prediction = {
        'suicide': {
            'naiveBayesProba': float(naiveResultProba[0][1]),
            'naiveBayes': int(naiveResult[0]) == 1,
            'svm': int(svmResult[0]) == 1,
            'svmProba': float(svmResultProba[0][1])
        }
    }

    result = {'prediction': prediction}
    print(result, json.dumps(result))
    return Response(json.dumps(result), mimetype='application/json')


@app.route('/api/songs', methods=['GET', 'POST'])
def collection():
    if request.method == 'GET':
        pass  # Handle all get requests
    elif request.method == 'POST':
        pass  # handle all POST requests


@app.route('/api/songs/<song_id>', methods=['GET', 'PUT', 'DELETE'])
def resource(sound_id):
    if request.method == 'GET':
        pass  # Handle GET single request
    elif request.method == 'PUT':
        pass  # Handle UPDATE request
    elif request.method == 'DELETE':
        pass  # Handle DELETE request


if __name__ == '__main__':
    app.debug = True
    app.run(host, port)
