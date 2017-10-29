module.exports = function(app, db) {
	const ObjectID = require('mongodb').ObjectID;
	const fs = require('fs');

	function uploadSite(req, res) {
		/** request **

			res.json({
				fields: req.fields,
				files: req.files
			});

		** //request **/

		const site = {
			name: req.fields.name,
			link: req.fields.link,
			git: req.fields.git,
			descr: req.fields.descr,
			img: req.files.image.path
		};

		db.collection('sites').insert(site, (err, result) => {

			if (err) { 
				res.send({ 'error': 'An error has occurred' });
			} else {
				res.send(result);
			}
		});
	}


	function deleteSite(req, res) {
		const id = req.params.id;
		const details = { _id: new ObjectID(id) };

		db.collection('sites').findOne(details, (err, site) => {
			if (err) {
				res.send({ 'error': 'An error has occurred' });
			} else {

				db.collection('sites').deleteOne(details, (err, item) => {
					if (err) {
						res.send({ 'error': 'An error has occurred' });
					} else {
						fs.unlink(__dirname.slice(0, -10) + site.img, () => {
							res.send('success');
						});
					}
				});
			}
		});
	}


	function showSiteList(req, res) {
		db.collection('sites').find().toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	}


	function getSiteImg(req, res) {
		// file = req.params.file;
		// const img = fs.readFileSync("./upload/" + file);
		// res.send(img);
	}


	app.post('/upload/', uploadSite);
	app.get('/sites/:id', deleteSite);
	app.get('/sites/', showSiteList);
};