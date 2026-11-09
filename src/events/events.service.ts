import { Injectable, NotFoundException } from '@nestjs/common';
import type { CampusEvent } from './event.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { ListEventsQuery } from './dto/list-events.query.js';
import { seedEvents } from './seed.js';

// The service holds the data and the rules. It knows nothing about HTTP
// except that it throws Nest exceptions, which become status codes.
@Injectable()
export class EventsService {
  private events: CampusEvent[] = seedEvents();
  private nextId = 7;

  findAll(query: ListEventsQuery = {}): CampusEvent[] {
    const q = query.search?.trim().toLowerCase() ?? '';
    return this.events
      .filter((e) => !query.category || e.category === query.category)
      .filter(
        (e) =>
          q === '' ||
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      )
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  findOne(id: number): CampusEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  create(dto: CreateEventDto): CampusEvent {
    const event: CampusEvent = {
      id: this.nextId++,
      title: dto.title,
      category: dto.category,
      startsAt: dto.startsAt,
      location: dto.location,
      capacity: dto.capacity,
      booked: 0,
      description: dto.description ?? '',
    };
    this.events.push(event);
    return event;
  }

  update(id: number, dto: UpdateEventDto): CampusEvent {
    const event = this.findOne(id); // throws 404 if missing
    if (dto.title !== undefined) event.title = dto.title;
    if (dto.category !== undefined) event.category = dto.category;
    if (dto.startsAt !== undefined) event.startsAt = dto.startsAt;
    if (dto.location !== undefined) event.location = dto.location;
    if (dto.capacity !== undefined) event.capacity = dto.capacity;
    if (dto.description !== undefined) event.description = dto.description;
    return event;
  }

  remove(id: number): void {
    const event = this.findOne(id); // throws 404 if missing
    this.events = this.events.filter((e) => e.id !== event.id);
  }
}
