import os 
from pathlib import Path
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

api = Api(app)


ALLOWED_EXTENSIONS = set(['jpg', 'png','webp'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def read_image():
    image = request.files['file']
    filename = secure_filename(image.filename)
    if allowed_file(filename):
        image_path = "./images/" + filename
        image.save(image_path)

        return image_path
    else:
        return False

def load_model(model_path):
    model = tf.keras.models.load_model(model_path,custom_objects={"KerasLayer": hub.KerasLayer})

    return model

def process_image(image_path, image_size=224):
    """
    Takes an image file path and turns the image into a Tensor.
    """
    # Read in an image file
    image = tf.io.read_file(image_path)

    # Turn the jpeg image into numerical Tensor with 3 color channels
    image = tf.image.decode_jpeg(image, channels=3)

    # Convert the color channel values from 0-255 to 0-1 vales
    image = tf.image.convert_image_dtype(image, tf.float32)

    # Resize the image to our desired value (244, 244)
    image = tf.image.resize(image, size=(image_size, image_size))

    return image

def imageType_convert(image):
    im1 = Image.open(image).convert('RGB')
    new_path_image = './images/target.jpg'
    im1.save(new_path_image)

    return new_path_image

class PredictEmotion(Resource):
    def get(self):
        # Read image
        target_image = './images/target.jpg'
        file_verify = Path(target_image)

        if file_verify.is_file():
            # Process image
            processed_image = process_image(target_image, 224)
            processed_image = converted_image = np.expand_dims(processed_image, axis=0)

            # Load model
            model = load_model("saved_model.h5")

            # Predict the emotion of model
            prediction = np.round(model.predict(converted_image), 3)*100

            os.remove(target_image)


            # Return response as list.
            return prediction[0].tolist()
        else:
            return "Please upload a valid image"
 
class isADog(Resource):
    def post(self):
        # Read image
        image = read_image()
        converted_image = imageType_convert(image)

        if converted_image:
            # Process image
            processed_image = process_image(converted_image, 256)
            processed_image = converted_image = np.expand_dims(processed_image, axis=0)

            # Load model
            model = load_model("Dogs-vs-Cats_model.h5")

            # Predict the emotion of model
            prediction = model.predict(converted_image)

            os.remove(image)

            # Return response as list.
            return prediction[0].tolist()
        else:
            return "Please upload a valid image"

api.add_resource(PredictEmotion, "/predict_emotion")
api.add_resource(isADog, "/is_a_dog")

@app.route("/")
def index():
    return "Hello World"

if __name__ == '__main__':
    app.run(debug=True)
