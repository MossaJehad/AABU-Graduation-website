const express = require('express');
const router = express.Router();
const schedules = require('../controllers/schedules');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, authen } = require('../middleware');

const Schedule = require('../models/schedule');

router.route('/')
    .get(isLoggedIn, catchAsync(schedules.index))
    .post(isLoggedIn, authen, schedules.hasNoSchedule, catchAsync(schedules.createSchedule))

router.get('/new', isLoggedIn, authen, schedules.renderNewForm)

router.get('/collage/', isLoggedIn)

router.route('/:id')
    .get(isLoggedIn, catchAsync(schedules.showSchedule))
    .put(isLoggedIn, isAuthor, catchAsync(schedules.updateSchedule))
    .delete(isLoggedIn, isAuthor, catchAsync(schedules.deleteSchedule));

router.get('/:id/edit', isLoggedIn, authen, isAuthor, catchAsync(schedules.renderEditForm))

module.exports = router;