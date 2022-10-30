const { Op } = require('sequelize');
const { getContractUserIdKey } = require('../utils/utils');
const JobsRepository = require('../repositories/jobsRepository');
const ContractsRepository = require('../repositories/contractsRepository');
const ProfilesService = require('./profilesService');
const {
  Job, Contract, Profile, sequelize,
} = require('../model');

const getAllUnpaidJobsByProfileId = async (profile) => {
  const { id: profileId, type } = profile;

  const jobs = await ContractsRepository.findAll({
    attributes: [
      [sequelize.col('Jobs.id'), 'id'],
      [sequelize.col('Jobs.description'), 'description'],
      [sequelize.col('Jobs.price'), 'price'],
      [sequelize.col('Jobs.paid'), 'paid'],
      [sequelize.col('Jobs.paymentDate'), 'paymentDate'],
      [sequelize.col('Jobs.createdAt'), 'createdAt'],
      [sequelize.col('Jobs.updatedAt'), 'updatedAt'],
      [sequelize.col('Jobs.ContractId'), 'ContractId'],
    ],
    where: { [getContractUserIdKey(type)]: profileId, status: 'in_progress' },
    include: {
      model: Job, required: true, where: { paid: null }, attributes: [],
    },
    raw: true,
  });

  return jobs;
};

const getTotalPriceUnpaidJobsByProfileId = async (profile) => {
  const { id: profileId, type } = profile;

  const totalPriceUnpidJobs = await ContractsRepository.sum('price', {
    attributes: [[sequelize.col('Jobs.price'), 'price']],
    where: { [getContractUserIdKey(type)]: profileId, status: 'in_progress' },
    include: {
      model: Job, required: true, where: { paid: null }, attributes: [],
    },
    raw: true,
  });

  return totalPriceUnpidJobs;
};

const getUnpaidJobById = async (jobId, profile) => {
  const { id: profileId, balance } = profile;

  const job = await JobsRepository.findOne({
    where: { id: jobId, paid: null, price: { [Op.lte]: balance } },
    include: { model: Contract, required: true, where: { ClientId: profileId } },
  });

  return job;
};

const payJobByJobId = async (job, profileId) => {
  const { id: jobId, price, Contract: jobContract } = job;

  await Promise.all([
    ProfilesService.withdrawFundsByUserId(profileId, price),
    ProfilesService.depositFundsByUserId(jobContract.ContractorId, price),
    JobsRepository.update({ paid: 1, paymentDate: new Date() }, { where: { id: jobId } }),
  ]);

  return `Job '${jobId}' was paid successfully`;
};

const getBestProfession = async (start, end) => {
  const bestProfession = await JobsRepository.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('price')), 'paid'],
      [sequelize.col('profession'), 'profession'],
    ],
    group: 'profession',
    order: [['paid', 'DESC']],
    where: { paymentDate: { [Op.between]: [start, end] } },
    include: { model: Contract, attributes: [], include: { model: Profile, as: 'Contractor', attributes: [] } },
    raw: true,
  });
  return bestProfession;
};

const getBestClients = async (start, end, limit) => {
  const bestClients = await JobsRepository.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('price')), 'paid'],
      [sequelize.col('ClientId'), 'id'],
      [sequelize.literal('firstName || \' \' || lastName'), 'fullName'],
    ],
    group: 'Contract.ClientId',
    order: [['paid', 'DESC']],
    limit,
    where: { paymentDate: { [Op.between]: [start, end] } },
    include: { model: Contract, attributes: [], include: { model: Profile, as: 'Client', attributes: [] } },
    raw: true,
  });

  return bestClients;
};

module.exports = {
  getAllUnpaidJobsByProfileId,
  getTotalPriceUnpaidJobsByProfileId,
  getUnpaidJobById,
  payJobByJobId,
  getBestProfession,
  getBestClients,
};
