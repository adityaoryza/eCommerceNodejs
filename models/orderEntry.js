const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: String,
  email: String,
  address: String,
  zip: String,
  state: String,
  city: String,
  country: String,
  description: Array,
  grossTotal: Number,
  type: String,
});

const orderEntry = mongoose.model('orderEntry', orderSchema, 'orders');

module.exports = orderEntry;
