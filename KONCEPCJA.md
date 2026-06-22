# SignOff by Offhand — koncepcja aplikacji do zbierania zgód na planie

*Przygotował Marek Żak dla Offhand Hanna Nobis.*

Prototyp wg analizy prawno-rynkowej (ścieżka B, model hybrydowy): własny frontend offline-first + (docelowo) API kwalifikowanego dostawcy usług zaufania.

## Cel
Zbieranie na tablecie/telefonie prawnie skutecznych zgód na rozpowszechnianie wizerunku (art. 81 pr. aut.) oraz zgód RODO, z maksymalną siłą dowodową — bo ciężar dowodu spoczywa na produkcji (SN I CSK 739/12).

## Przepływ (zgodny z rekomendacją „minimum wątpliwości prawnych”)
1. **Dane osoby** — imię, nazwisko, e-mail/telefon, opcjonalnie nr dokumentu; tryb małoletniego (dane i podpis opiekuna prawnego).
2. **Treść zgody** — pełna klauzula (art. 81 + klauzula informacyjna RODO art. 13) do przeczytania; w treść wchodzą też dodatkowe zgody tekstowe przypięte do projektu. Każde zaznaczenie checkboxa jest zapisywane w audit trail.
3. **Osobne checkboxy** — zezwolenie art. 81 (wymagane), zgoda RODO (wymagana, niezależnie odwoływalna), zgoda marketingowa (dobrowolna).
4. **Podpis palcem/rysikiem** — zapisywany wyłącznie jako obraz (forma dokumentowa art. 77² KC). Celowo **bez biometrii** (nacisk/prędkość) — unika art. 9 RODO.
5. **Zdjęcie podpisującego** — zalecane, osadzane w PDF (mitygacja zarzutu „to nie ja podpisałem”).
6. **Zapis** — hash SHA-256, łańcuch integralności, szyfrowanie, PDF z kartą dowodową, kopia do kolejki wysyłki.

## Wersja 3 — produkcyjna (konta + chmura)
- **Model kluczy:** losowy klucz główny danych (DEK, AES-256) szyfruje całą bazę; PIN każdego konta tylko „opakowuje" DEK (PBKDF2 → KEK → wrap). Dzięki temu wiele kont z własnymi PIN-ami i **reset PIN-u przez admina bez znajomości starego i bez przeszyfrowania bazy**.
- **Role:** 👑 **Administrator** (Hanna Nobis, Marek Żak) — wszystko: projekty, dokumenty, konta (tworzenie/dezaktywacja/usuwanie/reset PIN), uprawnienia do projektów, chmura, kopie, cofnięcia RODO. 👤 **Pracownik** — wyłącznie zbieranie zgód w przydzielonych projektach + zmiana własnego PIN. Zawsze musi istnieć min. 1 aktywny admin (wymuszane).
- **Uprawnienia do projektów:** w karcie projektu zaznacza się uprawnione osoby (nikt zaznaczony = wszyscy).
- **Chmura:** po każdej zmianie aplikacja automatycznie wysyła pełną kopię, zaszyfrowaną **end-to-end** (chmura przechowuje wyłącznie zaszyfrowane bloby — privacy by design, art. 25 RODO), do **Firebase Firestore** (Google, region UE). Trzymana jest niezmienialna, wersjonowana historia kopii (reguły bazy zabraniają nadpisania/skasowania). Przywracanie: Ustawienia → ☁ Chmura (Firebase) → „Przywróć z chmury" (działa też między urządzeniami). Dostęp chroni logowanie konta technicznego (e-mail+hasło) oraz reguły bazy. *(Wcześniejszy wariant z własnym `server.js`/Render został porzucony.)*

## Organizacja pracy (wersja 2)
- **Wiele projektów** — każdy projekt ma własną treść zgody (własna lub standardowa klauzula wizerunkowa; RODO dołączane zawsze).
- **Wspólna biblioteka zgód i dokumentów** — treści (tekst wklejony albo plik **PDF/Word** — Word konwertowany do PDF) tworzy się raz i **przypina do wielu projektów** (z możliwością kopiowania i odpinania). „Zgoda" wchodzi w treść podpisywanej zgody; „dokument" (regulamin, umowa — szyfrowany na urządzeniu, max 15 MB) jest do wglądu i akceptacji.
- **Załączone dokumenty w kreatorze** — podpisujący może otworzyć każdy PDF i musi osobno potwierdzić zapoznanie się z nim (każde otwarcie/potwierdzenie w audit trail). Pełna treść załączników jest **scalana do podpisanego PDF**, a ich SHA-256 utrwalany w dokumencie.
- **Logowanie kont** — każde konto (administrator/pracownik) ma własny PIN (min. 6 cyfr), który „opakowuje" wspólny klucz danych (DEK). Imię zalogowanego trafia do audit trail, listy zgód i PDF — rozliczalność, kto zebrał zgodę. Zapomniany PIN: **kod odzyskiwania** (wysyłany mailem przy zakładaniu konta) albo reset przez admina — bez przeszyfrowywania bazy.

