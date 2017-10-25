#!/bin/sh
mongoimport --db dranurag --collection ac_tests --drop --file ~/random/dranurag/public/json/tests.json 
mongoimport -h ds127132.mlab.com:27132 -d heroku_652gl5jn -c <collection> -u heroku_652gl5jn -p ms4qmjejupvb72jq0p5vpqr61p  --drop --file <input file>


mongodb://heroku_652gl5jn:ms4qmjejupvb72jq0p5vpqr61p@ds127132.mlab.com:27132/heroku_652gl5jn

