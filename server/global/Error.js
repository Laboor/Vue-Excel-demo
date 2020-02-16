global.UploadError = class {
  constructor(message, status, error) {
    this.message = message;
    this.name = 'UploadError';
    this.status = status || 500;
    this.error = error || null;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}


global.DatabaseError = class {
  constructor(message, status, error) {
    this.message = message;
    this.name = 'DatabaseError';
    this.status = status || 500;
    this.error = error || null;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

