from flask import Flask 
from flask import jsonify
from flask import request
from flask import blueprints
import random
from flask_cors import CORS


#stuff for Google maps
import googlemaps
gmaps = googlemaps.Client(key='AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ')


app = Flask(__name__)
CORS(app)


@app.route('/POI', methods=["POST"])
def find_POI():
  keywords = request.json["keywords"]
  # will hold all the recomendations
  poi = []
  
  for cordinate in request.json["cordinates"]:
    params = {
        'query': keywords,
        'location': cordinate,
        'radius': 1000
    }
    recomendation = gmaps.places(**params)
    choice = random.randrange(len(recomendation['results']) - 1)
    poi.append({
        'name': recomendation['results'][choice]['name'],
        'lat': recomendation['results'][choice]['geometry']['location']['lat'], 
        'lng': recomendation['results'][choice]['geometry']['location']['lng'],
        'placeID': recomendation['results'][choice]['place_id']
    })

  return jsonify(poi)

# basic recomendation function, the top three
# how to deal with locations along the way, a way of picking some place (use some mid point or at random)?

#
# @app.route('/POI', methods=["POST"])
# def find_POI():
#   # getting all the paramters from the fetch request, the get() arguments should match here and the java state objects properties.


#     cordinate = (float(request.json['lat']), float(request.json['lng']))
#     keywords = request.json['keywords']

# #   return 'Done', 201
# #  return jsonify({"cordinate": cordinate, "keywords": keywords})
# #   Hard encodede for the moment
#     params = {
#        'query': keywords,
#        'location': cordinate,
#        'radius': 1000
#     }

#     recomendation = gmaps.places(**params)

#     choice = random.randrange(len(recomendation['results']) - 1)

#     poi = {'name': recomendation['results'][choice]['name'],
#       'lat': recomendation['results'][choice]['geometry']['location']['lat'], 
#       'lng': recomendation['results'][choice]['geometry']['location']['lng'],
#       'placeID': recomendation['results'][choice]['place_id']}  


# #    return jsonify({'cordinate': cordinate, 'keywords': keywords})
#     return jsonify(poi)

    # call the gmaps route
    # create the querry to call the API


if __name__ == '__main__':
  app.run(debug=True, port=5000)
