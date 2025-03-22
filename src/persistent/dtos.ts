import { HttpException, HttpStatus, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseErrorDTO {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Number, enum: HttpStatus })
  statusCode: HttpStatus;

  constructor(exception: HttpException) {
    this.message = exception.message;
    this.statusCode = exception.getStatus();
  }
}

export class ResponseEntityDTO<D, E = unknown> {
  traceId: string;
  timestamp: string;
  data?: D | null;
  error?: E;

  constructor(traceId: string, timestamp: string, data?: D, error?: E) {
    this.traceId = traceId;
    this.timestamp = timestamp;

    if (error) {
      this.error = error;
    } else {
      this.data = data ?? null;
    }
  }

  public static ofData<D>(traceId: string, timestamp: string, data: D) {
    return new ResponseEntityDTO(traceId, timestamp, data);
  }

  public static ofError<E>(traceId: string, timestamp: string, error: E, cause?: unknown) {
    if (cause) {
      error['cause'] = cause;
    }

    return new ResponseEntityDTO(traceId, timestamp, undefined, error);
  }
}

export const ResponseType = <D, E = ResponseErrorDTO>(DataType?: Type<D> | null, ErrorType?: Type<E>) => {
  class ResponseNullDataEntity {
    @ApiProperty({ type: String })
    traceId: string;

    @ApiProperty({ type: Date })
    timestamp: string;

    @ApiPropertyOptional({ type: Object, example: null })
    data?: Type<D>;

    @ApiPropertyOptional({ type: ErrorType ?? ResponseErrorDTO })
    error?: Type<E>;
  }

  if (DataType == null) {
    return ResponseNullDataEntity;
  }

  class ResponseEntity {
    @ApiProperty({ type: String })
    traceId: string;

    @ApiProperty({ type: Date })
    timestamp: string;

    @ApiPropertyOptional({ type: DataType })
    data?: Type<D>;

    @ApiPropertyOptional({ type: ErrorType ?? ResponseErrorDTO })
    error?: Type<E>;
  }

  return ResponseEntity;
};
