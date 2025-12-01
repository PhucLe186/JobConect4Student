export class CreateEmployerDto {
  readonly company_name: string;
  readonly description?: string;
  readonly size?: number;
  readonly industry?: string;
  readonly address?: string;
  readonly website?: string;
  readonly phone?: string;
  readonly logo?: string;
}
