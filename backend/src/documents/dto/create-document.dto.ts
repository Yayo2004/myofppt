import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  levelId!: string;

  @IsString()
  filiereId!: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDesc?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  levelId?: string;

  @IsOptional()
  @IsString()
  filiereId?: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDesc?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
