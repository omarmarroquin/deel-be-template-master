const getContractUserIdKey = (type) => ((type === 'client') ? 'ClientId' : 'ContractorId');

const validSchema = async (schema, data) => {
  try {
    await schema.validateAsync(data);

    return 'Is Valid';
  } catch (e) {
    throw new Error(e.message, 'invalidParams', 400);
  }
};

module.exports = {
  getContractUserIdKey,
  validSchema,
};
