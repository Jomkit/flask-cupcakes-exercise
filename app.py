from flask import Flask, request, render_template, jsonify
from models import db, connect_db, Cupcake  
from SECRET import SECRET_KEY

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = SECRET_KEY

connect_db(app)

@app.route('/')
def home():
    cupcakes = Cupcake.query.all()
    return render_template('home.html',cupcakes=cupcakes)

@app.route('/api/cupcakes')
def list_cupcakes():
    """Get all cupcakes and jsonify them"""
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)

@app.route('/api/cupcakes/<int:id>')
def get_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)
    
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes', methods=["POST"])
def create_cupcake():
    """
    Create a new cupcake
    return 201 and JSON {cupcake: {id, flavor, size, rating, image}}
    """
    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json.get("image")
    
    new_cupcake = Cupcake(flavor=flavor,size=size,rating=rating,image=image)
    
    
    db.session.add(new_cupcake)
    db.session.commit()
    cupcake_serialized = new_cupcake.serialize()
    
    return (jsonify(cupcake=cupcake_serialized), 201)