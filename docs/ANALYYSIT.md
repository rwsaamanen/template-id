# Analyysit

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

7. **(Lisäys) Maksimikesto varaukselle (kevyt “business rule”)**  
   Tällä hetkellä varaus voi teoriassa olla 1ms tai 100 vuotta. Tuotannossa tällaisille on yleensä min ja max rajat. Tähän tehtävään lisäisin kevyen rajoituksen, jotta data pysyy järkevänä ja edge keissit vähenee.  
   Time slot -malli ja toistuvat varaukset olisivat mahdollisia jatkokehitysaskelia, mutta ne laajentaa domainia, niin skippaan ne tässä.  
   **Tämä on pieni muutos, mutta parantaa logiikan realismia.**


8. **(Lisäys) Atomisuus / kilpailutilanteet (in-memory vastaus “DB constraintille”)**  
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
    AI:n tuottamassa koodissa virheitä heitetään usein samalla kaavalla toistuvasti (`new AppError(status, code, message)`). Factory-metodit (esim. `AppError.notFound(...)`, `AppError.validation(...)`) tekisi virheiden luonnista selkeämpää ja vähentää “boilerplatea”. Ainakin itse tottunut tähän.
    **Tämä menee luettavuus/refaktorointi-kastiin, joten tämä jää todennäköisesti vain huomioksi.**

14. **Request Context (Trace ID) & Pino Logger**  
    Puuttuu traceId/request-id. Tämä olisi tuotannossa korkealla prioriteetilla, koska muuten debuggaus on hankalaa samanaikaisten pyyntöjen aikana. Middleware voisi käyttää `x-request-id`-headeria jos annettu tai generoida uuden ID:n, palauttaa sen response-headerissa ja lisätä sen logeihin. Pino (JSON + logitasot) tekisi tästä käytännössä hyödyllisen.  
    **Tämä ei ole tarpeellinen tässä tehtävässä, mutta jos olisimme tuotannossa, esim AWS/CloudWatch, niin tämä olisi tärkeä.**

15. **Rate limit & Load Balancer**  
    Tässä tehtävässä toteutus oli single-instance in-memory API, joten en rakenna infraa kooditasolle. Tuotannossa rate limitingin hoitaisin ensisijaisesti edge-/infra-tasolla, jolloin nämä toimii myös usean instanssin ja autoscalingin kanssa. Sovellustasolla pitäisin tämän lisäksi kevyet suojaukset (body size limit, turvallisuusheaderit) sekä selkeän lokituksen/trace-id:n, jotta ongelmat ovat helposti jäljitettävissä load balancerin takaa.  
    **Ei tule tähän, mutta huomio.**

## Yhteenveto