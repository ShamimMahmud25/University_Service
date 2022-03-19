"use strict";

const Validator = require("validatorjs");
const userModel = require("../models/Users");
const variables = require("../variables/index");
const jwt = require('jsonwebtoken');
const axios=require('axios');
const {sendEmail} =require("../models/SendEmail");

const registerRules = {
    email: "required|email",
    password: "required|min:8",
    firstName:"required",
    lastName:"required",
    address:"required",
    mobile:"required",
    session:"required",
    isEmailVarified:"required"
};

const loginRules = {
    email: "required|email",
    password: "required|min:8"
};


exports.register = async (ctx) => {
    try {
        const request = ctx.request.body;
        request.isEmailVarified=false;
        const validation = new Validator(request, registerRules);
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
        const hasDuplicate = await userModel.checkDuplicacy(request.email);
        if (hasDuplicate) {
            throw {
                status: 400,
                message:"Email address already registered",
                error:{
                  code:1001,
                  message:"Email address already registered"
                }
            };
        }
        await userModel.create(request);

        ctx.body = {
            message: "Successfully registered"
        };
    } catch (e) {
        const { status, message, error } = e;
        console.log(error);
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
                message:"Email address already registered",
                error:{
                    code:1001,
                    message:"Email address already registered"
                  }
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
            email:userInfo.email,
            isEmailVarified:userInfo.isEmailVarified
        }
        //console.log(data);
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
exports.forgetPassword = async (ctx) => {
    try {
        const request = ctx.request.body;
        const userInfo = await userModel.checkDuplicacy(request.email);
        if (!userInfo) {
            throw {
                status: 400,
                message:"Password set fail"
            };
        }
        await userModel.updatePassword(request.password,request.email);
      
        ctx.body = {
            message: "Password has changed Successfully",
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 400;
        ctx.body = { message, error };
    }
};
exports.resetPassword = async (ctx) => {
    try {
        const request = ctx.request.body;
        const isMatch = await userModel.checkExistence(request.email, request.password);
        if (!isMatch) {
            throw {
                status: 400,
                message: "Password is not valid"
            };
        }
        await userModel.updatePassword(request.newPassword,request.email);
      
        ctx.body = {
            message: "Password has reset Successfully",
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 400;
        ctx.body = { message, error };
    }
};
exports.updateEmailVerificationInfo = async (ctx) => {
    try {
        const request = ctx.request.body;
        const userInfo = await userModel.checkDuplicacy(request.email);
        if (!userInfo) {
            throw {
                status: 400,
                message:"Fail to verify User Email"
            };
        }
        await userModel.validateEmail({email:request.email,isEmailVarified:true});
      
        ctx.body = {
            message: "User Email Varified Successfully",
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 400;
        ctx.body = { message, error };
    }
};
exports.SendMail = async (ctx) => {
    try {
        const request = ctx.request.body;
        let userInfo;
        if(request.session=="ALL"){
             userInfo = await userModel.getAllUser();
        }
        else{
             userInfo = await userModel.findUser(request.session);
        }
        
        
        if (!userInfo) {
            throw {
                status: 400,
                message:"No user found"
            };
        }
        
         for(let i=0;i<userInfo.length;i++){
             //console.log(userInfo[i].email);
             request.email=userInfo[i].email;
             sendEmail(request);
           
         }
        ctx.body = {
            message: "Email Send Successfully",
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 400;
        ctx.body = { message, error };
    }
};