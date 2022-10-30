const { depositFundsByUserIdDTO } = require('../dto/deposit.dto');
const JobsService = require('../services/jobsService');
const ProfilesService = require('../services/profilesService');
const { validSchema } = require('../utils/utils');

const depositFundsByUserId = async (req, res, next) => {
  try {
    const { params: { userId }, body } = req;

    await validSchema(depositFundsByUserIdDTO, body);

    const { deposit } = body;

    const profile = await ProfilesService.getProfileById(userId);

    if (!profile) return res.status(404).end();

    const totalPriceUnpidJobs = await JobsService.getTotalPriceUnpaidJobsByProfileId(profile);

    if (deposit > (0.25 * totalPriceUnpidJobs)) {
      return res.status(400).send('sorry, you can\'t deposit more than 25% of your total of jobs to pay');
    }

    const response = await ProfilesService.depositFundsByUserId(userId, deposit);

    res.send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  depositFundsByUserId,
};
