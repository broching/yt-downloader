const constants = require("../modules/constants");
const yup = require("yup");
const {
  replaceDocument,
  insertDocument,
  updateDocument,
} = require("../services/db");

module.exports = {
  getCurrentDateTime() {
    const date = new Date();

    const year = date.getFullYear();

    // JavaScript's getMonth() method returns a zero-based index, so add 1 to get the correct month number
    const month = ("0" + (date.getMonth() + 1)).slice(-2);

    const day = ("0" + date.getDate()).slice(-2);

    const hours = ("0" + date.getHours()).slice(-2);

    const minutes = ("0" + date.getMinutes()).slice(-2);

    const seconds = ("0" + date.getSeconds()).slice(-2);

    // JavaScript's getMilliseconds() method returns a number between 0 and 999, so add leading zeros if necessary
    const milliseconds = ("00" + date.getMilliseconds()).slice(-3);

    return `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
  },
  createSuccessResponse() {
    const resp = {};
    resp["status"] = constants.STATUS.SUCCESS;
    resp["message"] = "";
    return resp;
  },
  createErrorResponse(message, client_message = message) {
    const resp = {};
    resp["status"] = constants.STATUS.FAIL;
    resp["message"] = message;
    resp["client_message"] = client_message; // message for client side
    return resp;
  },
  createPendingResponse(message) {
    const resp = {};
    resp["status"] = constants.STATUS.PENDING;
    resp["message"] = message;
    return resp;
  },
  yupErrorResponse(yupError) {
    if (yupError instanceof yup.ValidationError) {
      // Send the errors array in the response
      const resp = {};
      resp["status"] = constants.STATUS.FAIL;
      resp["message"] = yupError.errors.join(", ");
      resp["client_message"] = yupError.errors.join(", "); // message for client side
      return resp;
    }
  },
 

};
