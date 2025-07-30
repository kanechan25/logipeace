import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'Title of the bookmark',
    example: 'Google Search',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiProperty({
    description: 'Valid URL of the bookmark',
    example: 'https://www.google.com',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Optional description of the bookmark',
    example: 'Search engine for finding information',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
} 