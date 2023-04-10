const mongoose = require('mongoose');
const schema = mongoose.schema();

const contactSchema = new Schema({
  name: String,
  email: String,
  subject: String,
  comment: String,
});

const contactEntry = mongoose.model('contactEntry', contactSchema, 'contact');

module.exports = contactEntry;
