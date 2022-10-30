const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { onlyClients } = require('./middleware/onlyClients');
const ContractsController = require('./controllers/contractsController');
const JobsController = require('./controllers/jobsController');
const ProfilessController = require('./controllers/profilesController');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  console.error(`Error: ${error.message}`);
  const status = error.status || 400;
  response.status(status).send(error.message);
};

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/', (req, res) => res.send('Deel-task is running!'));
app.get('/contracts/:id', getProfile, ContractsController.getContractById);
app.get('/contracts', getProfile, ContractsController.getAllContractsByProfileId);
app.get('/jobs/unpaid', getProfile, JobsController.getAllUnpaidJobsByProfileId);
app.post('/jobs/:job_id/pay', getProfile, onlyClients, JobsController.payJobByJobId);
app.post('/balances/deposit/:userId', ProfilessController.depositFundsByUserId);
app.get('/admin/best-profession', JobsController.getBestProfession);
app.get('/admin/best-clients', JobsController.getBestClient);

app.use(errorHandler);

module.exports = app;
