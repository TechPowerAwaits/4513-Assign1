/*
 * Purpose: Provides basic Express middleware for handling CORS.
 *
 * Details: While there are other packages available, it is best for learning
 * to attempt managing CORS manually. Also, it is best to have as few
 * unnecessary package dependencies as possible.
 */

/*
 * Purpose: Allows all origins to access any content via GET.
 */
function corsAllowGet(req, resp, next) {
  resp.set("Access-Control-Allow-Origin", "*");

  if (req.method == "OPTIONS") {
    resp.set({
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    resp.status(204);
  } else {
    next();
  }
}

export { corsAllowGet };
