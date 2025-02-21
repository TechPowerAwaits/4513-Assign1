/*
 * Purpose: Provides functions for the parsing and checking of route
 * parameters.
 */

import { errorMessages } from "../errorMsg.mjs";

/*
 * Purpose: Parses and stores a route's parameter as an integer within resp.intParams.
 *
 * Details: If the parameter cannot be converted to an integer, the route will
 * not be processed and a JSON error will be sent.
 *
 * The function must be run before the route is set and not within the route
 * handler itself.
 */
function setParamInt(router, paramName) {
  router.param(paramName, (req, resp, next, value) => {
    if (isInt(value)) {
      if (!req.intParams) {
        req.intParams = {};
      }

      req.intParams[paramName] = Number.parseInt(value);
      next();
    } else {
      errorMessages["intExpected"].sendJSON(resp);
    }
  });

  /*
   * Purpose: Determines whether the given string only contains an integer or
   * not.
   *
   * Returns: Whether the string value is integral.
   */
  function isInt(value) {
    return /^-?\d+$/.test(value);
  }
}

/*
 * Purpose: Checks that certain parameters passed to a router are a valid range.
 *
 * Details: It automatically ensures that the parameters are valid integers.
 * If they are valid integers, the parameters will be inserted within
 * resp.intParams.
 */
function checkRange(router, paramStartName, paramEndName) {
  let startRangeVal = null;

  setParamInt(router, paramStartName);
  setParamInt(router, paramEndName);

  router.param(paramStartName, (req, resp, next, value) => {
    startRangeVal = value;
    next();
  });

  router.param(paramEndName, (req, resp, next, value) => {
    if (value >= req.intParams.start) {
      next();
    } else {
      errorMessages["invalidRange"].sendJSON(resp);
    }

    startRangeVal = null;
  });
}

export { checkRange, setParamInt };
