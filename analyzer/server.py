from flask import Flask
from identifier import Identifier
app = Flask(__name__)

host = "127.0.0.1"
port = 6000


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/identifier/suicide")
def identifySuicide():
    return Identifier()


if __name__ == "__main__":
    app.run(host, port)
