# Promptit

Lista prompteista:

Kielimallit ja työkalut tehtävässä:

- ChatGPT 5.2 Thinking
- Gemini 3 Fast/Thinking/Pro
- Cursor IDE
- Claude Opus 4.5 Thinking

## 1. ChatGPT 5.2 Thinking:

Alustan koko tehtävän sillä, että luon ChatGPT 5.2 Thinking luomaan prompti englanniksi minkä aioin kopioida Cursorille.


### Minun prompt:

```
Tehtävä: 

Luo alla olevasta prompti englanniksi. 
Toteutetaan tämä dev hakemistoon nimellä template-id. 
Vaadittu Stack: 
- TypeScript 
- Express 
- Node.js 
- Loput saat päättää itse Promptin pitää huomioida annetut ohjeet tarkasti. 

-- 

Rising Star 2026: 

Ennakkotehtävä Johdanto Ohjelmistokehitys on murroksessa. Näkemyksemme mukaan nykypäivän kehittäjä ei pelkästään kirjoita koodia, vaan hänen tulee pystyä suunnittelemaan, katselmoimaan ja jalostamaan AI-pohjaisten työkalujen tuottamaa jälkeä. Tässä ennakkotehtävässä emme pyydä sinua koodaamaan tyhjästä. Sen sijaan haluamme sinun suhtautuvan tekoälyyn (Cursor, Claude, ChatGPT, GitHub Copilot tai muu vastaava) kuin junior-tason parikoodaajaan. Tavoitteenasi on ohjata tekoäly ratkaisuun, ottaa sen jälkeen ohjat omiin käsiisi ja hioa ratkaisusta ammattimainen. Tavoite Tehtäväsi on toteuttaa yksinkertainen kokoushuoneiden varausrajapinta (API). Palvelun tulee tarjota käyttäjille seuraavat toiminnot: ● Varauksen luonti: Varaa huone tietylle aikavälille. ● Varauksen peruutus: Poista varaus. ● Varausten katselu: Listaa kaikki tietyn huoneen varaukset. Toimintalogiikka (business rules): ● Varaukset eivät saa mennä päällekkäin (kaksi henkilöä ei voi varata samaa huonetta samaan aikaan). ● Varaukset eivät voi sijoittua menneisyyteen. ● Aloitusajan täytyy olla ennen lopetusaikaa. Tekniset reunaehdot: ● Voit käyttää mitä tahansa yleistä ohjelmointikieltä, joka on sinulle tuttu (Python, JavaScript/TypeScript, Java, C# tai vastaava). ● Voit käyttää muistinvaraista tietokantaa (in-memory database), jotta ympäristön pystytys pysyy yksinkertaisena (esim. PostgreSQL tai MySQL-asennusta ei vaadita). Muuta huomioitavaa: ● Kuten oikeissakin työtehtävissä, tehtävänanto ei välttämättä sisällä kaikkea tarvittavaa informaatiota. Koska käytettävissä ei ole “asiakasta” jolta kysyä lisätietoja, niin tehtävän läpiviemiseksi saat tehdä itse oletuksia, kunhan dokumentoit tekemäsi oletukset. Työnkulku Noudata seuraavia vaiheita tarkasti. Arvioimme työskentelytapaasi, emme pelkkää lopputulosta. Vaihe 1: Tekoäly parikoodaajana Käytä valitsemaasi tekoälytyökalua API:n toteutuksen luomiseen. Voit iteroida tekoälyn kanssa vapaasti: pyydä sitä korjaamaan virheitä, selittämään logiikkaa tai muokkaamaan projektin rakennetta. Vaatimus: Dokumentoi keskustelusi. Kopioi käyttämäsi kehotteet (promptit) ja tekoälyn vastaukset tiedostoon nimeltä PROMPTIT.md repositoryn juureen. Tarkistuspiste: Kun tekoäly on tuottanut toimivan ratkaisun (koodin ajaminen onnistuu ja se täyttää perusvaatimukset), alusta Git-repository. ● Commit #1: Tee commit tästä raa'asta, tekoälyn generoimasta koodista. ● Commit-viesti: Alkuperäinen AI-generoitu commit Vaihe 2: Ihmisen vuoro Ota projekti nyt omaan hallintaasi. Vastuu teknisestä toteutuksesta on nyt sinulla. Korjaa asiat, jotka tekoälyltä jäi huomaamatta tai jotka se toteutti huonosti. Voit edelleen hyödyntää tekoälyä, mutta muista jatkaa kehotteiden dokumentointia PROMPTIT.md-tiedostoon. Katselmoi vaiheessa 1 generoitu koodi. Kiinnitä huomiota esimerkiksi seuraaviin: ● Logiikkavirheet ● Koodin laatu ja luettavuus ● Virheenkäsittely ● Rakenne Toimenpide: Refaktoroi ja korjaa koodi. Tee jokaisesta korjauksesta oma commit. Voit tehdä niin monta committia kuin on tarpeen. Commit-viestit: Käytä selkeitä viestejä, jotka kuvaavat tehdyn korjauksen (esim. ”refaktorointi: Toiminnallisuus X eriytetty omaan moduuliinsa” tai ”korjaus: Lisätty validointi XYZZY-arvoille”). Commit-viestit tulee kirjoittaa suomeksi. Vaihe 3: Analyysi Luo tiedosto nimeltä ANALYYSI.md. Vastaa siinä seuraaviin kysymyksiin suomeksi: 1. Mitä tekoäly teki hyvin? 2. Mitä tekoäly teki huonosti? 3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi? Palautettavat materiaalit Toimita linkki julkisesti saatavilla olevaan Git-repositoryyn (esim. GitHub/GitLab/Bitbucket:issa), joka sisältää: ● Lähdekoodin ● Täydellisen commit-historian. Älä yhdistä committeja (squash) missään vaiheessa! ● PROMPTIT.md (keskusteluhistoriasi) ● ANALYYSI.md (analyysisi) Vältä sanaparin ”Rising star” käyttöä repositoryn nimessä tai sisällössä. Arviointikriteerit Emme etsi "täydellistä" sovellusta, vaan kiinnitämme huomiota seuraaviin asioihin: - Kriittinen ajattelu: Huomasitko potentiaaliset bugit tai huonot käytännöt tekoälyn koodissa? - Promptien suunnittelu: Miten ohjasit tekoälyä? - Koodin laatu: Onko lopullinen, refaktoroitu koodisi selkeämpää ja turvallisempaa kuin tekoälyn alkuperäinen tuotos? Muita huomioita - Avoimuusilmoitus: Saatamme käyttää tekoälypohjaisia työkaluja apuna koodisi ja dokumentaatiosi analysoinnissa. Huomioithan, että nämä työkalut tukevat tarkastusprosessiamme, mutta lopulliset arviot ja rekrytointipäätökset tekevät aina ihmisasiantuntijat. - Tehtävän työnkulku on suunniteltu tarkoituksella sellaiseksi kuin se on, eikä se välttämättä vastaa tavanomaista tekoälyavusteista ohjelmistokehitystä. - Tämä esitehtävä on osa Vincitin Rising Star -rekrytointiprosessia ja tarkoitettu vain henkilökohtaiseen käyttöön. Toivomme, ettet jaa tehtävää tai sen sisältöä muille. Onnea matkaan!
```

