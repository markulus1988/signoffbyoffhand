# SignOff by Offhand — prosta instrukcja

*Przygotował Marek Żak dla Offhand Hanna Nobis.*

## 1. Instalacja na tablecie / telefonie (Android i iOS)

1. Otwórz w przeglądarce adres aplikacji: **https://signoffbyoffhand.github.io/**
   (docelowo własna domena Offhand — patrz pkt 7).
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
- Reset zapomnianego PIN-u: użytkownik sam — ekran logowania → **„Nie pamiętam PIN-u"** → kod odzyskiwania lub prośba do admina. Szczegóły: **MAILE-I-RESET.md**.

## 4. Zgody i dokumenty do podpisu (Ustawienia → „📋 Zgody i dokumenty")

Tworzysz treść **raz** i przypinasz do dowolnych projektów. Dwa rodzaje:
- **📝 Zgoda** — treść do przeczytania i zaakceptowania; wchodzi w treść podpisywanej zgody.
- **📎 Dokument** — plik (regulamin/umowa) do wglądu i akceptacji przy podpisie.

**Dodanie:** Ustawienia → **📋 Zgody i dokumenty** → wybierz rodzaj, wpisz nazwę i krótki opis. Treść dodajesz najprościej na dwa sposoby (zalecane):
- **wklej tekst** w okienko, albo
- **wgraj gotowy PDF**.

Word też zadziała (zamieni się na PDF), ale przy złożonym formatowaniu (tabele, grafiki) lepiej w Wordzie „Zapisz jako PDF" i wgrać PDF — sprawdź wynik przyciskiem 👁. Następnie zaznacz, **do których projektów** treść ma trafić.

Przy każdej pozycji widać tagi 📁 projektów, do których należy. Możesz ją **przypiąć/odpiąć** od dowolnych projektów (jeden lub wiele), **⧉ skopiować** (np. lekko zmienić i dać do innego projektu), edytować lub usunąć.

**Z poziomu projektu** (Ustawienia → Firma i projekty → projekt) jest to samo: „➕ Przypnij istniejącą", „＋ Nowa zgoda/dokument tu" oraz edycja samego projektu (nazwa, własna treść, administrator danych, uprawnieni, zdjęcie obowiązkowe).

> Już podpisane zgody się nie zmieniają — edycja treści w bibliotece dotyczy tylko **nowych** podpisów.

## 5. Automatyczne e-maile + kopia w chmurze (Firebase)

Dwie rzeczy działają w tle: **automatyczny e-mail** z PDF-em do osoby podpisującej oraz **zaszyfrowana kopia** danych w chmurze (Firebase). Aplikacja działa też bez nich.

- **Maile:** włącza je Marek raz (jeden klucz — „hasło aplikacji" Google ustawiane po stronie serwera). Hania nic nie wpisuje. Pełna, krótka instrukcja: **MAILE-I-RESET.md**.
- **Kopia w chmurze (E2E):** Ustawienia → **☁ Chmura (Firebase)** → wklej `apiKey`/`projectId`/`storageBucket` + e-mail i hasło konta technicznego → „Zapisz i testuj". Konfiguracja konta: **FIREBASE-SETUP.md**.

### Ile to kosztuje
- **Maile: darmowe** (Gmail/Workspace ~500/dobę — na zgody aż nadto).
- **Firebase:** plan **Blaze** (rozliczany od zużycia), ale dla tej skali zużycie mieści się w darmowym progu — realnie ~0 zł.
- **Trwała kopia awaryjna** (zalecane dodatkowo): Ustawienia → „⬇ Kopia zapasowa" → zapisz plik do iCloud / Dysku Google. Plik jest zaszyfrowany — bez PIN-u bezużyteczny. Najlepiej raz dziennie po pracy.

## 6. Utrata / wymiana urządzenia

Nowe urządzenie → zainstaluj aplikację (pkt 1) → przejdź szybką konfigurację z dowolnym tymczasowym PIN-em → Ustawienia → ☁ Chmura (Firebase) → wpisz dane projektu + konto techniczne → **„⬇ Przywróć z chmury"** → wybierz kopię → zaloguj się PIN-em z chwili wykonania kopii. Wraca wszystko.

(Bez chmury: Ustawienia → „⬆ Przywróć z pliku" — wskaż plik kopii zapasowej.)

## 7. Własna domena (w przyszłości)

Gdy Offhand kupi domenę (np. `signoff.offhand.pl`): w repozytorium GitHub → Settings → Pages → Custom domain → wpisz domenę i ustaw rekord CNAME u rejestratora na `signoffbyoffhand.github.io`. Adres aplikacji zmieni się na własny — bez żadnych zmian w kodzie, a zainstalowane aplikacje wystarczy dodać ponownie z nowego adresu.

## 8. Bezpieczeństwo w pigułce

- Dane na urządzeniu i w chmurze są zaszyfrowane **AES-256** — serwer i GitHub nigdy nie widzą danych osobowych.
- 5 błędnych PIN-ów = rosnąca blokada konta.
- Każda zgoda ma kartę dowodową (audit trail), sumę SHA-256 i miejsce w łańcuchu integralności — przycisk **🛡 Weryfikuj integralność** wykrywa każdą manipulację.
- Auto-wylogowanie po 5 minutach bezczynności.
- **Aplikacja sama się aktualizuje** przy dostępie do internetu — gdy pojawi się nowa wersja, na dole wyświetla pasek **„Odśwież"** (albo wchodzi automatycznie przy następnym otwarciu). Nigdy nie przerywa zbierania zgody.
