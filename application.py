from flask import Flask, redirect, render_template, session, url_for
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

"""
img_data = requests.get(image_url).content
with open('image_name.jpg', 'wb') as handler:
    handler.write(img_data)
"""
