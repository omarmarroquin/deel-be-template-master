const ProfilesRepository = require('../repositories/profilesRepository');

const getProfileById = async (userId) => {
  const profile = await ProfilesRepository.findOne({ where: { id: userId } });

  return profile;
};

const depositFundsByUserId = async (userId, deposit) => {
  await ProfilesRepository.increment('balance', { by: deposit, where: { id: userId } });

  return 'Funds have been successfully deposited!';
};

const withdrawFundsByUserId = async (userId, deposit) => {
  await ProfilesRepository.decrement('balance', { by: deposit, where: { id: userId } });

  return 'Funds have been successfully withdrawed!';
};

module.exports = {
  getProfileById,
  depositFundsByUserId,
  withdrawFundsByUserId,
};
