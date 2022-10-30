const JobsService = require('../services/jobsService');

const getAllUnpaidJobsByProfileId = async (req, res, next) => {
  try {
    const unpaidJobs = await JobsService.getAllUnpaidJobsByProfileId(req.profile);
    res.json(unpaidJobs);
  } catch (error) {
    next(error);
  }
};

const payJobByJobId = async (req, res, next) => {
  try {
    const { job_id: jobId } = req.params;

    const job = await JobsService.getUnpaidJobById(jobId, req.profile);

    if (!job) return res.status(404).end();

    const response = await JobsService.payJobByJobId(job, req.profile.id);

    res.send(response);
  } catch (error) {
    next(error);
  }
};

const getBestProfession = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const jobs = await JobsService.getBestProfession(new Date(start), new Date(end));
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

const getBestClient = async (req, res, next) => {
  try {
    const { start, end, limit = 2 } = req.query;
    const jobs = await JobsService.getBestClients(start, end, limit);
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUnpaidJobsByProfileId,
  payJobByJobId,
  getBestProfession,
  getBestClient,
};