### ChatGPT 5.2 Thinking vastaus ja aloitus prompt:

```
Here’s an English prompt you can copy-paste to your AI tool (Cursor/ChatGPT/Claude/etc.). It bakes in the workflow + repo rules, stack requirements, and the “template-id under dev/” requirement.

Prompt (English)

You are my junior pair-programmer. Generate a professional, minimal-but-solid meeting room booking REST API implementation.

Project location + name

Create the project under: dev/template-id/

Assume this is inside a larger repository (do not create a new repo folder outside dev/).

Required stack

TypeScript

Node.js

Express

You may choose any additional libraries/tools you think are appropriate (e.g., validation, testing, linting), but keep setup simple.

Functional requirements (API features)

Implement an API that supports:

Create booking: book a room for a specific time range.

Cancel booking: delete an existing booking.

View bookings: list all bookings for a given room.

Business rules (must be enforced)

Bookings must not overlap for the same room.

Bookings cannot be in the past (relative to server time).

Start time must be before end time.

Technical constraints

Use an in-memory database / storage (no Postgres/MySQL installation required).

Provide clear, consistent error handling and appropriate HTTP status codes.

Use ISO-8601 timestamps for inputs/outputs.

Required deliverables inside the project

Create these files and structure (you may expand it if helpful):

dev/template-id/README.md with:

How to install/run

Example curl requests

Assumptions you made (since there is no customer to ask)

dev/template-id/package.json with scripts to run the server (and tests if you add them)

A clean TypeScript structure, e.g.:

src/app.ts (Express app wiring)

src/server.ts (listen/start)

src/routes/...

src/services/...

src/storage/... (in-memory store)

src/validators/...

src/types/...

API design expectations

Use predictable, REST-ish endpoints, for example:

POST /rooms/:roomId/bookings

GET /rooms/:roomId/bookings

DELETE /bookings/:bookingId

Include request/response examples.

Define a booking model with at least:

id

roomId

startTime

endTime

(optional) createdAt

Quality bar

Even though this is “simple”, implement it like a real production codebase:

Input validation (reject invalid timestamps, missing fields, etc.)

Centralized error middleware

Clear separation of concerns (routes → service → storage)

Deterministic overlap checks

Meaningful unit tests if you think they add value (optional but appreciated)

Very important workflow + documentation requirements

We are following a specific workflow:

Step 1 (AI-generated baseline):

You generate a working solution that meets the basic requirements.

I will copy the exact conversation (my prompts + your responses) into a file named PROMPTIT.md in the repository root (not inside dev/template-id).

After this working baseline exists, I will initialize git and create:

Commit #1 message (Finnish): Alkuperäinen AI-generoitu commit

Step 2 (Human improvements):

I will review and refactor.

If I ask you for improvements later, continue giving changes in small, reviewable chunks, and remind me to keep logging prompts/responses into PROMPTIT.md.

Each fix/refactor should be a separate commit, and commit messages must be in Finnish.

Step 3 (Analysis):

I will write ANALYYSI.md in Finnish answering:

What the AI did well

What it did poorly

Most important improvements I made and why

Naming constraint

Do not use the phrase “Rising star” anywhere in the repository name or file contents (including README, comments, etc.).

What I want from you right now

Generate the full initial working implementation (Step 1 baseline) with:

File tree overview

Full code for each file

Commands to run it

A few example curl requests

A short section listing assumptions you made

Start now.

If you want, I can also generate a second prompt for the “Step 2 refactor phase” that tells the AI how to review the code and produce commit-sized fixes (with Finnish commit messages).
```