## Zabezpieczenia (zaimplementowane w prototypie)
| Warstwa | Mechanizm |
|---|---|
| Szyfrowanie w spoczynku | AES-256-GCM (WebCrypto), klucz z PIN przez PBKDF2 (310 000 iteracji, losowa sól); klucz tylko w pamięci. Szyfrowane są rekordy zgód, konfiguracja (projekty/operatorzy) **i pliki PDF** |
| Kontrola dostępu | PIN min. 6 cyfr; **narastająca blokada czasowa po 5 błędnych próbach** (30 s, 1 min, 2 min…); logowanie operatora kodem; auto-blokada po 5 min bezczynności |
| Integralność | SHA-256 każdego dokumentu + **hash-chain** (każdy rekord wiąże poprzedni) — usunięcie/modyfikacja wykrywane przyciskiem „Weryfikuj integralność” |
| Audit trail | znaczniki czasu każdego kroku (otwarcie, wyświetlenie treści, każdy checkbox, otwarcie/akceptacja dokumentów, podpis, zdjęcie, zapis), dane urządzenia, strefa czasowa, opcjonalna geolokalizacja |
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
3. ✅ **Wysyłka kopii e-mailem** — zrobione (Firebase Cloud Function `sendEmail`, nadawca z konta administratora). Opcjonalnie w przyszłości: SMS.
4. **Tryb QR** — podpis na urządzeniu bohatera.
5. **Wideo-zgoda** — nagranie ustnej zgody jako uzupełnienie.
6. **Wielojęzyczność** szablonów (EN/DE/…), tryb kiosk, ikony PWA.
7. Weryfikacja formatu z brokerem E&O i dystrybutorem **przed zdjęciami**.

## Administracja i odzyskiwanie danych (FAQ)

**Konta i role.** Administrator (zna swój PIN) ma pełne uprawnienia: projekty, biblioteka zgód/dokumentów, konta, chmura, kopie, cofnięcia RODO. Pracownik tylko zbiera zgody w przydzielonych projektach i zmienia własny PIN. Każde konto ma **własny PIN „opakowujący" wspólny klucz danych** — dlatego admin może zresetować PIN innego konta bez znajomości starego i bez przeszyfrowywania bazy.

**Zmiana / reset PIN.** Zmiana własnego: Ustawienia → Konta → „🔑 Zmień mój PIN". Reset cudzego: admin → Konta → „🔑 Reset PIN". Zapomniany PIN samodzielnie: ekran logowania → „Nie pamiętam PIN-u" → **kod odzyskiwania** (przyszedł mailem przy zakładaniu konta) → ustaw nowy PIN. Zmiana PIN-u **nie przeszyfrowuje całej bazy** — jedynie na nowo opakowuje klucz danych.

**Maile.** Kopia podpisanej zgody wychodzi automatycznie e-mailem na adres osoby. Nadawcą jest skrzynka administratora (adres + **„hasło aplikacji" Google** wpisane w Ustawieniach → Wysyłka e-mail); wysyłką zajmuje się funkcja w Firebase, która hasła nie przechowuje. Działa też ręczne „📤 Wyślij / udostępnij" (systemowe udostępnianie / pobranie PDF).

**Kopia danych.** Główna to automatyczny, zaszyfrowany backup w **Firebase** (z niezmienialną historią). Dodatkowo „⬇ Kopia zapasowa" zapisuje zaszyfrowany plik (bez PIN-u bezużyteczny) — np. na Dysk Google. Zalecenie: kopia po każdym dniu zdjęciowym.

**Utrata/kradzież urządzenia.** Bez PIN-u złodziej nie odczyta danych (szyfrowanie + narastająca blokada prób). Odtworzenie na nowym urządzeniu: zainstaluj → szybka konfiguracja (tymczasowy PIN) → Ustawienia → ☁ Chmura → „Przywróć z chmury" (albo „⬆ Przywróć z pliku") → zaloguj się PIN-em z chwili wykonania kopii. Wraca wszystko: zgody, projekty, biblioteka, konta, łańcuch integralności.

## Uruchomienie
Statyczna PWA hostowana na **GitHub Pages**: <https://signoffbyoffhand.github.io/> → otwórz na tablecie, „Dodaj do ekranu głównego" (działa offline). Na ekranie logowania jest kod QR i link do instalacji.
Lokalnie (do developmentu, wymagany `localhost`/HTTPS dla kamery/krypto): `npx serve signoffbyoffhand`.
Maile: Firebase Cloud Function `sendEmail` (`functions/`). Kopia w chmurze: Firebase Firestore.
