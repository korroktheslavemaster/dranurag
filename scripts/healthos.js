require('dnscache')({ enable: true });

var request = require('request-promise-native')
var _ = require('lodash')
var jsonfile = require('jsonfile')
jsonfile.spaces = 2
var drugs = []

var getDrugs = (page, size) => {
  var headers = {
    'Authorization' : 'Bearer 55ad7d70367adad2c453aa02de5814898735f8addaa1b11b5e6c18f7c084f573'
  }
  var options = {
    headers: headers,
    url: 'https://www.healthos.co/api/v1/medicines/brands?page=' + page + '&size=' + size,
    time: true,
    forever: true,
  }
  return request.get(options).then(body => JSON.parse(body))

}

var getDrugsForName = (name) => {
  var headers = {
    'Authorization' : 'Bearer 55ad7d70367adad2c453aa02de5814898735f8addaa1b11b5e6c18f7c084f573'
  }
  var options = {
    headers: headers,
    url: 'https://www.healthos.co/api/v1/autocomplete/medicines/brands/' + name,
    time: true,
    forever: true,
  }
  return request.get(options).then(body => JSON.parse(body))
}


// promises = _.range(30)
//  .map(i => {
//     return getDrugs(i+1, 25)
//  })

// Promise.all(promises)
//   .then(values => {
//     // console.log(values)
//     drugs = _.unionBy(...values, 'medicine_id')
//     jsonfile.writeFile('healthos_drugs.json', drugs)
//     console.log('size; ' + drugs.length)
//   })

getDrugsForName('a')
  .then(drugs => {
    console.log('num : ' + drugs.length)
    jsonfile.writeFile('a.json', drugs)
  })