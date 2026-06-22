# SignOff — włączenie maili (instrukcja dla Hani)

Po włączeniu: po każdej podpisanej zgodzie kopia PDF **sama wychodzi mailem** do osoby podpisującej.

Trzeba zrobić **dwie rzeczy, raz**: (1) wygenerować w Google specjalny „klucz" (hasło aplikacji), (2) wkleić go w aplikacji. Zajmuje ~5 minut.

> Dlaczego klucz, a nie zwykłe hasło? Google nie pozwala programom logować się zwykłym hasłem — od tego jest „hasło aplikacji". To 16 liter, które tworzysz raz i wklejasz w SignOff.

---

## WARIANT A — maile z Twojego adresu `hankanobis@offhandfilms.com`

### Część 1: wygeneruj klucz w Google (na komputerze)

1. Wejdź na **https://myaccount.google.com** i zaloguj się jako `hankanobis@offhandfilms.com`.
2. Po lewej kliknij **Bezpieczeństwo**.
3. Znajdź **„Weryfikacja dwuetapowa"** — jeśli jest **wyłączona, włącz ją** (poprowadzi Cię krok po kroku; potrzebny telefon). Bez tego nie da się utworzyć klucza.
4. Teraz wejdź na **https://myaccount.google.com/apppasswords**.
5. W polu nazwy wpisz **`SignOff`** → kliknij **Utwórz**.
6. Google pokaże **16 liter** w żółtej ramce (np. `abcd efgh ijkl mnop`). **Przepisz/skopiuj je — bez spacji**: `abcdefghijklmnop`.
   (Pokazują się tylko raz. Jak zgubisz — po prostu utworzysz nowy.)

> Nie widzisz „Haseł aplikacji"? To konto firmowe — wejdź do **admin.google.com** (jesteś administratorką domeny offhandfilms.com) → Bezpieczeństwo → i zezwól na hasła aplikacji. Jeśli to za trudne, **zrób WARIANT B** poniżej — jest prostszy.

### Część 2: wklej klucz w aplikacji SignOff (na każdym urządzeniu)

1. W SignOff: **Ustawienia → ✉ Wysyłka e-mail**.
2. **Adres e-mail nadawcy:** `hankanobis@offhandfilms.com`
3. **Hasło:** wklej te **16 liter bez spacji**.
4. (opcjonalnie) **Nazwa nadawcy:** `Offhand — zgody`
5. Kliknij **💾 Zapisz nadawcę**.
6. Kliknij **✉ Wyślij test do siebie** → wpisz swój adres → sprawdź skrzynkę (zajrzyj też do SPAM-u).

✅ Jeśli test przyszedł — **gotowe**. Kopie zgód wychodzą same (ta opcja jest włączona domyślnie).

---

## WARIANT B — osobny, nowy adres tylko do zgód (najprostszy)

Jeśli nie chcesz używać swojego firmowego maila albo „hasła aplikacji" tam nie ma — załóż **nowe darmowe konto Gmail** wyłącznie do wysyłki zgód.

1. Wejdź na **https://accounts.google.com/signup** → załóż konto, np. **`zgody.offhand@gmail.com`** (jakikolwiek wolny adres).
2. Na tym nowym koncie zrób **Część 1** z Wariantu A (włącz weryfikację dwuetapową → utwórz hasło aplikacji „SignOff").
3. W SignOff zrób **Część 2**, ale jako adres nadawcy wpisz **ten nowy adres** (`zgody.offhand@gmail.com`) i jego 16-literowy klucz.

> Plus: jeden adres tylko do zgód, nic nie miesza Ci się ze służbową skrzynką. Zwykły Gmail wysyła do ~500 maili dziennie — aż nadto.

---

## Reset zapomnianego PIN-u (dla wszystkich — nikt nie musi nic pamiętać)

- **Pracownik zapomniał PIN-u** → mówi Hani. Hania: zaloguj się → **Ustawienia → Konta** → przy jego koncie **🔑 Reset PIN** → wpisz nowy PIN. Gotowe (5 sekund).
- **Hania zapomniała swój PIN** → na ekranie logowania **„Nie pamiętam PIN-u"** → wklej **kod odzyskiwania** (przyszedł mailem przy zakładaniu konta, temat „SignOff — kod odzyskiwania") + nowy PIN → logujesz się od razu.

> Po włączeniu maili (Wariant A/B) wejdź raz: **Ustawienia → Konta → 🆘 Kod odzyskiwania** — kod wyśle się na maila i będzie czekał w skrzynce. Dzięki temu nawet jak zapomnisz PIN-u, odzyskasz dostęp bez niczyjej pomocy.
> Dobrze mieć **dwóch adminów** (Hania + Marek) — wtedy jeden zawsze może zresetować drugiego.