## 2. Tehtävän aloitus ja Cursorin ensimmäinen prompt:

Käytin Cursorin Plan modea ja Opus 4.5 Thinking mallia.

### Minun Prompt:

```
Prompt (English)

You are my junior pair-programmer. Generate a professional, minimal-but-solid meeting room booking REST API implementation.

Project location + name

Create the project under: dev/template-id/

Assume this is inside a larger repository (do not create a new repo folder outside dev/).

Required stack

TypeScript

Node.js

Express

You may choose any additional libraries/tools you think are appropriate (e.g., validation, testing, linting), but keep setup simple.

Functional requirements (API features)

Implement an API that supports:

Create booking: book a room for a specific time range.

Cancel booking: delete an existing booking.

View bookings: list all bookings for a given room.

Business rules (must be enforced)

Bookings must not overlap for the same room.

Bookings cannot be in the past (relative to server time).

Start time must be before end time.

Technical constraints

Use an in-memory database / storage (no Postgres/MySQL installation required).

Provide clear, consistent error handling and appropriate HTTP status codes.

Use ISO-8601 timestamps for inputs/outputs.

Required deliverables inside the project

Create these files and structure (you may expand it if helpful):

dev/template-id/README.md with:

How to install/run

Example curl requests

Assumptions you made (since there is no customer to ask)

dev/template-id/package.json with scripts to run the server (and tests if you add them)

A clean TypeScript structure, e.g.:

src/app.ts (Express app wiring)

src/server.ts (listen/start)

src/routes/...

src/services/...

src/storage/... (in-memory store)

src/validators/...

src/types/...

API design expectations

Use predictable, REST-ish endpoints, for example:

POST /rooms/:roomId/bookings

GET /rooms/:roomId/bookings

DELETE /bookings/:bookingId

Include request/response examples.

Define a booking model with at least:

id

roomId

startTime

endTime

(optional) createdAt

Quality bar

Even though this is “simple”, implement it like a real production codebase:

Input validation (reject invalid timestamps, missing fields, etc.)

Centralized error middleware

Clear separation of concerns (routes → service → storage)

Deterministic overlap checks

Meaningful unit tests if you think they add value (optional but appreciated)

Very important workflow + documentation requirements

We are following a specific workflow:

Step 1 (AI-generated baseline):

You generate a working solution that meets the basic requirements.

I will copy the exact conversation (my prompts + your responses) into a file named PROMPTIT.md in the repository root (not inside dev/template-id).

After this working baseline exists, I will initialize git and create:

Commit #1 message (Finnish): Alkuperäinen AI-generoitu commit

Step 2 (Human improvements):

I will review and refactor.

If I ask you for improvements later, continue giving changes in small, reviewable chunks, and remind me to keep logging prompts/responses into PROMPTIT.md.

Each fix/refactor should be a separate commit, and commit messages must be in Finnish.

Step 3 (Analysis):

I will write ANALYYSI.md in Finnish answering:

What the AI did well

What it did poorly

Most important improvements I made and why

Naming constraint

Do not use the phrase “Rising star” anywhere in the repository name or file contents (including README, comments, etc.).

What I want from you right now

Generate the full initial working implementation (Step 1 baseline) with:

File tree overview

Full code for each file

Commands to run it

A few example curl requests

A short section listing assumptions you made

Start now.
```

