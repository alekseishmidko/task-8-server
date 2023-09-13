export const errorWrap =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[args.length - 1]);

export const handleError = (err, req, res, next) => {
  let { status, message } = err;
  if (err.original?.detail) message += `: ${err.original.detail}`;
  console.error("Error: ", message);
  res.status(status || 500).json({ message });
  next();
};
class Exception extends Error {
  status = 500;
  constructor() {
    super();
  }
}

export class NotFoundException extends Exception {
  status = 404;
  constructor(message = "") {
    super();
    this.message = message;
  }
}

export class BadRequestException extends Exception {
  status = 400;
  constructor(message = "") {
    super();
    this.message = message;
  }
}

export class ForbiddenException extends Exception {
  status = 403;
  constructor(message = "") {
    super();
    this.message = message;
  }
}
