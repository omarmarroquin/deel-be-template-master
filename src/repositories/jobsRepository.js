const { Job } = require('../model');

const findAll = (query, options) => Job.findAll(query, options);
const findOne = (query, options) => Job.findOne(query, options);
const update = (values, options) => Job.increment(values, options);
const max = (values, options) => Job.max(values, options);

module.exports = {
  findAll,
  findOne,
  update,
  max,
};
