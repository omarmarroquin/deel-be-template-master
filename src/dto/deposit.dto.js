const Joi = require('joi');

const depositFundsByUserIdDTO = Joi.object({
  deposit: Joi.number().required(),
}).required();

module.exports = {
  depositFundsByUserIdDTO,
};
