import geventwebsocket
from engineio.async_drivers import gevent
from flask import Flask, redirect, render_template
import json
from flask_socketio import SocketIO, send, emit
from donationalerts_api import DonationAlertsApi

appVer = "1.0"

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecret"
socketio = SocketIO(app)

user_id = None
at = None
user_token = None

api = DonationAlertsApi("7164", "hXa1nr4B4OljxauOvajgrWW0FPGuOZKueg3o28eO", "http://127.0.0.1:5000/login", "oauth-user-show%20oauth-donation-subscribe%20oauth-donation-index")

print(f"Приветствую в HesusCounter {appVer}. Откройте браузер и перейдите по http://localhost:5000/")

@app.route ("/", methods = ["get"])
def index():
    return redirect(api.login())


@app.route ("/login", methods = ["get"])
def login():
    code = api.getCode()
    global at 
    at = api.getAccessToken(code)
    user = api.getUser(at)
    global user_token 
    user_token = user["socket_connection_token"]
    global user_id 
    user_id = user["id"]
    return redirect("/widget")


@app.route ("/widget")
def widget():
    return render_template("index.html", user_token = user_token, user_id = user_id)


@socketio.on("message")
def handleMessage(msg):
    msg = json.loads(msg)
    if msg["id"] == 1:
        ObtainingConnectionToken = api.ObtainingConnectionTokens(user_id, msg["result"]["client"], at)
        send(ObtainingConnectionToken, broadcast=True)


@socketio.on('connect')
def connect():
    print("Клиент подключен")


@socketio.on('disconnect')
def disconnect():
    print("Клиент отключен")


if __name__ == "__main__":
    try:
        socketio.run(app)
    except KeyboardInterrupt:
        pass