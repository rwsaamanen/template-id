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
