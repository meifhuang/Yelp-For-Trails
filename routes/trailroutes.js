const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Trail = require('../models/trail');
const { isLoggedIn, validateTrail, isAuthor } = require('../middleware');
const trails = require('../controllers/trails');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});

router.get('/', catchAsync(trails.index));

router.get('/new', isLoggedIn, trails.trailForm)

// router.post('/', isLoggedIn, validateTrail, catchAsync(trails.createTrail))
router.post('/', isLoggedIn, upload.array('image'), validateTrail, catchAsync(trails.createTrail));

router.get('/:id', catchAsync(trails.showTrail))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(trails.trailEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateTrail, catchAsync(trails.editTrail))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(trails.deleteTrail))

module.exports = router;
