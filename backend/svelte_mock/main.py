import flask
import requests

app = flask.Flask(__name__, template_folder="./template/")

@app.get("/")
def index():
    return flask.render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5371, debug=True)
