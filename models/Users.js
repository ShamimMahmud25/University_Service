/** @format */

const variables = require("../variables");
const mongoose = require("mongoose");
const md5 = require("md5");
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
  password: String,
  firstName:String,
  lastName:String,
  address:String,
  mobile:String,
  session:String,
  studentID:String,
  isEmailVarified:Boolean
});
const UserModel = mongoose.model("Users", userSchema);

exports.checkDuplicacy = (email) => {
  return UserModel.findOne({ email });
};
exports.checkExistence = (email, password) => {
  return UserModel.findOne({ email, password: md5(password) });
};

exports.create = (userInfo) => {
  userInfo.password = md5(userInfo.password);
  return UserModel.create(userInfo);
};

exports.checkUser = (id) => {
  //return { fullNme: "Shuhail alam" };
  return UserModel.findOne({ _id: id });
};

//checkExistMail
exports.checkMailId = (emailInfo) => {
  return UserModel.findOne({ email: emailInfo });
};

//checkuserDetails for Reset password

exports.checkDetails = (_id, email) => {
  return UserModel.findOne({ _id, email });
};

exports.updatePassword= (password, email) => {
  password = md5(password);
  return  UserModel.findOneAndUpdate({email,password,new:true});
};
exports.validateEmail= (info) => {
  return  UserModel.findOneAndUpdate({email:info.email,isEmailVarified:info.isEmailVarified,new:true
});
}
exports.findUser= (session) => {
  return  UserModel.find({session});
}
exports.getAllUser= (session) => {
  return  UserModel.find();
}



