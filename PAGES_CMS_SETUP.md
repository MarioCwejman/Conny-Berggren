# Pages CMS Setup

Det har repot ar forberett for att anvanda Pages CMS som riktig editor och GitHub Pages som publicering.

## Det som redan finns

- `.pages.yml` i repo-roten beskriver editorn.
- `Production_First_Draft/content/site-content.json` innehaller allt redigerbart innehall.
- `Production_First_Draft/index.html` och `Production_First_Draft/script.js` laser innehallet darifran.
- `.github/workflows/deploy-pages.yml` publicerar `Production_First_Draft` till GitHub Pages vid push till `main`.

## Sa slar du pa editorn

1. Pusha repot till GitHub.
2. Se till att klientens GitHub-konto har skrivaatkomst till repot.
3. Oppna `https://app.pagescms.org`.
4. Logga in med GitHub.
5. Ge Pages CMS atkomst till repot `MarioCwejman/Conny-Berggren`.
6. Oppna posten `Startsida`.
7. Andra innehallet och spara.

## Hur klienten ska anvanda det

1. Oppna Pages CMS.
2. Klicka pa `Startsida`.
3. Andra falten.
4. Klicka pa `Save`.
5. Vanta pa att GitHub Pages-deployen blir klar.

## Viktigt att veta

- Den lokala sidan `Production_First_Draft/editor-sketch.html` ar nu en start- och hjalpsida, inte sjalva editorn.
- Den riktiga editorn ligger i Pages CMS.
- GitHub Pages ar nu forberett som publiceringsvag for webbplatsen.
- Pages CMS kraver GitHub-inloggning for att skriva tillbaka andringar till repot.
- I GitHub-repots `Settings -> Pages` ska `Source` vara satt till `GitHub Actions`.
