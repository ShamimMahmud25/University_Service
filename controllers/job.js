"use strict";

const Validator = require("validatorjs");
const jobModel = require("../models/Job");

const jobProfileRules = {
    email: "required|email",
    firstName:"required",
    lastName:"required",
    session:"required",
    companyName : "required",
    jobRole : "required",
    adviceText : "required",
    joinDate : "required"
};



exports.create = async (ctx) => {
    try {
        const request = ctx.request.body;
        const validation = new Validator(request, jobProfileRules);
        if (validation.fails()) {
            throw {
                status: 400,
                code:1000,
                message: "Invalid request",
                error:{
                    code:1000,
                    message:validation.errors
                  }
            };
        }
        await jobModel.create(request);

        ctx.body = {
            message: " Job Information successfully created"
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 400;
        ctx.body = { message, error };
    }
};

exports.getJobInfo = async (ctx) => {
    try {
        const usersJobData = await jobModel.getAllUserJobInfo();
        if (!usersJobData) {
            throw {
                status: 400,
                message:"No Information Found"
            };
        }
        ctx.body = {
            message: "Job Details Get Successfully",
            data:usersJobData
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 400;
        ctx.body = { message, error };
    }
};