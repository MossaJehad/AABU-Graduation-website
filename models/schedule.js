const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    days: {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);