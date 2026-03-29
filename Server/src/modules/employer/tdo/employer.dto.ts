import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const normalizeSize = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? value : parsedValue;
};

export class CreateEmployerDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  readonly company_name: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  readonly description?: string;

  @Transform(normalizeSize)
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly size?: number;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  readonly industry?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  readonly address?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  readonly website?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  readonly logo?: string;
}
