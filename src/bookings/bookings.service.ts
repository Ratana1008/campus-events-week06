import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
import type { Booking } from './booking.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  // Nest creates EventsService once and passes it in: dependency injection
  constructor(private readonly events: EventsService) {}

  findAll(): Booking[] {
    return [...this.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  create(eventId: number, dto: CreateBookingDto): Booking {
    const event = this.events.findOne(eventId); // throws 404 if missing
    const left = event.capacity - event.booked;
    if (dto.seats > left) {
      throw new ConflictException(`Only ${left} seat(s) left`);
    }
    event.booked += dto.seats;
    const booking: Booking = {
      id: this.nextId++,
      eventId,
      name: dto.name,
      email: dto.email,
      seats: dto.seats,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(booking);
    return booking;
  }

  remove(id: number): void {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    const event = this.events.findOne(booking.eventId);
    event.booked -= booking.seats;
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }
}
