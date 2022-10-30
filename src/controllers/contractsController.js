const ContractsService = require('../services/contractsService');

const getContractById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contract = await ContractsService.getContractById(id, req.profile);

    if (!contract) return res.status(404).end();

    res.json(contract);
  } catch (error) {
    next(error);
  }
};

const getAllContractsByProfileId = async (req, res, next) => {
  try {
    const contracts = await ContractsService.getAllContractsByProfileId(req.profile);

    res.json(contracts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContractById,
  getAllContractsByProfileId,
};
