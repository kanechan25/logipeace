import { ApiProperty } from '@nestjs/swagger';

export class Bookmark {
  @ApiProperty({
    description: 'Unique identifier for the bookmark',
    example: '1g2g3g4-f8f8-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the bookmark',
    example: 'Google Search',
  })
  title: string;

  @ApiProperty({
    description: 'URL of the bookmark',
    example: 'https://www.google.com',
  })
  url: string;

  @ApiProperty({
    description: 'Optional description of the bookmark',
    example: 'Search engine for finding information',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Date when the bookmark was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the bookmark was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(data: Partial<Bookmark>) {
    Object.assign(this, data);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }
}
