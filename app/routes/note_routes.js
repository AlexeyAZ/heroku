module.exports = function(app, db) {
	const ObjectID = require('mongodb').ObjectID;
	const fs = require('fs');
	const cloudinary = require('cloudinary');

	cloudinary.config({
		cloud_name: 'dkojl4oh9',
		api_key: '626335577984612',
		api_secret: 'FwrK6vXCs4ECvqM6SM9RHYzOgc0'
	});

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
			descr: req.fields.descr
		};

		function addSiteToDb(database, siteObj, uploadResult) {
			site.img = uploadResult.secure_url;
			site.imgId = uploadResult.public_id;

			database.collection('sites').insert(siteObj, (err, result) => {

				if (err) { 
					res.send({ 'message': 'error' });
					
				} else {
					res.send({ 'message': 'success', 'res': result});
				}
			});
		}

		cloudinary.v2.uploader.upload(req.files.image.path, (err, result) => {
			if (err) {
				res.send({ 'message': 'error' });
			} else {
				addSiteToDb(db, site, result);
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
						cloudinary.v2.uploader.destroy(site.imgId, (error, result) => {
							if (err) {
								res.send('error');
							} else {
								res.send('success');
							}
						});

						// fs.unlink(__dirname.slice(0, -10) + site.img, () => {
						// 	res.send('success');
						// });
					}
				});
			}
		});
	}


	function changeField(req, res) {
		// const id = req.params.id;
		// const field = req.params.field;
		// const siteObj = { _id: new ObjectID(id) };
		console.log(req.body);

		return res.send(req.body);
		// db.collection('sites').findOne(siteObj, (err, site) => {

		// });
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
	app.post('/sites/', changeField);
};