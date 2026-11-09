import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CATEGORIES, type Category } from '../event.entity.js';

// What a client may send to create an event. `id` and `booked` are not here:
// the server decides them, so a client cannot set them.
//
export class CreateEventDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsIn(CATEGORIES)
  category: Category;

  @IsISO8601({ strict: true })
  startsAt: string;

  @IsString()
  @Length(1, 100)
  location: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  capacity: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
