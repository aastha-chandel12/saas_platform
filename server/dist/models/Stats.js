import mongoose from 'mongoose';
const statsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'global_stats',
    },
    studentsHelped: {
        type: Number,
        default: 0,
    },
    projectsCompleted: {
        type: Number,
        default: 0,
    },
    successRate: {
        type: Number,
        default: 95,
    },
}, {
    timestamps: true,
});
const Stats = mongoose.model('Stats', statsSchema);
export default Stats;
