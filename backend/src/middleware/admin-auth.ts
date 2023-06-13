export function auth(req, res, next){
    if (req.auth.admin !== true) return res.status(401).send("You don't have permissions for this action.");
    next();
}