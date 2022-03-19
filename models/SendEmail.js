/** @format */

//dependencise
const axios = require('axios');

//internal dependencise
const { sendMailURL } = require('../variables/index');

exports.sendEmail =async (request) => {
  return await axios.post(`${sendMailURL}/sendEmail`,request).then((response) =>{return response.data}).catch((err)=>{
      console.log(err);
  });
};
