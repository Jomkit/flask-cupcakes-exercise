from flask import Flask, request, render_template, jsonify
from models import db, connect_db, Cupcake 
from forms import CupcakeForm 
from SECRET import SECRET_KEY

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = SECRET_KEY

connect_db(app)

@app.route('/')
def home():
    form = CupcakeForm()
    
    
    return render_template('home.html', form=form)

##############API ROUTES#################

@app.route('/api/cupcakes')
def list_cupcakes():
    """Get all cupcakes and jsonify them"""
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)

@app.route('/api/cupcakes/search')
def search_cupcakes():
    """
    Get route, search for cupcakes based on a string
    
    Don't need to error handle empty string thanks to 
    the wildcard in the regex passed to ilike SQL operator
    below
    """
    term = request.args.get('term')
    filtered_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.filter(Cupcake.flavor.ilike(f'%{term}%'))]

    return jsonify(cupcakes=filtered_cupcakes)

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

@app.route('/api/cupcakes/<int:id>', methods=["PATCH"])
def update_cupcake(id):
    """
    get and update cookie
    404 if cookie not found
    We can assume all fields will be filled
    """
    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = request.json["flavor"]
    cupcake.size = request.json["size"]
    cupcake.rating = request.json["rating"]
    cupcake.image = request.json["image"]

    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()))

@app.route('/api/cupcakes/<int:id>', methods=["DELETE"])
def delete_cupcake(id):
    """
    Get and delete cookie
    404 if cookie not found
    """

    cupcake = Cupcake.query.get_or_404(id)

    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message='Deleted')