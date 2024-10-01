const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  res.json("get all jobs");
};

const getJob = async (req, res) => {
  const { user, params } = req;
  const userId = user.userId;
  const jobId = params.id;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No Job with ${jobId} found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { user, params, body } = req;
  const userId = user.userId;
  const jobId = params.id;
  const { company, position } = body;

  if (company === "" || position === "") {
    throw new BadRequestError("Company and position fields are required");
  }

  if (!job) {
    throw new NotFoundError(`No Job with ${jobId} found`);
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { user, params } = req;
  const userId = user.userId;
  const jobId = params.id;

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No Job with ${jobId} found`);
  }
  res.status(StatusCodes.CREATED).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob,
};
