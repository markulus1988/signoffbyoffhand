# SignOff by Offhand — koncepcja aplikacji do zbierania zgód na planie

*Przygotował Marek Żak dla Offhand Hanna Nobis.*

Prototyp wg analizy prawno-rynkowej (ścieżka B, model hybrydowy): własny frontend offline-first + (docelowo) API kwalifikowanego dostawcy usług zaufania.

## Cel
Zbieranie na tablecie/telefonie prawnie skutecznych zgód na rozpowszechnianie wizerunku (art. 81 pr. aut.) oraz zgód RODO, z maksymalną siłą dowodową — bo ciężar dowodu spoczywa na produkcji (SN I CSK 739/12).

## Przepływ (zgodny z rekomendacją „minimum wątpliwości prawnych”)
1. **Dane osoby** — imię, nazwisko, e-mail/telefon, opcjonalnie nr dokumentu; tryb małoletniego (dane i podpis opiekuna prawnego).
2. **Treść zgody** — pełna, przewijana klauzula (art. 81 + klauzula informacyjna RODO art. 13). Checkboxy odblokowują się dopiero po przewinięciu do końca (dowód zapoznania się — wpis w audit trail).
3. **Osobne checkboxy** — zezwolenie art. 81 (wymagane), zgoda RODO (wymagana, niezależnie odwoływalna), zgoda marketingowa (dobrowolna).
4. **Podpis palcem/rysikiem** — zapisywany wyłącznie jako obraz (forma dokumentowa art. 77² KC). Celowo **bez biometrii** (nacisk/prędkość) — unika art. 9 RODO.
5. **Zdjęcie podpisującego** — zalecane, osadzane w PDF (mitygacja zarzutu „to nie ja podpisałem”).
6. **Zapis** — hash SHA-256, łańcuch integralności, szyfrowanie, PDF z kartą dowodową, kopia do kolejki wysyłki.

## Wersja 3 — produkcyjna (konta + chmura)
- **Model kluczy:** losowy klucz główny danych (DEK, AES-256) szyfruje całą bazę; PIN każdego konta tylko „opakowuje" DEK (PBKDF2 → KEK → wrap). Dzięki temu wiele kont z własnymi PIN-ami i **reset PIN-u przez admina bez znajomości starego i bez przeszyfrowania bazy**.
- **Role:** 👑 **Administrator** (Hanna Nobis, Marek Żak) — wszystko: projekty, dokumenty, konta (tworzenie/dezaktywacja/usuwanie/reset PIN), uprawnienia do projektów, chmura, kopie, cofnięcia RODO. 👤 **Pracownik** — wyłącznie zbieranie zgód w przydzielonych projektach + zmiana własnego PIN. Zawsze musi istnieć min. 1 aktywny admin (wymuszane).
- **Uprawnienia do projektów:** w karcie projektu zaznacza się uprawnione osoby (nikt zaznaczony = wszyscy).
- **Chmura:** po każdej zmianie aplikacja automatycznie wysyła pełną kopię (zaszyfrowaną **end-to-end** — serwer przechowuje wyłącznie bloby, privacy by design, art. 25 RODO) na własny serwer (`server.js`: statyczna aplikacja + API `/api/sync`). Serwer trzyma 10 ostatnich wersji każdego urządzenia. Przywracanie: Ustawienia → Chmura → „Przywróć z chmury" (działa też między urządzeniami). Dostęp do API chroni klucz synchronizacji (drukowany w konsoli serwera, plik `cloud-data/sync-key.txt`).

## Organizacja pracy (wersja 2)
- **Wiele projektów** — każdy projekt ma własną treść zgody (własna lub standardowa klauzula wizerunkowa; RODO dołączane zawsze) i własne **pliki PDF do podpisu** (regulaminy, umowy — szyfrowane na urządzeniu, max 15 MB/plik).
- **Załączone dokumenty w kreatorze** — podpisujący może otworzyć każdy PDF i musi osobno potwierdzić zapoznanie się z nim (checkbox odblokowany po przewinięciu treści; każde otwarcie/potwierdzenie w audit trail). Pełna treść załączników jest **scalana do podpisanego PDF**, a ich SHA-256 utrwalany w dokumencie.
- **Logowanie operatorów** — po odblokowaniu PIN-em wybierany jest operator (własny kod min. 4 cyfry, przechowywany jako solony hash). Imię operatora trafia do audit trail, listy zgód i PDF — rozliczalność, kto zebrał zgodę.

## Zabezpieczenia (zaimplementowane w prototypie)
| Warstwa | Mechanizm |
|---|---|
| Szyfrowanie w spoczynku | AES-256-GCM (WebCrypto), klucz z PIN przez PBKDF2 (310 000 iteracji, losowa sól); klucz tylko w pamięci. Szyfrowane są rekordy zgód, konfiguracja (projekty/operatorzy) **i pliki PDF** |
| Kontrola dostępu | PIN min. 6 cyfr; **narastająca blokada czasowa po 5 błędnych próbach** (30 s, 1 min, 2 min…); logowanie operatora kodem; auto-blokada po 5 min bezczynności |
| Integralność | SHA-256 każdego dokumentu + **hash-chain** (każdy rekord wiąże poprzedni) — usunięcie/modyfikacja wykrywane przyciskiem „Weryfikuj integralność” |
| Audit trail | znaczniki czasu każdego kroku (otwarcie, przewinięcie treści, każdy checkbox, podpis, zdjęcie, zapis), dane urządzenia, strefa czasowa, opcjonalna geolokalizacja |
| Izolacja sieciowa | CSP `connect-src 'self'` — aplikacja nie wysyła danych na zewnątrz; pełny offline przez service worker |
| Cofnięcie RODO | odnotowywane jako nowy wpis (skutek na przyszłość); pierwotny dokument i hash pozostają jako dowód |
| Kopia zapasowa | eksport **i import** zaszyfrowanych pakietów (bez PIN bezużyteczne); trwała pamięć urządzenia (Storage API `persist()` — przeglądarka nie usunie danych) |

