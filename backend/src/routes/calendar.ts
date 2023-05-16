import { Request, Response, Router } from "express";
import fetch from "node-fetch";
import { getCalendarById } from ".";
import { AppDataSource } from "../data-source";
import { Calendar, CreateCalendar } from "../entity/Calendar";
import { replacer } from "../replacer";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { removeBadRegEx, checkUrl } from "../util";

const router = Router();
export default router;

router.post("/", async function (req: Request, res: Response) {
  let createCalendar = plainToClass(CreateCalendar, req.body);
  let errors = await validate(createCalendar, { whitelist: true, forbidNonWhitelisted: true });
  if (errors.length) return res.status(400).json(errors);
  let calendar = plainToClass(Calendar, createCalendar);

  if (!checkUrl(calendar.url)) {
    res.status(400).send();
    return;
  }

  calendar = AppDataSource.manager.create(Calendar, calendar);
  calendar.settings = removeBadRegEx(calendar.settings);

  const results = await AppDataSource.getRepository(Calendar).save(calendar);
  return res.send(results);
});

router.delete("/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Calendar).delete(
    req.params.id
  );

  if (results === null) res.status(404);
  return res.send(results);
});

router.get("/:id/settings", async function (req: Request, res: Response) {
  const results = await getCalendarById(req.params.id);
  if (results === null) res.status(404);
  return res.send(results);
});

router.put("/:id/settings", async function (req: Request, res: Response) {
  let createCalendar = plainToClass(CreateCalendar, req.body);
  let errors = await validate(createCalendar, { whitelist: true, forbidNonWhitelisted: true });
  if (errors.length) return res.status(400).json(errors);
  let toUpdateCalendar = plainToClass(Calendar, createCalendar);

  const calendar = await getCalendarById(req.params.id);
  AppDataSource.getRepository(Calendar).merge(calendar, toUpdateCalendar);

  if (!checkUrl(calendar.url)) {
    res.status(400).send();
    return;
  }

  const results = await AppDataSource.getRepository(Calendar).save(calendar);

  if (results === null) res.status(404).send();
  return res.send(results);
});

function calendarTimeout(req: Request, res: Response){
  console.warn("Connection timeout");
  res.status(408).send();
}

router.get("/:id", async function (req: Request, res: Response) {
  res.setTimeout(Number(process.env.REGEX_TIMEOUT) ?? 30000, function(){
      calendarTimeout(req, res);
    });
  
  const calendar = await getCalendarById(req.params.id);

  if (calendar === null) {
    res.status(404).send();
    return;
  }
  if (!checkUrl(calendar.url)) {
    res.status(400).send();
    return;
  }


  const data = await fetch(calendar.url.toString());
  let calString = await data.text();
  calString = replacer(calString, calendar);

  let customType = data.headers.get("Content-Type") ?? "text/plain";
  if (req.query["content-type"] && typeof req.query["content-type"] === "string") customType = req.query["content-type"]; 

  res.set("content-type", customType);
  res.send(calString);
});