### Cursor & Opus 4.5 Vastaus.

Plan moden luoma suunnitelma löytyy tiedostosta: [01_meeting_room_booking_api_f55333cf.plan.md](../cursor_plans/01_meeting_room_booking_api_f55333cf.plan.md)

```
All endpoints work correctly. Let me check for any linter errors in the source files.

The implementation is complete. Here's a summary of what was created:

Project Structure

dev/template-id/
├── README.md               # Documentation with install/run/curl examples
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Test configuration
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── types/index.ts      # TypeScript interfaces (Booking, AppError, etc.)
│   ├── storage/bookingStore.ts  # In-memory Map-based storage
│   ├── validators/bookingValidator.ts  # Input validation
│   ├── services/bookingService.ts      # Business logic with overlap detection
│   ├── routes/bookingRoutes.ts         # Route definitions
│   └── middleware/errorHandler.ts      # Centralized error handling
└── tests/
    └── booking.test.ts     # 18 unit tests (all passing)

Commands

cd dev/template-id
npm install     # Install dependencies
npm run dev     # Start with hot reload
npm start       # Start server
npm test        # Run tests

Verified Working Endpoints

Method	Endpoint	Status
POST	/rooms/:roomId/bookings	Creates booking, returns 201
GET	/rooms/:roomId/bookings	Lists bookings with count
DELETE	/bookings/:bookingId	Cancels booking, returns 200
GET	/health	Returns health status

Business Rules Enforced

- Overlap detection: Returns 409 Conflict with details of conflicting booking
- No past bookings: Returns 400 with PAST_BOOKING error code
- Start before end: Returns 400 with INVALID_TIME_RANGE error code
- Input validation: Missing/invalid fields return 400 with clear messages

All 18 unit tests pass, covering validation, storage, and overlap detection logic.
```
## 3. 2 Vaiheen aloitus

Aluksi luon promptin ChatGPT  5.2 englanniksi jossa haluan Cursorin tekevän laajan audit checkin.

### Oma prompti ChatGPT 5.2 Thinking

```
Tehtävä: 

Luo alla olevasta prompti englanniksi: 

Tutki tarkasti template-id hakemiston koodit ja tiedostot ja kerro löydätkö mitään puutteita tai mahdollsiia parannus ehdotuksia. Tämän jälkeen luo kattava audit, missä syvennytään koodin arkkitehtuuriin ja design patterneihin.
```

### ChatGPT 5.2 Thinking vastaus

