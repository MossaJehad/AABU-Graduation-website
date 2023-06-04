const Schedule = require('../models/schedule');
const User = require('../models/user');

module.exports.index = async (req, res) => {
    const users = await User.find({})
    const schedules = await Schedule.find({}).populate('author');
    res.render('schedules/index', { schedules, users })
}

module.exports.renderNewForm = (req, res) => {
    res.render('schedules/new');
}

module.exports.createSchedule = async (req, res, next) => {
    const { sunday, monday, tuesday, wednesday, thursday } = req.body.days;
    const author = req.user._id;
     try {
    let schedule = await Schedule.findOne({ author })

    if (schedule) {
      schedule.days = {
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday
      };
    } else {
      schedule = new Schedule({
        days: {
          sunday,
          monday,
          tuesday,
          wednesday,
          thursday
        },
        author
      });
    }

    await schedule.save();
    req.flash('success', 'Successfully created/updated the schedule!');
    res.redirect(`/schedules/${schedule._id}`);
  } catch (err) {
    next(err);
  }
}; 

module.exports.hasNoSchedule = async (req, res, next) => {
    const author = req.user._id;
  
    try {
      const existingSchedule = await Schedule.findOne({ author });
  
      if (existingSchedule) {
        req.flash('error', 'You already have a schedule!');
        return res.redirect('/schedules');
      }
  
      next();
    } catch (err) {
      next(err);
    }
};

module.exports.showSchedule = async (req, res) => {
    const schedule = await Schedule.findById(req.params.id).populate('author');
    const users = await User.find({})
    if (!schedule) {
        req.flash('error', 'Cannot find that schedule!');
        return res.redirect('/schedules');
    }
    res.render('schedules/show', { schedule, users });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const schedule = await Schedule.findById(id)
    if (!schedule) {
        req.flash('error', 'Cannot find that schedule!');
        return res.redirect('/schedules');
    }
    const days = [
        { name: 'Sun', key: 'sunday' },
        { name: 'Mon', key: 'monday' },
        { name: 'Tues', key: 'tuesday' },
        { name: 'Wed', key: 'wednesday' },
        { name: 'Thurs', key: 'thursday' }
      ];
    res.render('schedules/edit', { schedule: schedule, days: days} );
}


module.exports.updateSchedule = async (req, res, next) => {
    try {
      const schedule = await Schedule.findOne({ author: req.user._id });
  
      if (!schedule) {
        req.flash('error', 'Schedule not found!');
        return res.redirect('/schedules');
      }
  
      schedule.days = req.body.days;
      await schedule.save();
  
      req.flash('success', 'Successfully updated the schedule!');
      res.redirect(`/schedules/${schedule._id}`);
    } catch (err) {
      console.error('Error updating schedule:', err);
      req.flash('error', 'Failed to update the schedule.');
      res.redirect('/schedules');
    }
  };

module.exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    await Schedule.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted schedule')
    res.redirect('/schedules');
}