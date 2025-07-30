import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PaginationQueryDto, PaginatedBookmarksDto } from './dto/pagination-query.dto';
import { Bookmark } from './entities/bookmark.entity';

@ApiTags('Bookmarks')
@Controller('bookmarks')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new bookmark',
    description: 'Add a new bookmark with title, URL, and optional description',
  })
  @ApiResponse({
    status: 201,
    description: 'Bookmark successfully created',
    type: Bookmark,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data (validation errors)',
    schema: {
      example: {
        statusCode: 400,
        message: ['title should not be empty', 'Please provide a valid URL'],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bookmarks with pagination',
    description: 'Retrieve a paginated list of bookmarks (newest first)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20, max: 100)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmarks successfully retrieved',
    type: PaginatedBookmarksDto,
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Google Search',
            url: 'https://www.google.com',
            description: 'Search engine for finding information',
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
          },
        ],
        meta: {
          currentPage: 1,
          itemsPerPage: 20,
          totalItems: 5000,
          totalPages: 250,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination parameters',
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.bookmarksService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a bookmark by ID',
    description: 'Retrieve a specific bookmark by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Bookmark unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark successfully retrieved',
    type: Bookmark,
  })
  @ApiNotFoundResponse({
    description: 'Bookmark not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Bookmark with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid bookmark ID',
  })
  async findOne(@Param('id') id: string): Promise<Bookmark> {
    return this.bookmarksService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a bookmark',
    description: 'Remove a bookmark by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Bookmark unique uuid4 identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark successfully deleted',
    schema: {
      example: {
        message: 'Bookmark deleted successfully',
        id: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Bookmark not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Bookmark with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid bookmark ID',
  })
  async remove(@Param('id') id: string): Promise<{ message: string; id: string }> {
    return this.bookmarksService.remove(id);
  }

  // NOT required, but it's here for future reference
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a bookmark',
    description: 'Update an existing bookmark by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Bookmark unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark successfully updated',
    type: Bookmark,
  })
  @ApiNotFoundResponse({
    description: 'Bookmark not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Bookmark with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid bookmark ID or update data',
    schema: {
      example: {
        statusCode: 400,
        message: ['Please provide a valid URL'],
        error: 'Bad Request',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<Bookmark> {
    return this.bookmarksService.update(id, updateBookmarkDto);
  }
}
