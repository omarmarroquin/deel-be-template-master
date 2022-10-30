const { Contract } = require('../model');

const findAll = (query, options) => Contract.findAll(query, options);
const findOne = (query, options) => Contract.findOne(query, options);
const sum = (query, options) => Contract.sum(query, options);

module.exports = {
  findAll,
  findOne,
  sum,
};
