export class JobsDto {
  id: string;
  title: string;
  company_name: string;
  logo?: string;
  employer_id?: string;
  description?: string;
  job_type?: string;
  min_salary?: string;
  max_salary?: string;
  location?: string;
  deadline?: Date;
  industry?: string;
  department?: string;
  experience?: string;
  requirements?: string;
  level?: string;
  status?: string;
  created_at?: Date;
  min_gpa?: number;
}
