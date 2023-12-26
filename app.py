"""Flask app for Cupcakes"""
from flask import Flask, request, render_template, jsonify
from models import db, connect_db, Cupcake  
from SECRET import SECRET_KEY

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = SECRET_KEY

connect_db(app)