```
Here’s an English prompt you can paste into your AI tool:

Prompt (English)

Carefully review the entire codebase and all files inside the dev/template-id directory.

Part 1: Find gaps and improvement opportunities

Go through the project thoroughly (source code, configs, scripts, docs, tests—everything) and identify:

Bugs or logical errors

Missing validations or edge cases

Error handling issues

Inconsistent API behavior or unclear HTTP status codes

Security concerns (even for an in-memory API)

Maintainability issues (coupling, naming, structure, duplication)

TypeScript issues (types too loose, any, unsafe parsing, etc.)

Tooling gaps (linting, formatting, testing, CI readiness)

Documentation gaps (README, assumptions, examples)

For each finding:

Explain what the issue is

Explain why it matters

Propose a concrete fix (preferably with file-level pointers like “in src/services/...”, or example snippets if helpful)

Part 2: Produce a comprehensive audit focused on architecture + design patterns

Write a structured audit that analyzes the system design, including:

High-level architecture (layers/modules and their responsibilities)

Separation of concerns: routes vs services vs storage vs validation

Dependency direction and whether it follows clean architecture principles

How state is handled in-memory and how easily it could be swapped for a real DB later

Error model strategy (custom errors, middleware, mapping to HTTP)

Validation strategy (where it lives, how consistent it is)

Time handling strategy (timezone/ISO-8601 parsing, clock injection possibility)

Id generation strategy and correctness

Testing strategy: what is tested vs what should be tested

Then explicitly discuss design patterns (used or recommended), for example:

Service layer pattern

Repository pattern (even in-memory)

Dependency injection / inversion of control (whether it’s needed here)

Factory or Adapter patterns for storage/clock/logging

Middleware patterns in Express

DTOs / mapping layers

Domain model boundaries (what is “domain logic” here)

Output format requirements

Deliver the result in two sections:

Findings & Improvements (actionable list)

Prioritize by severity: Critical / High / Medium / Low

Each item includes: problem → impact → suggested fix

Architecture & Design Patterns Audit (deep dive)

Clear headings

Strengths, weaknesses, and recommended refactors

If you recommend refactors, describe them as small, reviewable steps

Assume no additional context beyond what exists in dev/template-id. If you need to make assumptions, state them explicitly.

Begin the review now.

If you want, I can also write a third prompt that asks the AI to convert the audit into a sequence of Finnish commit messages + step-by-step refactor plan (so you can implement improvements incrementally).
```

### Prompti Cursorille Opus 4.5 Thinking Plan Mode ( Kopioitu tuo ChatGPT 5.2 prompti käytännössä )

```
Prompt (English)

Carefully review the entire codebase and all files inside the dev/template-id directory.

Part 1: Find gaps and improvement opportunities

Go through the project thoroughly (source code, configs, scripts, docs, tests—everything) and identify:

Bugs or logical errors

Missing validations or edge cases

Error handling issues

Inconsistent API behavior or unclear HTTP status codes

Security concerns (even for an in-memory API)

Maintainability issues (coupling, naming, structure, duplication)

TypeScript issues (types too loose, any, unsafe parsing, etc.)

Tooling gaps (linting, formatting, testing, CI readiness)

Documentation gaps (README, assumptions, examples)

For each finding:

Explain what the issue is

Explain why it matters

Propose a concrete fix (preferably with file-level pointers like “in src/services/...”, or example snippets if helpful)

Part 2: Produce a comprehensive audit focused on architecture + design patterns

Write a structured audit that analyzes the system design, including:

High-level architecture (layers/modules and their responsibilities)

Separation of concerns: routes vs services vs storage vs validation

Dependency direction and whether it follows clean architecture principles

How state is handled in-memory and how easily it could be swapped for a real DB later

Error model strategy (custom errors, middleware, mapping to HTTP)

Validation strategy (where it lives, how consistent it is)

Time handling strategy (timezone/ISO-8601 parsing, clock injection possibility)

Id generation strategy and correctness

Testing strategy: what is tested vs what should be tested

Then explicitly discuss design patterns (used or recommended), for example:

Service layer pattern

Repository pattern (even in-memory)

Dependency injection / inversion of control (whether it’s needed here)

Factory or Adapter patterns for storage/clock/logging

Middleware patterns in Express

DTOs / mapping layers

Domain model boundaries (what is “domain logic” here)

Output format requirements

Deliver the result in two sections:

Findings & Improvements (actionable list)

Prioritize by severity: Critical / High / Medium / Low

Each item includes: problem → impact → suggested fix

Architecture & Design Patterns Audit (deep dive)

Clear headings

Strengths, weaknesses, and recommended refactors

If you recommend refactors, describe them as small, reviewable steps

Assume no additional context beyond what exists in dev/template-id. If you need to make assumptions, state them explicitly.

Begin the review now.
```

### Cursor & Opus 4.5 Vastaus.

Tässä nyt oli pientä säätöä. Aluksi Cursor loi Plan moden ja alkoi samantien korjaamaan asioita. Jouduin keskeyttämään ja kirjoitin pikaisesti promptin, missä haluan sen luovan [AUDIT.md](./AUDIT.md) tiedoston sen sijaan, että lähtee itse suoraan koodaamaan.

