const { Profile } = require('../model');

const findOne = (query, options) => Profile.findOne(query, options);
const increment = (fields, options) => Profile.increment(fields, options);
const decrement = (fields, options) => Profile.decrement(fields, options);

module.exports = {
  findOne,
  increment,
  decrement,
};
