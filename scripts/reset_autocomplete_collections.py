#!/usr/bin/python

import os

[host, db, username, password] = [os.environ[e] for e in ['MONGODB_HOST', 'MONGODB_DB', 'MONGODB_USERNAME', 'MONGODB_PASSWORD']]

print host, db, username, password

# assuming current working directory is dranurag/
print os.getcwd()

collections = [
"ac_investigations",
"ac_medicineadvicefrequencies",
"ac_medicineadvicespecialadvices",
"ac_symptoms",
"ac_tests",
"ac_treatmentadvicedietaries",
"ac_treatmentadviceothers"
]

files = [
  './public/json/investigations.json',
  './public/json/frequency.json',
  './public/json/specialAdvice.json',
  './public/json/symptoms_do.json',
  './public/json/tests.json',
  './public/json/dietary.json',
  './public/json/other.json',
]

for (collection, file) in zip(collections, files):
  os.system("mongoimport -h {} -d {} -c {} -u {} -p {}  --drop --file {}".format(
    host, db, collection, username, password, file
    )) 
# mongoimport --db dranurag --collection ac_tests --drop --file ~/random/dranurag/public/json/tests.json 
# mongoimport -h ds127132.mlab.com:27132 -d heroku_652gl5jn -c <collection> -u heroku_652gl5jn -p ms4qmjejupvb72jq0p5vpqr61p  --drop --file <input file>


# mongodb://heroku_652gl5jn:ms4qmjejupvb72jq0p5vpqr61p@ds127132.mlab.com:27132/heroku_652gl5jn