## Zgodność z prawem
- Zgoda wizerunkowa nie wymaga formy szczególnej — forma dokumentowa wystarcza (art. 77² KC, eIDAS art. 25 ust. 1).
- Dwa niezależne reżimy w jednym formularzu, odrębne checkboxy (art. 81 ≠ RODO).
- Dystrybucja oparta na art. 81 + uzasadnionym interesie (art. 6 ust. 1 lit. f) — stabilniejsza niż sama odwoływalna zgoda.
- Tryb małoletniego: podpis opiekuna prawnego.
- Retencja: dokument przechowywany także po cofnięciu (dowód na wypadek sporu).

## Roadmapa (przed użyciem produkcyjnym)
1. **Weryfikacja klauzul przez prawnika** (szkielet wymaga finalnej redakcji).
2. **Kwalifikowany znacznik czasu + pieczęć (eIDAS)** — integracja API Certum/Cencert/SIGNIUS/Autenti; PDF w formacie PAdES B-T (wymaga backendu lub bramki online — przewidziana kolejka synchronizacji).
3. **Backend wysyłki kopii** e-mail/SMS (kolejka outbox już istnieje w aplikacji).
4. **Tryb QR** — podpis na urządzeniu bohatera.
5. **Wideo-zgoda** — nagranie ustnej zgody jako uzupełnienie.
6. **Wielojęzyczność** szablonów (EN/DE/…), tryb kiosk, ikony PWA.
7. Weryfikacja formatu z brokerem E&O i dystrybutorem **przed zdjęciami**.

## Administracja i odzyskiwanie danych (FAQ)

**Konto administratora.** Administratorem jest osoba znająca główny PIN — to on odszyfrowuje dane i daje dostęp do Ustawień (projekty, operatorzy, pliki, kopie). Operatorzy mają tylko własne kody do logowania się jako „zbierający" — nie mają odrębnych uprawnień administracyjnych.

**Zmiana PIN.** Ustawienia → „Zmiana PIN administratora". PIN jest kluczem szyfrującym, więc zmiana automatycznie przeszyfrowuje wszystkie zgody, pliki i konfigurację nowym kluczem. Stary PIN przestaje działać natychmiast; stare kopie zapasowe otwiera wyłącznie PIN, którym były zabezpieczone w chwili eksportu.

**Zarządzanie dostępami.** Ustawienia → „Operatorzy": dodawanie (imię + kod min. 4 cyfry) i usuwanie. Kody przechowywane wyłącznie jako solone skróty SHA-256 — nie da się ich odczytać, w razie zapomnienia usuwa się operatora i dodaje ponownie.

**Kopia zapasowa.** Przycisk „⬇ Kopia zapasowa" zapisuje plik `consentset-backup-RRRR-MM-DD.json` do folderu Pobrane urządzenia. Plik zawiera dane w postaci **zaszyfrowanej** (AES-256-GCM) — bez PIN-u jest bezużyteczny, więc można go bezpiecznie trzymać w chmurze (Dysk Google/OneDrive), na pendrive czy wysłać sobie mailem. Zalecenie: kopia po każdym dniu zdjęciowym, w dwóch miejscach.

**Utrata/kradzież urządzenia.** Złodziej bez PIN-u nie odczyta danych (szyfrowanie + blokada prób). Odtworzenie: na nowym urządzeniu otworzyć aplikację → przejść szybką konfigurację (dowolny tymczasowy PIN) → Ustawienia → „⬆ Przywróć z kopii" → wskazać plik kopii → zalogować się PIN-em, którym kopia była zabezpieczona. Wraca wszystko: zgody, projekty, pliki PDF, operatorzy, łańcuch integralności.

**Wysyłka kopii podpisującemu.** Przycisk „📤 Wyślij / udostępnij" (po zapisaniu zgody, w szczegółach i w kolejce): na tablecie/telefonie otwiera systemowe udostępnianie z gotowym PDF-em (Gmail, Outlook, WhatsApp…); na komputerze pobiera PDF i otwiera program pocztowy z wypełnioną wiadomością (temat, ID, hash) — załącznik dołącza się ręcznie. W pełni automatyczna wysyłka (bez udziału operatora) wymaga backendu — pozycja w roadmapie.

## Uruchomienie
Statyczny katalog — dowolny serwer HTTP (wymagany `localhost` lub HTTPS dla kamery/krypto):
`npx serve zgody-app` → otwórz na tablecie, „Dodaj do ekranu głównego” (PWA, działa offline).
