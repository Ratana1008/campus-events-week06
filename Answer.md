
# Week 6 Answers

## 1. DELETE /events/2 returns 204, the second call returns 404. Is DELETE still idempotent?

Yes. Idempotent means that sending the same request once or many times leaves the server in the same state. It does not mean every response is identical. After the first call, event 2 is gone, and every further call leaves it gone, so only the status code differs (204, then 404), not the state of the data.

## 2. Which program blocks the response when CORS is not configured, and why can curl read it anyway?

The browser blocks it. The API on port 3000 does answer the request, but without an `Access-Control-Allow-Origin` header that allows `http://localhost:5173`, the browser refuses to give the response to the Vue app's JavaScript. CORS is a rule enforced only by browsers to protect users. curl is not a browser and does not apply the rule, so it can always read the response.

## 3. EventsController never writes `new EventsService()`. Who creates the service, when, and how many are created?

Nest's dependency injection container creates it. When the app starts, Nest reads the modules, sees `EventsService` in the `providers` of `EventsModule`, creates it, and passes it into the controller's constructor. By default a provider is a singleton, so exactly one instance exists, and it is shared with `BookingsService` because `EventsModule` exports it.

## 4. A client sends `{ "title": "Pitch Night", ..., "booked": 50 }`. Which line refuses it, and what would happen to `booked` without it?

The line `forbidNonWhitelisted: true` in the `ValidationPipe` options in `setup.ts` (working together with `whitelist: true`) refuses the request with 400, because `booked` is not a field of `CreateEventDto`. Without it, `whitelist: true` would silently remove `booked` and the request would succeed. Without both options, the extra field would reach the service, and a client could set its own `booked` value and fake a full event.

## 5. Why is the "not enough seats" rule in BookingsService and not in BookingsController or only in the Vue form?

The service owns the data and the business rules, while the controller only translates HTTP into service calls. Putting the rule in the service means it applies no matter who calls it: the controller, a test or another module. A Vue form check can be bypassed by anyone using curl or another client, and only the server knows the real `booked` count. Checking and updating the seats in one request on the server also prevents the half-updated data the browser could leave in week 5.
