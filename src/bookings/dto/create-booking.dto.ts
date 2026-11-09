import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';

// The same rules as validateBooking() in the Vue app.
// The server checks them again because anyone can send a request without our form.
export class CreateBookingDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}
