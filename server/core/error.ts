export class CoreError extends Error {
  readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}

export enum ErrorCode {
  DB_ERROR,
  DB_MANAGER_NOT_INITIALIZED,
  DB_CONNECTION_FAILED,
  DB_OP_FAILED,
  DB_OBJECT_NOT_FOUND,
  DB_ID_INVALID,
  MAIN_DB_NOT_SPECIFIED,
  INDEXES_NOT_CREATED,
  VALIDATION_ERROR,
}

export function throwCoreError(message: string, code: ErrorCode) {
  throw new CoreError(message, code);
}

export function throwValidationError(message: string = "Invalid arguments") {
  throwCoreError(message, ErrorCode.VALIDATION_ERROR);
}

export function throwDbError(message: string) {
  throwCoreError(message, ErrorCode.DB_ERROR);
}