```
Loin docs/AUDIT.md tiedoston englanniksi. Se sisältää:

Part 1: Findings & Improvement Opportunities
0 Critical issues
4 High priority (H1-H4)
6 Medium priority (M1-M6)
6 Low priority (L1-L6)

Part 2: Architecture & Design Patterns Audit
High-level architecture diagram
Separation of concerns analysis
Dependency direction
State management
Error model strategy
Validation strategy
Time handling strategy
ID generation strategy
Testing strategy
Design patterns analysis
Recommended refactoring steps
Summary with strengths and weaknesses

Tiedosto on nyt valmiina: template-id/docs/AUDIT.md
```

## 4. Zod Validation Implementation

### Oma prompti Cursorille (Opus 4.5 Thinking Plan Mode)

```
Next task:

Implement Zod Validation

Implement Zod validation for the template-id project.

Structure something like this:

src/schemas/bookinhSchemas.ts
src/utils/validation.ts 

Patterns:

Naming Convention: Use specific names for schemas, e.g. createBookingBodySchema, roomIdParamsSchema.

Type Inference: Derive TypeScript types directly from the schemas: type CreateBookingBody = z.infer<typeof createBookingBodySchema>.

Validation Logic: Use safeParse(). If validation fails, throw an AppError.

Helper Function: Create a decode(schemaName, schema, data) helper in utils/validation.ts. It should return the typed data or throw an error.

Custom Validations: Use .refine() for custom logic (e.g., check that startTime < endTime and prevent dates in the past).

Error Handling: Update the AppError class to include an optional errors?: unknown[] property for validation details.

Cleanup: Remove the old validators/bookingValidator.ts and other code that is not used.

Installation: npm install zod ( Version: ^3.25.76 )

Additional notes:

Update this prompt to @template-id/docs/PROMPTIT.md  and add you response there as well
```

### Cursor & Opus 4.5 Vastaus

Plan moden luoma suunnitelma löytyy tiedostosta: [02_implement_zod_validation_8dd34006.plan.md](../cursor_plans/02_implement_zod_validation_8dd34006.plan.md)

```
Implementation completed successfully:

1. Installed zod@^3.25.76

2. Created src/schemas/bookingSchemas.ts with:
   - createBookingBodySchema (with .refine() for time validation)
   - roomIdParamsSchema
   - bookingIdParamsSchema
   - Type inference: CreateBookingBody, RoomIdParams, BookingIdParams

3. Created src/utils/validation.ts with:
   - decode(schemaName, schema, data) helper function
   - ValidationErrorDetail interface
   - Throws AppError with validation details on failure

4. Updated src/types/index.ts:
   - Added optional errors?: unknown[] to AppError class
   - Added optional errors field to ApiError interface
   - Removed unused CreateBookingRequest interface

5. Updated src/middleware/errorHandler.ts:
   - Now includes err.errors in response when present

6. Updated src/services/bookingService.ts:
   - Replaced old validators with Zod decode() calls
   - Uses createBookingBodySchema, roomIdParamsSchema, bookingIdParamsSchema

7. Updated tests/booking.test.ts:
   - Tests now use decode() and Zod schemas
   - All 18 tests pass

8. Cleanup:
   - Deleted src/validators/bookingValidator.ts
   - Removed src/validators/ directory

All tests pass and linter shows only warnings (console.log statements).
```

## 5. Integration Tests with Supertest

### Oma prompti Cursorille (Opus 4.5 Thinking Plan Mode)

```
Next task:

Implement integration tests for HTTP endpoints using supertest.

New file: 
tests/api.test.ts

Patterns:

Helper functions: 

Create some helpers to reduce boilerplate: testPost(url, body), testGet(url), testDelete(url).

Status codes: Verify correct status codes (200, 201, 400, 404, 409).

Response Structure: Validate the response body format:

Success: { data, count }
Error: { error: { code, message } }

Data Reset: Use beforeEach to reset the data state between tests.

Possible test scenarios:

Successful booking (201): Valid data creates a resource.
Validation error (400): Missing fields or invalid time format.
Overlap conflict (409): Trying to book an already reserved slot.
Not Found (404): Accessing non-existent resources.
Fetch by room (200): Verify retrieving bookings (both empty list and populated list).
Cancellation (204/200): Successfully deleting a booking.

Installation: npm install -D supertest @types/supertest

Additional notes:

Update this prompt to @template-id/docs/PROMPTIT.md  and add you response there as well
```

