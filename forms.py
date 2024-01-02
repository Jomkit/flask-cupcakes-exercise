from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import InputRequired

class AddCupcakeForm(FlaskForm):
    """Form for adding cupcakes"""

    flavor = StringField("Cupcake Flavor",
                         validators=[InputRequired(message='Please describe cupcake flavor')])
    size = StringField("Cupcake Size",
                         validators=[InputRequired(message='Please describe cupcake size')])
    rating = FloatField("Cupcake Rating",
                         validators=[InputRequired(message='Please rate cupcake by deliciousness')])
    image = StringField("Cupcake Image URL",
                         validators=[InputRequired(message='Please provide cupcake image')])