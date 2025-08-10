import { validationResult } from "express-validator";

export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(e => ({ field: e.param, msg: e.msg }));
    return res.status(400).json({ errors: formatted });
  }
  next();
}
