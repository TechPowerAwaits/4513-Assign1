/*
 * Purpose: Provides a consistent way of representing errors to the user.
 */

/*
 * Purpose: To wrap up any given string in a consistent way.
 */
class ErrorMsg {
  constructor(msg) {
    this.error = { message: msg };
  }
}

/*
 * Purpose: Recognizes any ErrorMsg objects.
 */
function isErrorMsg(obj) {
  return obj.error;
}

/*
 * Purpose: Provides generic messages for different error conditions.
 */
const errorMessages = {
  internal: "An internal error has occurred.",
  noData: "No data found. Invalid parameter?",
};

export { ErrorMsg, isErrorMsg, errorMessages };
