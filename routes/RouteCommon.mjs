/*
 * Purpose: Provides functionality for handling the data being retrieved in the
 * routes.
 */

import { errorMessages } from "../errorMsg.mjs";

/*
 * Purpose: Handles the results of querying for data.
 *
 * Details: If an error occurs, the appropriate response will be sent out.
 */
function handleQueryResults(resp, data, error = null) {
  if (error) {
    console.error(error);
    errorMessages["internal"].sendJSON(resp);
  } else if (data.length == 0) {
    errorMessages["noData"].sendJSON(resp);
  } else {
    resp.send(data);
  }
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

export { appendTableRefs, handleQueryResults };