### Cursor & Opus 4.5 Vastaus

Plan moden luoma suunnitelma löytyy tiedostosta: [03_integration_tests_with_supertest_03fdf398.plan.md](../cursor_plans/03_integration_tests_with_supertest_03fdf398.plan.md)

```
Implementation completed successfully:

1. Installed supertest and @types/supertest as dev dependencies

2. Created tests/api.test.ts with:
   - Helper functions: testPost(), testGet(), testDelete()
   - beforeEach to reset bookingStore between tests
   - 18 integration tests covering all endpoints

3. Test scenarios covered:
   - POST /rooms/:roomId/bookings (201, 400, 409)
     - Successful booking creation
     - Missing startTime/endTime
     - Invalid date format
     - Past booking rejection
     - startTime >= endTime rejection
     - Overlapping booking conflict
     - Adjacent bookings allowed
     - Same time slot in different rooms
   
   - GET /rooms/:roomId/bookings (200)
     - Empty room returns empty list
     - Returns all bookings for room
     - Only returns bookings for specified room
     - Returns bookings sorted by start time
   
   - DELETE /bookings/:bookingId (200, 404)
     - Successfully cancels existing booking
     - Returns 404 for non-existent booking
   
   - GET /health (200)
     - Returns health status
   
   - Unknown routes (404)
     - Returns 404 with NOT_FOUND code

4. Response structure validation:
   - Success: { data, count } or { data }
   - Error: { error: { code, message } }

All 36 tests pass (18 unit + 18 integration).
```

## 6. Repository Pattern Refactor with Dependency Injection

### Oma prompti Cursorille (Opus 4.5 Thinking Plan Mode)

```
Next task:

Refactor BookingStore to use repository pattern with dependency injection.

Requirements:

- Define BookingRepository interface in types
- Rename BookingStore → InMemoryBookingRepository or similar (implements interface)
- Create factory function createBookingRepository() that returns new instance
- Refactor bookingService to receive repository via factory function createBookingService(repo)
- Keep existing exports for backward compatibility

--

- Tests should and can use fresh repository instances (no shared state)
- Easy to swap implementation later (e.g., database)

Update tests to use fresh repository per test where beneficial.

Update this prompt to @template-id/docs/PROMPTIT.md and add your response there as well
```

### Cursor & Opus 4.5 Vastaus

Plan moden luoma suunnitelma löytyy tiedostosta: [04_repository_pattern_refactor_c8b40db4.plan.md](../cursor_plans/04_repository_pattern_refactor_c8b40db4.plan.md)

```
Implementation completed successfully:

1. Added interfaces to src/types/index.ts:
   - BookingRepository interface (create, findById, findByRoom, delete, getAll, clear)
   - BookingService interface (createBooking, getBookingsByRoom, cancelBooking, getBookingById)

2. Refactored src/storage/bookingStore.ts:
   - Renamed BookingStore class to InMemoryBookingRepository
   - Implements BookingRepository interface
   - Added createBookingRepository() factory function
   - Kept backward-compatible bookingStore singleton export

3. Refactored src/services/bookingService.ts:
   - Created createBookingService(repository) factory function
   - Moved checkForOverlap inside factory closure (uses injected repository)
   - Kept backward-compatible bookingService singleton export

4. Refactored src/routes/bookingRoutes.ts:
   - Created createBookingRoutes(service) factory function
   - Kept backward-compatible bookingRoutes singleton export

5. Updated src/app.ts:
   - Added AppDependencies interface
   - createApp() now accepts optional { bookingService } for DI
   - Maintains backward compatibility (works without arguments)

6. Updated tests/booking.test.ts:
   - Repository tests use fresh createBookingRepository() per test
   - Service tests use fresh createBookingService(repository) per test
   - No shared state between tests

7. Updated tests/api.test.ts:
   - Added comment showing how to use full DI if needed
   - Continues using singleton with clear() for simplicity

Benefits:
- Tests now have complete isolation (no shared state)
- Easy to swap InMemoryBookingRepository for DatabaseRepository later
- Full backward compatibility maintained
- All 36 tests pass
```


