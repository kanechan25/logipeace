import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional, MaxLength } from 'class-validator';

export class UpdateBookmarkDto {
  @ApiPropertyOptional({
    description: 'Title of the bookmark',
    example: 'Updated Google Search',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Valid URL of the bookmark',
    example: 'https://www.google.com/updated',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  url?: string;

  @ApiPropertyOptional({
    description: 'Optional description of the bookmark',
    example: 'Updated search engine for finding information',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
