from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import googlemaps

# Initialize Google Maps Client
gmaps = googlemaps.Client(key='AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ')

app = Flask(__name__)
CORS(app, resources={r"/find_endpoint": {"origins": "http://localhost:3000"}})

def get_photo_html(photo_details):
    reference = photo_details[0]['photo_reference']
    link = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600' + '&photo_reference=' + reference + '&key=AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ'
    return link
@cross_origin()
@app.route('/find_endpoint', methods=["POST"])
def API_Endpoint():
    if request.method == 'OPTIONS':
        return ('', 204)

    x = {'results': []}

    lat = request.json['cordinates'][0]
    lng = request.json['cordinates'][1]
    radius = request.json['radius']
    location_bias = 'circle:' + str(radius) + '@' + str(lat) + "," + str(lng)

    API_request = {
        'INPUT': request.json['keywords'],
        'input_type': 'textquery',
        'fields': ['types', 'rating', 'business_status', 'geometry/location/lng', 'geometry/location/lat',
                   'user_ratings_total', 'photos', 'formatted_address', 'name', 'place_id', 'price_level', ],
        'location_bias': location_bias
    }

    for INPUT in API_request['INPUT']:
        params = {
            'input': INPUT,
            'input_type': 'textquery',
            'fields': API_request['fields'],
            'location_bias': API_request['location_bias']
        }
        result = gmaps.find_place(**params)
        if result['status'] != "OK":
            rec = {}
        else:
            rec = {
                'name': result['candidates'][0]['name'],
                'lat': result['candidates'][0]['geometry']['location']['lat'],
                'lng': result['candidates'][0]['geometry']['location']['lng'],
                'placeID': result['candidates'][0]['place_id'],
                'photos': get_photo_html(result['candidates'][0]['photos']),
                'atributes': result['candidates'][0]['types'],
                'rating': result['candidates'][0]['rating'],
                'user_rating_total': result['candidates'][0]['user_ratings_total'],
                'address': result['candidates'][0]['formatted_address']
            }

        x['results'].append(rec)

    return jsonify(x)

if __name__ == '__main__':
    app.run(debug=True, port=3001)
