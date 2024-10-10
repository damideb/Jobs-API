const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const getAllJobs = async (req, res) => {
  const { company, status, jobType, page } = req.query;

  const queryObj = {
    createdBy: req.user.userId,
  };
  if (company) queryObj.company = company;
  if (status) queryObj.status = status;
  if (jobType) queryObj.jobType = jobType;

  let result = Job.find(queryObj).sort("createdAt");

  const pageNumber = Number(page) || 1;
  const limit = 10;
  const skip = (pageNumber - 1) * limit;
  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObj) // returns the number of documents that match the query
  const numPages = Math.ceil(totalJobs / limit)

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length, numOfPages:numPages });
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
  req.body.createdBy = req.user.userId; // user obj is passed from verfiyJWT middleware
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { user, params, body } = req;
  const userId = user.userId;
  const jobId = params.id;
  const { company, position } = body;

  // Check for required fields
  if (company === "" || position === "") {
    throw new BadRequestError("Company and position fields are required");
  }

  // Find and update the job
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  // Check if job exists
  if (!job) {
    throw new NotFoundError(`No Job with ${jobId} found`);
  }

  res.status(StatusCodes.OK).json({ job });
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
