const functions = require("firebase-functions");
const { Nuxt } = require("nuxt");
const express = require("express");
const app = express();

const rp = require('request-promise');
require('@google-cloud/firestore');

const admin = require('firebase-admin');
admin.initializeApp();

const _ = require('lodash');

const config = {
  dev: false,
  buildDir: "nuxt",
  build: {
    publicPath: "/assets/"
  }
};

/*** SSR ***/
const nuxt = new Nuxt(config);

function handleRequest(req, res) {
  console.log("log3");
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  return new Promise((resolve, reject) => {
    nuxt.render(req, res, promise => {
      promise.then(resolve).catch(reject);
    });
  });
}

app.use(handleRequest);
exports.nuxtssr = functions.https.onRequest(app);

// Post newly added item data to Elasticsearch
exports.indexItemsToElasticSearch = functions.firestore
	.document('/items/{id}')
	.onCreate((snap, context) => {

		/* GET DATA */
		// Created object data
		const obj = snap.data(),
			  id = context.params.id;
		
		obj.id = id;
		obj.date = obj.date.seconds;
		
		// Test data
		console.log(`New Item's Id: ${id}`);

		/* SET REQUEST TO ELASTICSEARCH */
		let elsaticSearchConfig = functions.config().elasticsearch;
		let elasticSearchUrl = elsaticSearchConfig.url + 'items/item/' + id;
		let elasticSearchMethod = obj? 'PUT' : 'DELETE';

		let elasticSearchRequest = {
			method: elasticSearchMethod,
			url: elasticSearchUrl,
			auth: {
				username: elsaticSearchConfig.username,
				password: elsaticSearchConfig.password
			},
			body: obj,
			json: true
		};

		/* PERFORM OPERATION */
		return rp(elasticSearchRequest).then(response => {
			console.log(`Elasticresponse: ${response}`);
		});
	});

exports.indexMerchantsToElasticSearch = functions.firestore
	.document('/merchants/{id}')
	.onCreate((snap, context) => {

		/* GET DATA */
		// Created object data
		const obj = snap.data(),
			  id = context.params.id;
		
		obj.id = id;
		obj.date = obj.date.seconds;
		
		// Test data
		console.log(`New Merchant's ID: ${id}`);

		/* SET REQUEST TO ELASTICSEARCH */
		let elsaticSearchConfig = functions.config().elasticsearch;
		let elasticSearchUrl = elsaticSearchConfig.url + 'merchants/merchant/' + id;
		let elasticSearchMethod = obj? 'PUT' : 'DELETE';

		let elasticSearchRequest = {
			method: elasticSearchMethod,
			url: elasticSearchUrl,
			auth: {
				username: elsaticSearchConfig.username,
				password: elsaticSearchConfig.password
			},
			body: obj,
			json: true
		};

		/* PERFORM OPERATION */
		return rp(elasticSearchRequest).then(response => {
			console.log(`Elasticresponse: ${response}`);
		});
	});

exports.getSearchResultsFromElasticsearch = functions.https
	.onRequest((req, res) => {
		
		// Replace + operator with space seperator
        var q = '*' + _.replace(req.query.q, '+', ' ') + '*',
			from = req.query.from, // index position (start at 0)
			size = req.query.size; // max size (limit) on number of results returned

        var obj = {
			"from": from,
			"size": size,
            "query": {
                "query_string" : {
                    "query": q,
                    "fields": ["name", "category", "description"],
                    "default_operator": "or"
                }
            }
        }

		let elsaticSearchConfig = functions.config().elasticsearch;
		let elasticSearchUrl = elsaticSearchConfig.url + 'items,merchants/_search';
		let elasticSearchMethod = 'POST';

		let elasticSearchRequest = {
			method: elasticSearchMethod,
			url: elasticSearchUrl,
			auth: {
				username: elsaticSearchConfig.username,
				password: elsaticSearchConfig.password
			},
			body: obj,
			json: true
		};
		
		// Set allow cross domain request, so that vue component can use the response
		res.set('Access-Control-Allow-Origin', '*');

		/* PERFORM OPERATION */
		return rp(elasticSearchRequest).then(response => {
			console.log(`Success querying Elasticsearch. Response: ${response}`);
			res.send(response);
		}, function(error) {
			console.log(`Error querying Elasticsearch. Response: ${error}`);
			res.status(500).send('ERROR');
		});
	});

// Update merchant or item data on Elasticsearch
exports.updateDataInElastic = functions.https
	.onCall((data, context) => {
		// Checking that the user is authenticated.
		if (!context.auth) {
			// Throwing an HttpsError so that the client gets the error details.
			throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
				'while authenticated.');
		}
		
		const itemOrMerchantObj = data.text;
		var _index = itemOrMerchantObj._index,
			_type = itemOrMerchantObj._type,
			_id = itemOrMerchantObj._id,
			infoChanged = itemOrMerchantObj.infoChanged,
			value = itemOrMerchantObj.value;

		var obj = {
			"doc":{
				
			}
		}

		obj.doc[infoChanged] = value;
		if(infoChanged == 'location') { obj.doc.position = itemOrMerchantObj.position; }

		let elsaticSearchConfig = functions.config().elasticsearch;
		let elasticSearchUrl = elsaticSearchConfig.url + _index + '/' + _type + '/' + _id + '/_update';
		let elasticSearchMethod = 'POST';

		let elasticSearchRequest = {
			method: elasticSearchMethod,
			url: elasticSearchUrl,
			auth: {
				username: elsaticSearchConfig.username,
				password: elsaticSearchConfig.password
			},
			body: obj,
			json: true
		};

		/* PERFORM OPERATION */
		return rp(elasticSearchRequest).then(response => {
			console.log(`Success querying Elasticsearch. Response: ${response}`);

			return response;
		}, function(error) {
			console.log(`Error querying Elasticsearch. Response: ${error}`);

			throw new functions.https.HttpsError('elasticsearch-error', 'Response: ' +
				error);
		});
	});