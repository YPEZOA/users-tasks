const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  title: String,
  description: String,
  complete: Boolean,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
})

module.exports = model('Task', taskSchema);
