/*
 * Purpose: Provides functionality for handling the data being retrieved in the
 * routes.
 */

import { ErrorMsg, errorMessages } from "../ErrorMsg.mjs";

/*
 * Purpose: Handles the results of querying for data.
 *
 * Details: If an error occurs, the appropriate response will be sent out.
 */
function handleQueryResults(resp, data, error = null) {
  if (error) {
    handleInternalError(resp, error);
  } else if (data.length == 0) {
    handleNoDataError(resp);
  } else {
    resp.send(data);
  }

  /*
   * Purpose: Handles an error retrieving data.
   */
  function handleInternalError(resp, error) {
    console.error(error);
    resp.status(500).send(new ErrorMsg(errorMessages["internal"]));
  }

  /*
   * Purpose: Handles an error where no data is found.
   */
  function handleNoDataError(resp) {
    resp.status(404).send(new ErrorMsg(errorMessages["noData"]));
  }
}

/*
 * Purpose: Produces an error if the named parameter is not integral.
 *
 * Details: The parameter will be stored as an integer within resp.intParams.
 */
function enforceParamInteger(router, paramName) {
  const regex = /^-?\d+$/;
  router.param(paramName, (req, resp, next, value) => {
    if (regex.test(value)) {
      if (!req.intParams) {
        req.intParams = {};
      }

      req.intParams[paramName] = Number.parseInt(value);
      next();
    } else {
      resp
        .status(400)
        .send(new ErrorMsg(`Parameter '${paramName}' is not an integer.`));
    }
  });
}

/*
 * Purpose: To insert references to the provided tables into the given supabase
 * select string.
 *
 * Returns: The modified string.
 */
function appendTableRefs(origSelect, tableRefs) {
  let selectStr = origSelect;

  tableRefs.forEach((ref) => {
    selectStr += `, ${ref.getSupabaseRep()}`;
  });

  return selectStr;
}

export { appendTableRefs, enforceParamInteger, handleQueryResults };
