/*
 * Purpose: Provides a consistent way of representing and sending errors to the
 * user.
 */

/*
 * Purpose: To provide a consistent way of wrapping up an error message and
 * send it to the user.
 */
class ErrorMsg {
  constructor(msg, status = 200) {
    this.code = status;
    this.message = msg;
  }

  /*
   * Purpose: Recognizes any sent (user-facing) ErrorMsg objects.
   */
  static isSentError(obj) {
    return obj.error && obj.error.message;
  }

  /*
   * Purpose: Creates an object that is a user-facing representation of the
   * ErrorMsg.
   */
  getSendable() {
    return { error: { message: this.message } };
  }

  /*
   * Purpose: Returns if this given object is equivalent to a sent ErrorMsg
   * object.
   */
  isSendable(obj) {
    return ErrorMsg.isSentError(obj) && this.message == obj.error.message;
  }

  /*
   * Purpose: Returns if this ErrorMsg object is equivalent to another ErrorMsg
   * object.
   */
  isEq(errorMsg) {
    this.code == errorMsg.code && this.message == errorMsg.message;
  }

  /*
   * Purpose: Sends the user-facing JSON representation of the error.
   */
  sendJSON(resp) {
    resp.status(this.code).send(this.getSendable());
  }

  /*
   * Purpose: Sends the user-facing HTML representation of the error.
   */
  sendHTML(resp) {
    let html = "";
    html += "<html><body>";
    html += `<h1>${this.code}</h1>`;
    html += `<strong>${this.message}</strong>`;
    html += "</body></html>";
    resp.send(html);
  }
}

/*
 * Purpose: Provides ErrorMsg objects for different error conditions.
 */
const errorMessages = {
  internal: new ErrorMsg("An internal error has occurred.", 500),
  intExpected: new ErrorMsg("A provided parameter should be an integer.", 400),
  invalidRange: new ErrorMsg(
    "Provided range is malformed. Ensure start is before or equal to end.",
    400
  ),
  noData: new ErrorMsg("No data found. Invalid parameter?", 404),
  notFound: new ErrorMsg(
    "Could not find what you were looking for. Please check your spelling.",
    404
  ),
};

export { ErrorMsg, errorMessages };
