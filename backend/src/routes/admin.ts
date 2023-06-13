import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Calendar } from "../entity/Calendar";
import { auth } from "../middleware/admin-auth";
import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "..";

const router = Router();
export default router;

router.use(
  expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"]
}));

router.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") res.status(401).send(err.inner.message);
  else next(err);
});
router.use((req, res, next) => auth(req, res, next));

// Show all calendar
router.get("/calendars", async function (req: Request, res: Response) {
  const calendars = await AppDataSource.getRepository(Calendar).find();
  res.json(calendars);
});
