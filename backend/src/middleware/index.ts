export function corsHeaders(req, res, next) {
  // set the CORS policy
  res.header(
    "Access-Control-Allow-Origin",
    process.env.HTTP_Access_Control_Allow_Origin ?? "*"
  );
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "*");
    return res.status(200).json({});
  }
  next();
}
