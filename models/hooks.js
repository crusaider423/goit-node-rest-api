export const handleSaveError = (error, data, next) => {
  error.status = 400;
  next();
};

export const setUpdateSetting = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};

































// const dublicate = error.message.split(" ").slice(0, 5).join(" ");
// const dublString = "E11000 duplicate key error collection:";
// if (dublicate === dublString) {
//   error.status = 409;
//   error.message = "Email in use";
// } else {
//   error.status = 400;
// }
