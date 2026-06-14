# SignOff by Offhand — prosta instrukcja

*Przygotował Marek Żak dla Offhand Hanna Nobis.*

## 1. Instalacja na tablecie / telefonie (Android i iOS)

1. Otwórz w przeglądarce adres aplikacji: **https://markulus1988.github.io/signoffbyoffhand/**
   (docelowo własna domena Offhand — patrz pkt 6).
2. **Android (Chrome):** menu ⋮ → **„Dodaj do ekranu głównego"** / „Zainstaluj aplikację".
   **iPhone/iPad (Safari):** przycisk Udostępnij (kwadrat ze strzałką) → **„Dodaj do ekranu początkowego"**.
3. Na pulpicie pojawi się ikona **SignOff**. Od tej chwili aplikacja **działa w pełni bez internetu** — kamera, podpis, PDF, wszystko.

Przy pierwszym uruchomieniu aplikacja poprosi o nazwę firmy, pierwszy projekt i PIN-y obu administratorów (Hanna Nobis i Marek Żak).

## 2. Codzienna praca w terenie

1. Dotknij swojego nazwiska i podaj PIN → **Zaloguj**.
2. Wybierz projekt z listy u góry.
3. **＋ Nowa zgoda** → wpisz dane osoby → daj jej przeczytać treść (checkboxy odblokują się po przewinięciu) → podpis palcem → zdjęcie → **Zapisz**.
4. Zgoda jest od razu zaszyfrowana i (gdy jest internet) wysłana do chmury — patrz odznaka ☁ u góry.
5. **Podpowiedzi:** na komputerze najedź myszką na przycisk; na tablecie/telefonie **przytrzymaj przycisk ok. pół sekundy** — pojawi się wyjaśnienie.

## 3. Uprawnienia

- **👑 Administrator** (Hanna Nobis, Marek Żak): wszystko — projekty, dokumenty PDF do podpisu, konta, resety PIN, chmura, cofnięcia RODO.
- **👤 Pracownik**: tylko zbieranie zgód w przydzielonych projektach i zmiana własnego PIN.
- Reset zapomnianego PIN-u: admin → Ustawienia → Konta → **🔑 Reset PIN** (stary PIN niepotrzebny).

## 4. Serwer w chmurze (automatyczne e-maile + kopie) — za darmo

Serwer daje dwie rzeczy: **automatyczne e-maile** z PDF-em do osoby podpisującej oraz automatyczną kopię danych poza urządzeniem. Aplikacja działa też bez niego.

### 4a. Wdrożenie na Render (darmowy plan, ~10 min — robi Marek raz)
1. Załóż darmowe konto na [render.com](https://render.com) (logowanie przez GitHub).
2. **New +** → **Blueprint** → wskaż repozytorium `markulus1988/signoffbyoffhand`. Render sam odczyta plik `render.yaml`.
3. Render poprosi o uzupełnienie zmiennych e-mail (sekrety). Dla Gmaila:
   - `SMTP_HOST` = `smtp.gmail.com`, `SMTP_PORT` = `465`
   - `SMTP_USER` = Twój adres Gmail
   - `SMTP_PASS` = **„hasło aplikacji"** Google (Konto Google → Bezpieczeństwo → włącz weryfikację dwuetapową → „Hasła aplikacji" → wygeneruj 16 znaków)
   - `SMTP_FROM` = `SignOff by Offhand <twoj-adres@gmail.com>`
   - `SYNC_KEY` Render wygeneruje sam — skopiuj go z zakładki **Environment**.
4. Po chwili dostajesz adres typu `https://signoffbyoffhand.onrender.com`.
5. W aplikacji (na każdym urządzeniu): Ustawienia → **☁ Chmura** → wpisz ten adres i `SYNC_KEY` → „Zapisz i testuj". Zaznacz „Wysyłaj kopię PDF e-mailem automatycznie".

### 4b. Ile to realnie kosztuje
- **E-maile: darmowe.** Gmail wysyła do ~500/dobę bez opłat (na potrzeby zgód to bardzo dużo). Alternatywa: darmowy [Resend](https://resend.com) (3000 e-maili/mies.) — wtedy `SMTP_HOST` = `smtp.resend.com`.
- **Serwer: darmowy plan Render** wystarcza. Dwie rzeczy do wiedzy: po 15 min bezczynności usypia (pierwsze połączenie po przerwie trwa ~minutę), oraz **darmowy dysk jest kasowany przy restarcie** — dlatego automatyczne kopie na serwerze traktuj jako wygodę, a nie jedyne zabezpieczenie.
- **Trwała kopia za darmo** (zalecane niezależnie od serwera): Ustawienia → „⬇ Kopia zapasowa" → zapisz plik do iCloud / Dysku Google. Plik jest zaszyfrowany — bez PIN-u bezużyteczny. Najlepiej raz dziennie po pracy.
- Pełna, automatyczna i trwała kopia na serwerze wymaga płatnego dysku Render (~7 USD/mies.) — opcjonalnie, w przyszłości.

## 5. Utrata / wymiana urządzenia

Nowe urządzenie → zainstaluj aplikację (pkt 1) → przejdź szybką konfigurację z dowolnym tymczasowym PIN-em → Ustawienia → ☁ Chmura → wpisz adres + klucz → **„⬇ Przywróć z chmury"** → wybierz kopię → zaloguj się PIN-em z chwili wykonania kopii. Wraca wszystko.

(Bez serwera: Ustawienia → „⬆ Przywróć z pliku" — wskaż plik kopii zapasowej.)

## 6. Własna domena (w przyszłości)

Gdy Offhand kupi domenę (np. `signoff.offhand.pl`): w repozytorium GitHub → Settings → Pages → Custom domain → wpisz domenę i ustaw rekord CNAME u rejestratora na `markulus1988.github.io`. Adres aplikacji zmieni się na własny — bez żadnych zmian w kodzie, a zainstalowane aplikacje wystarczy dodać ponownie z nowego adresu.

## 7. Bezpieczeństwo w pigułce

- Dane na urządzeniu i w chmurze są zaszyfrowane **AES-256** — serwer i GitHub nigdy nie widzą danych osobowych.
- 5 błędnych PIN-ów = rosnąca blokada konta.
- Każda zgoda ma kartę dowodową (audit trail), sumę SHA-256 i miejsce w łańcuchu integralności — przycisk **🛡 Weryfikuj integralność** wykrywa każdą manipulację.
- Auto-wylogowanie po 5 minutach bezczynności.
- **Aplikacja sama się aktualizuje** przy dostępie do internetu — gdy pojawi się nowa wersja, na dole wyświetla pasek **„Odśwież"** (albo wchodzi automatycznie przy następnym otwarciu). Nigdy nie przerywa zbierania zgody.
