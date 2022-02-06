"use strict";

const Validator = require("validatorjs");
const userModel = require("../models/Users");
const variables = require("../variables/index");
const jwt = require('jsonwebtoken');

const registerRules = {
    email: "required|email",
    password: "required|min:8",
    firstName:"required",
    lastName:"required",
    address:"required",
    mobile:"required",
    session:"required",
    studentID:"required"
};

const loginRules = {
    email: "required|email",
    password: "required|min:8"
};


exports.register = async (ctx) => {
    try {
        const request = ctx.request.body;
        const validation = new Validator(request, registerRules);
        if (validation.fails()) {
            throw {
                status: 400,
                message: "Invalid request",
                error: validation.errors.all()
            };
        }
        const hasDuplicate = await userModel.checkDuplicacy(request.email);
        if (hasDuplicate) {
            throw {
                status: 400,
                message:"Email address already registered"
            };
        }
        await userModel.create(request);

        ctx.body = {
            message: "Successfully registered"
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status;
        ctx.body = { message, error };
    }
};

exports.login = async (ctx) => {
    try {
        const request = ctx.request.body;

        const validation = new Validator(request, loginRules);
        if (validation.fails()) {
            throw {
                status: 400,
                message: "Invalid request",
                error: validation.errors.all()
            };
        }
        const isMatch = await userModel.checkExistence(request.email, request.password);
        if (!isMatch) {
            throw {
                status: 400,
                message: "Email/password do not match"
            };
        }
        const userInfo = await userModel.checkExistence(request.email, request.password);
        const userObject={
            userId:userInfo._id,
            password:userInfo.password,
            email:userInfo.email
        }
        const token = jwt.sign({userObject}, variables.secret);
        ctx.body = {
            message: "login Successful",
            token

        };
        // console.log(isMatch);
    } catch (e) {
        const { status, message, error } = e;
        //console.log(e);
        ctx.status = status;
        ctx.body = { message, error };
    }
};

exports.emailExist = async (ctx) => {
    try {
        const request = ctx.request.body;
        const hasDuplicate = await userModel.checkDuplicacy(request.email);
        if (hasDuplicate) {
            throw {
                status: 400,
                message:"Email address already registered"
            };
        }
        ctx.body = {
            message: "Email does not exist"
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status;
        ctx.body = { message, error };
    }
};
exports.findUserDetails = async (ctx) => {
    try {
        const request = ctx.request.body;
        const userInfo = await userModel.checkDuplicacy(request.email);
        if (!userInfo) {
            throw {
                status: 400,
                message:"User details fetch fail"
            };
        }
        const data={
            firstName:userInfo.firstName,
            lastName:userInfo.lastName,
            address:userInfo.address,
            mobile:userInfo.mobile,
            session:userInfo.session,
            studentID:userInfo.studentID,
            email:userInfo.email
        }
        ctx.body = {
            message: "User Details Get Successfully",
            data
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status;
        ctx.body = { message, error };
    }
};