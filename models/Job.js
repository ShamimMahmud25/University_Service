/** @format */

const variables = require("../variables");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/university", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  email: String,
  firstName:String,
  lastName:String,
  session:String,
  companyName : String,
  jobRole : String,
  adviceText : String,
  joinDate : String
});
const JobModel = mongoose.model("Jobs", userSchema);

exports.create = (jobInfo) => {
    return JobModel.create(jobInfo);
  };

  exports.getAllUserJobInfo= () => {
    return  JobModel.find();
  }


