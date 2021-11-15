const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  avatar: String,
  email: String,
  user: String,
  password: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
})

module.exports = model('User', userSchema);
