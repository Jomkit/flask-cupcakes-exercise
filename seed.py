from models import db, connect_db, Cupcake
from app import app

with app.app_context():
    db.drop_all()
    db.create_all()

    c1 = Cupcake(
        flavor="Cherry",
        size="Large",
        rating=5
    )

    c2 = Cupcake(
        flavor="Chocolate",
        size="Small",
        rating=9,
        image="https://www.bakedbyrachel.com/wp-content/uploads/2018/01/chocolatecupcakesccfrosting1_bakedbyrachel.jpg"
    )

    c3 = Cupcake(
        flavor="Vanilla",
        size="Small",
        rating=9,
        image="https://images.pexels.com/photos/913135/pexels-photo-913135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    )

    c4 = Cupcake(
        flavor="Christmas",
        size="Extra Large",
        rating=6,
        image="https://images.pexels.com/photos/6210755/pexels-photo-6210755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    )

    c5 = Cupcake(
        flavor="Red Velvet",
        size="Small",
        rating=10,
        image="https://images.pexels.com/photos/2525682/pexels-photo-2525682.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    )

    c6 = Cupcake(
        flavor="Cookies & Cream",
        size="Medium",
        rating=10
    )

    c7 = Cupcake(
        flavor="Cactus Juice",
        size="small",
        rating=10,
        image="https://images.pexels.com/photos/9095546/pexels-photo-9095546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    )

    c8 = Cupcake(
        flavor="Blueberry",
        size="small",
        rating=10,
        image="https://images.pexels.com/photos/18955551/pexels-photo-18955551/free-photo-of-a-cupcake-with-blueberry-frosting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    )

    db.session.add_all([c1, c2, c3, c4, c5, c6, c7, c8])
    db.session.commit()