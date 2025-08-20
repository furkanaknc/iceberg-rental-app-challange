import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

import { ErrorCode } from '../../enums/error-code.enum';
import { AppError } from '../app-error';
import { ConflictError } from '../conflict.error';
import { InternalError } from '../internal.error';

export function transformPrismaError(error: PrismaClientKnownRequestError | PrismaClientValidationError): AppError {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictError({
          message: 'Unique constraint failed on the fields',
          code: ErrorCode.DuplicateEntry,
        });

      default:
        return new InternalError();
    }
  }

  return new InternalError();
}
