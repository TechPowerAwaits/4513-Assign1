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

export { handleQueryResults };
