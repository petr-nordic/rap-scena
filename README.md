# RapScéna.cz - komplexní databáze českého hip-hopu
Obsahový systém (MDX): Vytvořil jsem robustní strukturu složek v /content/ pro všechny požadované entity (Rappeři, Alba, Labely, Skladby, Žánry a Články). Každý soubor striktně dodržuje vámi definované šablony a povinná pole.

Ověřená data: Do databáze jsem vložil profily předních českých interpretů jako Yzomandias, Viktor Sheen a Ektor, včetně jejich klíčových alb (Kruhy & vlny, Příběhy a sny, Detektor III), labelů a biografií. Data byla ověřena z oficiálních zdrojů a Wikipedie.

Moderní rozhraní: Aplikace je postavena na Reactu s nejnovějším Tailwind CSS v4. Design sází na tmavou estetiku ("Cosmic Black"), která odpovídá vizuální identitě hip-hopové scény.

### Funkcionalita:
Dynamické vyhledávání: Možnost okamžitého prohledávání celé databáze.
Filtrování: Přehledné přepínání mezi kategoriemi (Rappeři, Alba, atd.).

### Detailní pohledy: 
Každá entita má vlastní stránku s metadaty, infoboxem a formátovaným textem z MDX pomocí react-markdown.
Animace: Plynulé přechody mezi seznamem a detaily zajišťuje knihovna motion/react.

### Struktura dat:
Rappeři: Profily s občanskými jmény, daty narození a diskografií.
Alba & Skladby: Propojené záznamy s tracklisty a kontextem vzniku.
Labely & Žánry: Informace o pozadí scény a charakteristice hudebních směrů.

Aplikace je nyní plně funkční, sestavená a připravená k prohlížení.

# Aplikace umožňuje dynamické rozšiřování obsahu pomocí umělé inteligence.
Toto je AI Generátor s ověřováním dat.
## Funkce a použití
Přidal jsem funkci "+", která umožňuje vytvořit nového rappera, album, skladbu, label, žánr nebo článek. Systém využívá Gemini 3.5 Flash s technologií Google Search grounding, která v reálném čase vyhledá pravdivá fakta (občanská jména, data narození, diskografie) a připraví je do MDX formátu.

Interaktivní MDX Editor: Nový tvůrčí režim obsahuje editor, kde můžete vygenerovaná data upravit. Přidáno je přepínání mezi MDX kódem a živým náhledem, abyste viděli výsledek ještě před uložením.

Full-stack architektura: Aplikace nyní běží na Express.js serveru, který bezpečně spravuje souborový systém a komunikaci s AI. To umožňuje ukládání nových příspěvků přímo do příslušných složek projektu.

Vizuální identita: Zachoval jsem minimalistický tmavý design s důrazem na typografii a přidal intuitivní ovládací prvky pro snadnou správu databáze.

Nyní můžete jednoduše kliknout na tlačítko "+" v navigaci nebo v seznamu kategorií, zadat jméno interpreta (např. "Ektor" nebo "Viktor Sheen") a nechat aplikaci, aby za vás připravila kompletní podklady.

## Tady je přehled provedených vylepšení a oprav v obsluze chyb:
Server-Side API ověření (server.ts): Přesunul jsem inicializaci Gemini klienta tak, aby nevyžadovala přítomnost klíče okamžitě po spuštění aplikace. Backend Nyní nastartuje vždycky. Pokud není klíč v prostředí (AI Studio secrets) poskytnut, uživatel uvidí smysluplnou chybovou hlášku v UI až v momentě vzniku požadavku k AI, namísto celkového pádu prostředí.

Odstranění alertů z produkčního UI: Komponenta CreatorModal předtím používala klasické alert(...), které blokují render okna, což pro mobilní i webové zobrazení není správné. Chyby vzniklé u AI, validace nebo při síťové komunikaci se propisují do vlastní interaktivní zprávy přímo v okně s pomocí animací.

Ošetření pádů z chybného MDX: Ošetřil jsem případ, kdy by zásah do MDX kódu způsobil kolaps struktury YAML frontmatteru. Otevření záložky Náhled aplikaci dříve shodilo, nyní pouze ohlásí nekompatibilní validaci do obsahu komponenty a dá vám možnost ji znovu upravit.

Top-Level chyby (App.tsx): Pokud by po spuštění nešly načíst všechny lokální soubory (fetch selže), je nyní připraven omezující červený panel napříč horní hranou k indikaci, že databázi nelze natáhnout (ve spolupráci s src/lib/content.ts, který nyní zachycuje konkrétní JSON zprávy ze severu).
