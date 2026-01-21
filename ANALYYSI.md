# Analyysi

Aloitan tämän kirjoittamisen tässä vaiheessa ja lopullinen yhteenveto löytynee lopusta:

[Siirry yhteenvetoon](#yhteenveto)

Toteutin tehtävän niin, että kopioin käytännössä suoraan koko tehtävänannon ( ChatGPT:n muokkaamana ) Cursoriin ja annoin sen hoitaa alustuksen. Seuraavat huomiot siis Phase 1 jälkeen. Korjaan mielestäni kriittisimmät ja alueet, mitkä koen tähän tehtävään tärkeiksi Phase 2 aikana. Jokaisesta korjauksesta tulee oma commit.

## Omat huomiot Phase 1 jälkeen (sisältää myös AUDIT.md:n havaintoja)
Pohjustuksena olen yllättynyt miten valmista koodia AI kirjoitti. Ihan hyvää koodia mielestäni, toki tuotantoon jos lähtisin tekemään, niin tarkkana saisi olla muutamassa asiassa. Alla tärkeimmät huomiot ja muutama nice-to-have case.

1. **ESLint + Prettier (.vscode/)**  
   Tämä nyt ensimmäisenä minulla. Olen visuaalinen henkilö ja Formatointi sekä koodin formaatti pisti silmiin ensimmäisenä.  
   **Tästä tulee commit, nopea korjaus.**

2. **Zod-validointi**  
   Zodi on ollut käytössä lähes jokaisessa työpaikassa, missä olen ollut ( paitsi Koru & Google ). Toki voisi Yuppia Formikin kanssa käyttää, mutta itselle tämä on vakiintunut.
   **Tästä teen commitin, hieman työläs, mutta itse prioon.**

3. **Integraatiotestit HTTP-endpointeille (supertest)**  
   Auditissa nousi esiin, että testit kattavat pääosin unit-tason (validator/store/service), mutta itse HTTP-kerrosta ei testata ollenkaan. Tämä menee minun silmissä vaaralliseksi, sillä silloin middlewaret, reititykset, statuskoodit ja JSON-responsien muodot voivat hajota ilman että näkyy testeissä.  
   **Lisään supertest-integraatiotestit tärkeimmille reiteille (POST/GET/DELETE), jotta API:n ulospäin näkyvä toiminta varmistetaan.**

4. **Singleton BookingStore → Repository + DI**  
   Singleton-store heikentää testieristystä ja tekee toteutuksen vaihtamisesta (esim. myöhemmin oikeaan tietokantaan) vaikeampaa. Vaikka tehtävässä käytetään in-memoryä, repository-rajapinta ja dependency injection tekevät rakenteesta selkeämmän ja paremmin laajennettavan ilman suurta monimutkaisuutta.  
   **Refaktoroin store:n `BookingRepository`-rajapinnan taakse ja injektoin repositorion serviceen. Tämä myös helpottaa testejä, kun jokaisessa testissä voidaan luoda puhdas in-memory repo.**

5. **Clock abstraction (aikojen deterministinen testaus)**  
   Auditissa oli, että aika on osittain injektoitavissa validaattorissa, mutta itse service luo edelleen `new Date()`, esim `createdAt`-kenttää varten. Tämä on epädeterminististä ja vaikeuttaa tarkkojen aikaperusteisten testien kirjoittamista.  
   **Lisään joko Luxonin tai yksinkertaisen Clock-abstraktion (esim. `clock.now()`), ja injektoin sen serviceen. Näin aika on yhdessä paikassa ja testit voidaan tehdä luotettavasti.**

6. **Overlap-malli ja aikavyöhykeoletukset (UTC + [start, end))**  
   Varausjärjestelmissä päällekkäisyys ja aikavyöhykkeet ovat tyypillisiä bugilähteitä. Tässä projektissa overlap-tarkistus (`newStart < existingEnd && newEnd > existingStart`) vastaa `[start, end)` -mallia (alku sisältyy, loppu on eksklusiivinen), jolloin vierekkäiset varaukset ovat sallittuja (esim. 10:00–11:00 ja 11:00–12:00). 

   **Dokumentoin tämän oletuksen ja lisään testit reunaehdoille.**

   Lisäksi SQL päällekkäisyydet voitaisiin estää tietokantatason constraintilla, mutta nyt kun in-memory toteutus, niin pidän tärkeimpänä selkeää dokumentointia ja yksiselitteistä aikakäytäntöä, eli tallennus ja vertailu tehdään UTC:ssa, ja ajat voidaan tarvittaessa muuntaa paikalliseen aikavyöhykkeeseen käyttöliittymässä.

7. **(Lisäys) Maksimikesto varaukselle (kevyt "business rule")**  
   Tällä hetkellä varaus voi teoriassa olla 1ms tai 100 vuotta. Tuotannossa tällaisille on yleensä min ja max rajat. Tähän tehtävään lisäisin kevyen rajoituksen, jotta data pysyy järkevänä ja edge keissit vähenee.  
   Time slot -malli ja toistuvat varaukset olisivat mahdollisia jatkokehitysaskelia, mutta ne laajentaa domainia, niin skippaan ne tässä.  
   **Tämä on pieni muutos, mutta parantaa logiikan realismia.**


8. **(Lisäys) Atomisuus / kilpailutilanteet (in-memory vastaus "DB constraintille")**  
   Tuotantoympäristössä päällekkäisyyksien estot kannattaisi varmistaa pysyvän tallennuksen tasolla (constraint/transaktio), jotta rinnakkaiset pyynnöt eivät voi rikkoa invariansseja. Tässä in-memory toteutuksessa samaa ei käsittääkseni saa täysin samalla tavalla, mutta voisin esim:  
   - lisätä kevyen lukituksen (mutex) `createBooking`-polulle, **tai**  
   - dokumentoida rajoitteen selkeästi (single instance + ei rinnakkaiskirjoitussuojaa).  
   **Dokumentoin tuon rajoitteen.**

9. **NOT_FOUND ErrorCodes:iin**  
   Auditissa tuli esiin pieni epäjohdonmukaisuus: errorHandler käyttää `NOT_FOUND`-arvoa, mutta ErrorCodes-objektista se puuttuu. Mielestäni error koodien pitää olla tasaisia koko koodissa.  
   **Tästä teen pienen commitin.**

10. **express.json body size limit**  
    Tällä hetkellä `express.json()` on käytössä ilman `limit`-parametria. Tämä on kevyt mutta relevantti suojaus: isommat request bodyt voivat aiheuttaa turhia kuormia tai DoS-tyyppisiä ongelmia. Payloadit ovat tässä pieniä, joten esim. `100kb` jättäisi joustoa.  
    **Lisään `express.json({ limit: '100kb' })` ja teen tästä commitin.**

11. **Graceful Shutdown**  
    Projektista puuttuu graceful shutdown. Jos koodi olisi tuotannossa, prosessi voisi pysähtyä deployn tai kontin sammutuksen takia ja ilman hallittua sulkua käynnissä olevat pyynnöt voi katketa.  
    **Lisään SIGINT/SIGTERM-käsittelijän, joka sulkee HTTP-serverin hallitusti.**

12. **HTTP Status Codes kirjasto**  
    Tämä varmaan preferenssikysymys, mutta koodin luettavuuteen kiva lisä. 
    **Teen tästä pienen commitin, nopea fixi.**

13. **AppError factory-metodit**  
    AI:n tuottamassa koodissa virheitä heitetään usein samalla kaavalla toistuvasti (`new AppError(status, code, message)`). Factory-metodit (esim. `AppError.notFound(...)`, `AppError.validation(...)`) tekisi virheiden luonnista selkeämpää ja vähentää "boilerplatea". Ainakin itse tottunut tähän.
    **Tämä menee luettavuus/refaktorointi-kastiin, joten tämä jää todennäköisesti vain huomioksi.**

14. **Request Context (Trace ID) & Pino Logger**  
    Puuttuu traceId/request-id. Tämä olisi tuotannossa korkealla prioriteetilla, koska muuten debuggaus on hankalaa samanaikaisten pyyntöjen aikana. Middleware voisi käyttää `x-request-id`-headeria jos annettu tai generoida uuden ID:n, palauttaa sen response-headerissa ja lisätä sen logeihin. Pino (JSON + logitasot) tekisi tästä käytännössä hyödyllisen.  
    **Tämä ei ole tarpeellinen tässä tehtävässä, mutta jos olisimme tuotannossa, esim AWS/CloudWatch, niin tämä olisi tärkeä.**

15. **Rate limit & Load Balancer**  
    Tässä tehtävässä toteutus oli single-instance in-memory API, joten en rakenna infraa kooditasolle. Tuotannossa rate limitingin hoitaisin ensisijaisesti edge-/infra-tasolla, jolloin nämä toimii myös usean instanssin ja autoscalingin kanssa. Sovellustasolla pitäisin tämän lisäksi kevyet suojaukset (body size limit, turvallisuusheaderit) sekä selkeän lokituksen/trace-id:n, jotta ongelmat ovat helposti jäljitettävissä load balancerin takaa.  
    **Ei tule tähän, mutta huomio.**

## Yhteenveto

Käytin tehtävässä tosiaan Cursoria ja livebenchin perusteella olevaa parasta mahdollista mallia, niin lopputulos oli yllättävän hyvä. Uskon, ja tiedän kokemuksista, että huonompi malli ei tälläiseen lopputulokseen olisi pääsyt. Suurin osa kommenteista on tekoälyn luomaa ja olen tarkoituksella ne jättänyt, osa niistä on myös minun.

### 1. Mitä tekoäly teki hyvin?

Tekoäly rakensi koko perustan ja perustoiminnallisuuden hyvin. Eli minun ei tarvinnut oikeastaan mitään ylimääräistä tehdä. Cursorin Plan mode ja Claude Opus 4.5 Thinking suoritti annetun tehtävän kerralla maaliin, eli väliprompteja en tarvinnut ollenkaan.

Seuraavat kohdat oli toteutettu omasta mielestä ja auditin perusteella hyvin:

- Kerrosarkkitehtuuri (Routes -> Service -> Storage) oli selkeä ja oikein jaettu
- Overlap-logiikka oli järkevästi tehty
- UUID-generointi uuid.v4():llä
- AppError + errorHandler toteutus
- Testit

### 2. Mitä tekoäly teki huonosti?

Luonnollisesti tekoälyn luomassa koodissa oli puutteita, mutta esim pikaiseen pocciin tai mvp, niin uskoisin sen riittävän. Eli tässä nyt tuli huomio, että mitä jos kaikki nämä asiat olisi promptannut etupeltoon. Niin olisiko lopputulos voinut olla kerralla sellainen, missä nämä olisi edes jollain tasolla tehtynä? Toki pitää huomioida, että jossain menee AI:n context raja, eli aivan loputtomasti en voi AI:lle syöttää promptia, vaan tässäkin kannattanee varmasti lähestyä pala kerrallaan.

- Singleton-pattern BookingStoressa esti testieristyksen ja dependency injectionin. Tämä oli hieman haasteellista käsittää, koska en in memorya ollut kunnolla ikinä käyttänyt, mutta käsittääkseni datahan on itse sovelluksen muuttujassa kun taas jos olis psql, niin se olisi ulkoisesti esim testidatana. Esim postgresissa tiedot tallennettaisiin luonnollisesti kantaan ja jokainen testi nollaisi tietokannan (esim. resetTestDb()), jolloin muistia ei jäisi eri testien välillä.
- ESLint/Prettier puuttui
- Body size limitit puuttui
- new Date() suoraan koodissa teki aikatesteistä epädeterministisiä
- Ei integraatiotestejä, vain unit-testit
- Loose typing validaattorissa (as Record<string, unknown>)
- Ei graceful shutdownia
- Ei varauksen keston validointia

### 3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?

Toteutin alla olevat 12 parannusta, osa korjattu itse ja osa AI:n avulla. Ymmärsin, että sitä sai käyttää iteroinnissa ja promptit on tosiaan tallennettu.

1. **ESLint + Prettier** - Preferenssikysymys, mutta yhtenäisen formaatin kannalta pidän tärkeänä. Etenkin jos multivendor setup tai useampi kehittäjä.
2. **Zod-validointi** - Tämä nyt itselle tutuin.
3. **Integraatiotestit supertest:llä** - HTTP-kerrosta ei testattu ollenkaan, koen itse tärkeäksi.
4. **Repository + DI refaktorointi** - Tämä nyt saattoi olla tarpeeton tässä tehtävässä, mutta testailin, miten AI tämän teki.
5. **Clock-abstraktio** - Jos koodi kutsuisi suoraan new Date(), niin testissä ei voisi kontrolloida mikä aika  oikeasti on. Esim. "varaus ei saa olla menneisyydessä", niin testiä ei voi kirjoittaa luotettavasti. Clock-abstraktiolla testiin voi injektoida kellon joka palauttaa aina saman ajan.
6. **Overlap-mallin dokumentointi + edge case testit** - Varausjärjestelmissä on aina kysymys: voiko varaus A loppua klo 11:00 ja varaus B alkaa klo 11:00? Halusin dokumentoida tämän, sillä jos tekisin tikettiä, niin itse kehittäjänä nämä olisi kysymyksiä joihin saattaisin törmätä jatkokehityksissä tai featsoissa, mitkä saattaa liittyä tähän.
7. **Varauksen keston validointi** - Tämä nyt varmasti olisi speksattu tiketillä, mutta tämä pyöri mielessä niin lisäsin.
8. **Concurrency-dokumentaatio** - Node.js:ssä in-memory operaatio on atominen. Postgresissa näin ei ole rinnakkaisten yhteyksien takia, niin halusin tämän nostaa esille.
9. **NOT_FOUND ErrorCodes:iin** - Tämä puuttui objektista kokonaan.
10. **Body size limit** - En tiedä tarkkaa käytäntöä, mutta sen tiedän, että nämä on yleensä limitoitu johonkin.
11. **Graceful shutdown** - Tuotannossa käynnissä olevat pyynnöt voi katketa deployn aikana. Devissä nyt ohi.
12. **http-status-codes kirjasto** - Aivan preferenssikysymys, mutta minulle tämä on kiva lisä, toki riippuen käytänteistä halutaanko vai ei.
