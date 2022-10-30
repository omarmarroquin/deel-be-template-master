const { getContractUserIdKey } = require('../utils/utils');
const ContractsRepository = require('../repositories/contractsRepository');

const getContractById = async (contractId, profile) => {
  const { id: profileId, type } = profile;

  const contract = await ContractsRepository.findOne({
    where: { id: contractId, [getContractUserIdKey(type)]: profileId },
  });

  return contract;
};

const getAllContractsByProfileId = async (profile) => {
  const { id: profileId, type } = profile;

  const contracts = await ContractsRepository.findAll({
    where: { [getContractUserIdKey(type)]: profileId, status: ['new', 'in_progress'] },
  });

  return contracts;
};

module.exports = {
  getContractById,
  getAllContractsByProfileId,
};
