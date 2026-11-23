/* Copilot readiness check.
   All copy lives in TEXT below, one block per language; the page's <html lang> picks the block.
   Each question has three answers worth 2, 1 and 0 points, plus "Not sure" (0 points).
   Answers are kept only in this browser (localStorage) and in the results link (#r=...). */
(() => {
  'use strict';

  const EMAIL = 'vitalijus@opusmeum.net';
  const AREA_WEIGHT = [1, 2, 1.5, 1, 1];          // access and sharing weigh most
  const AREA_OF = [0,0,0, 1,1,1, 2,2,2, 3,3,3, 4,4,4];
  // Answers that stop a rollout whatever the total: [question index, answers that trigger it]
  const CRITICAL = [[1, ['2']], [3, ['2', 'n']], [4, ['2']]];

  const TEXT = {
    en: {
      h1: 'Is your Microsoft 365 ready for Copilot?',
      lede: 'Copilot can find and summarize anything a person already has access to. This check looks at sign-in, sharing, data protection, people and agents, and tells you what to fix first.',
      facts: '15 questions, about 5 minutes. Your answers stay in this browser.',
      start: 'Start the check', resume: 'Continue the check', restart: 'Start again',
      areas: ['Foundations', 'Access and sharing', 'Data protection', 'People and use cases', 'Agents and rollout'],
      count: (n, t) => `Question ${n} of ${t}`,
      back: 'Back', notSure: 'Not sure',
      outOf: 'out of 100',
      bands: {
        fix: ['Fix access and sign-in before Copilot.', 'Copilot shows each person anything they can already open. Close the gaps below first, then start a small pilot.'],
        low: ['Fix the basics before Copilot.', 'Several foundations are missing. The steps below are the order we would take them in.'],
        mid: ['Ready for a small pilot after a few fixes.', 'The basics are there. Fix the points below for the teams in your pilot, and keep the rest of the organization for later.'],
        high: ['Ready for a pilot.', 'Your foundations are in good shape. Start with a pilot group and use the points below to prepare the wider rollout.'],
        top: ['Ready to roll out.', 'You have covered the main risks. Keep reviewing access and agents as Copilot use grows.']
      },
      fixesTitle: 'What to fix first',
      nothing: 'Nothing urgent. Review site access every quarter and track how people use Copilot.',
      sendText: 'Email these results to Opus Meum and we will reply with what we would do first in your tenant.',
      email: 'Email the results', copy: 'Copy the results', copied: 'Copied',
      note: 'This is a self-check, not an audit. Some fixes need Microsoft licenses beyond your base plan.',
      subject: s => `Copilot readiness check: ${s}/100`,
      body: (s, band, areas, fixes, link) =>
        `Hello,\n\nHere are our Copilot readiness check results.\n\nOverall: ${s} out of 100. ${band}\n\n${areas}\n\nFix first:\n${fixes}\n\nFull results: ${link}\n\nCompany:\nName:\n`,
      footer: 'Microsoft Power Platform and AI consultancy',
      q: [
        ['Which Microsoft 365 plan do most of your staff have?',
          ['Business Standard, Business Premium, E3 or E5', 'Business Basic, frontline plans or a mix', 'We are not on Microsoft 365 yet'],
          'Confirm each group’s plan', 'Check that each team’s plan qualifies for Copilot and which apps they will use it in. Web-only plans limit where Copilot appears.'],
        ['Do all staff sign in with multi-factor authentication?',
          ['Yes, everyone, with Conditional Access policies', 'Most people, or MFA without Conditional Access', 'Only some people, or nobody'],
          'Turn on MFA for everyone', 'With Copilot, one stolen password can search everything that person can open. Require MFA for every account before rollout.'],
        ['Where do people keep their working files?',
          ['Mostly in OneDrive, SharePoint and Teams', 'Split between Microsoft 365 and file servers or other drives', 'Mostly on file servers, laptops or another cloud'],
          'Move active work into Microsoft 365', 'Copilot works with what is in Microsoft 365 or connected to it. Move current files into SharePoint and OneDrive, or plan connectors for the systems that stay.'],
        ['How are SharePoint sites and Teams with sensitive content shared?',
          ['Only with the groups that need them', 'A few sites are open to the whole organization', 'Many sites are open to everyone in the organization'],
          'Close sites open to everyone', 'Find sites shared with “Everyone” or “Everyone except external users” and narrow them. SharePoint Advanced Management, included with Copilot licenses, has reports for this.'],
        ['What does a new sharing link default to?',
          ['Specific people', 'People in your organization', 'Anyone with the link'],
          'Default sharing links to specific people', 'Change the tenant default so files stop spreading wider than intended each time they are shared.'],
        ['Does every site have an owner who reviews who has access?',
          ['Yes, owners review access at least once a year', 'Owners exist, but rarely review access', 'Many sites have no active owner'],
          'Give every site an owner who reviews access', 'Assign active owners and run site access reviews. SharePoint Advanced Management can ask owners to review access for you.'],
        ['Do you label sensitive documents, for example as Confidential?',
          ['Yes, with sensitivity labels that people use', 'Labels exist but are rarely applied', 'No labels'],
          'Start with a few sensitivity labels', 'Publish three or four Microsoft Purview labels and apply them to your most sensitive sites first. New content Copilot writes from labelled files carries the label.'],
        ['Do you have rules for what staff can put into AI tools?',
          ['A written AI use policy that staff know about', 'Informal guidance only', 'No rules yet'],
          'Write a one-page AI use policy', 'Say which AI tools are approved, which data must never go into other tools, and who to ask when unsure.'],
        ['Can you look back at Copilot activity if you need to investigate?',
          ['Audit is on and retention for Copilot is set', 'Audit is on, retention is not set', 'Not set up, or we do not know'],
          'Set up audit and retention for Copilot', 'Check that Microsoft Purview Audit is on and decide how long Copilot prompts and responses are kept.'],
        ['Have you chosen the first tasks Copilot should help with?',
          ['Yes, specific tasks per team, with the time they take today', 'General ideas, nothing specific yet', 'Not yet'],
          'Pick the first tasks', 'Choose three to five repetitive tasks, such as meeting follow-ups or first drafts of reports, and note how long they take today.'],
        ['Who will help colleagues learn Copilot?',
          ['Named champions in each team, plus training', 'IT will answer questions', 'No plan yet'],
          'Name a champion in each team', 'Pick one person per team and run short sessions built on real examples from that team’s work.'],
        ['How will you decide whether Copilot is worth the license cost?',
          ['Agreed measures and a date to review them', 'We will look at usage reports', 'Not decided'],
          'Agree how you will measure value', 'Choose two or three measures before the pilot, such as hours saved on a task, and set a date to decide who keeps a license.'],
        ['Who can build and share agents and Power Platform apps?',
          ['Makers work in managed environments with data policies', 'Anyone can build, with some data policies', 'Anyone can build, with no data policies'],
          'Set rules for agents and apps', 'Add Power Platform data loss prevention policies and separate environments for makers, so agents cannot connect sensitive data to the wrong places.'],
        ['How current is the content in SharePoint and Teams?',
          ['Old and duplicate content is archived regularly', 'Some clean-up, but many old versions remain', 'Nobody cleans up'],
          'Archive outdated content', 'Copilot answers from what it finds, so old policies and drafts lead to wrong answers. Archive stale sites and remove duplicates.'],
        ['Do you have a plan for a first pilot group?',
          ['Yes: who, for how long, and what they report back', 'We know who, but not the details', 'No plan yet'],
          'Plan a pilot', 'Start with 10 to 30 people across a few teams for six to eight weeks, then widen access based on what you learn.']
      ]
    },

    lt: {
      h1: 'Ar jūsų Microsoft 365 pasirengęs Copilot?',
      lede: 'Copilot gali surasti ir apibendrinti viską, prie ko žmogus jau turi prieigą. Šis patikrinimas įvertina prisijungimą, bendrinimą, duomenų apsaugą, žmones ir agentus, ir parodo, ką taisyti pirmiausia.',
      facts: '15 klausimų, apie 5 minutės. Jūsų atsakymai lieka šioje naršyklėje.',
      start: 'Pradėti patikrinimą', resume: 'Tęsti patikrinimą', restart: 'Pradėti iš naujo',
      areas: ['Pagrindai', 'Prieiga ir bendrinimas', 'Duomenų apsauga', 'Žmonės ir užduotys', 'Agentai ir diegimas'],
      count: (n, t) => `${n} klausimas iš ${t}`,
      back: 'Atgal', notSure: 'Nežinau',
      outOf: 'iš 100',
      bands: {
        fix: ['Prieš Copilot sutvarkykite prieigą ir prisijungimą.', 'Copilot kiekvienam žmogui parodo viską, ką jis jau gali atidaryti. Pirmiausia pašalinkite žemiau nurodytas spragas, tada pradėkite nedidelį bandomąjį diegimą.'],
        low: ['Prieš Copilot sutvarkykite pagrindus.', 'Trūksta kelių pagrindinių dalykų. Žemiau nurodyta tvarka, kuria juos spręstume mes.'],
        mid: ['Pasirengę nedideliam bandomajam diegimui po kelių pataisymų.', 'Pagrindai yra. Pataisykite žemiau nurodytus dalykus bandomojo diegimo komandoms, o likusią organizaciją palikite vėlesniam etapui.'],
        high: ['Pasirengę bandomajam diegimui.', 'Pagrindai geros būklės. Pradėkite nuo bandomosios grupės, o žemiau nurodytus dalykus panaudokite platesniam diegimui pasirengti.'],
        top: ['Pasirengę diegti.', 'Pagrindines rizikas suvaldėte. Augant Copilot naudojimui, toliau peržiūrėkite prieigas ir agentus.']
      },
      fixesTitle: 'Ką taisyti pirmiausia',
      nothing: 'Nieko skubaus. Kas ketvirtį peržiūrėkite svetainių prieigas ir stebėkite, kaip žmonės naudoja Copilot.',
      sendText: 'Atsiųskite šiuos rezultatus Opus Meum, ir mes atsakysime, ką jūsų aplinkoje darytume pirmiausia.',
      email: 'Siųsti rezultatus el. paštu', copy: 'Kopijuoti rezultatus', copied: 'Nukopijuota',
      note: 'Tai savęs įvertinimas, ne auditas. Kai kuriems pataisymams reikia papildomų Microsoft licencijų.',
      subject: s => `Copilot pasirengimo patikrinimas: ${s}/100`,
      body: (s, band, areas, fixes, link) =>
        `Sveiki,\n\nsiunčiame savo Copilot pasirengimo patikrinimo rezultatus.\n\nBendras rezultatas: ${s} iš 100. ${band}\n\n${areas}\n\nKą taisyti pirmiausia:\n${fixes}\n\nVisi rezultatai: ${link}\n\nĮmonė:\nVardas:\n`,
      footer: 'Microsoft Power Platform ir DI konsultacijos',
      q: [
        ['Kokį Microsoft 365 planą turi dauguma jūsų darbuotojų?',
          ['Business Standard, Business Premium, E3 arba E5', 'Business Basic, frontline planus arba jų derinį', 'Microsoft 365 dar nenaudojame'],
          'Patikrinkite kiekvienos grupės planą', 'Įsitikinkite, kad kiekvienos komandos planas tinka Copilot ir kuriose programose jį naudos. Tik naršyklės planai riboja, kur Copilot veikia.'],
        ['Ar visi darbuotojai jungiasi naudodami kelių veiksnių autentifikavimą (MFA)?',
          ['Taip, visi, su sąlyginės prieigos (Conditional Access) politikomis', 'Dauguma, arba MFA be sąlyginės prieigos', 'Tik dalis žmonių arba niekas'],
          'Įjunkite MFA visiems', 'Su Copilot vienu pavogtu slaptažodžiu galima ieškoti visur, ką tas žmogus gali atidaryti. Prieš diegimą reikalaukite MFA kiekvienai paskyrai.'],
        ['Kur žmonės laiko darbo failus?',
          ['Daugiausia OneDrive, SharePoint ir Teams', 'Dalis Microsoft 365, dalis failų serveriuose ar kituose diskuose', 'Daugiausia failų serveriuose, kompiuteriuose ar kitame debesyje'],
          'Perkelkite aktualų darbą į Microsoft 365', 'Copilot dirba su tuo, kas yra Microsoft 365 arba prie jo prijungta. Perkelkite aktualius failus į SharePoint ir OneDrive arba suplanuokite jungtis likusioms sistemoms.'],
        ['Kaip bendrinamos SharePoint svetainės ir Teams su jautriu turiniu?',
          ['Tik su grupėmis, kurioms jų reikia', 'Kelios svetainės atviros visai organizacijai', 'Daug svetainių atviros visiems organizacijos žmonėms'],
          'Uždarykite visiems atviras svetaines', 'Raskite svetaines, bendrinamas su „Everyone“ arba „Everyone except external users“, ir susiaurinkite prieigą. SharePoint Advanced Management, įtrauktas į Copilot licencijas, turi tam skirtas ataskaitas.'],
        ['Kokia numatytoji naujos bendrinimo nuorodos parinktis?',
          ['Konkretūs žmonės', 'Žmonės jūsų organizacijoje', 'Bet kas, turintis nuorodą'],
          'Nustatykite nuorodas konkretiems žmonėms', 'Pakeiskite numatytąją nuostatą, kad failai, juos bendrinant, nepasiektų platesnio rato, nei numatyta.'],
        ['Ar kiekviena svetainė turi savininką, kuris peržiūri prieigas?',
          ['Taip, savininkai peržiūri prieigas bent kartą per metus', 'Savininkai yra, bet prieigas peržiūri retai', 'Daug svetainių neturi aktyvaus savininko'],
          'Kiekvienai svetainei paskirkite savininką', 'Paskirkite aktyvius savininkus ir atlikite prieigų peržiūras. SharePoint Advanced Management gali paprašyti savininkų peržiūrėti prieigas.'],
        ['Ar žymite jautrius dokumentus, pavyzdžiui, „Konfidencialu“?',
          ['Taip, jautrumo žymomis (sensitivity labels), kurias žmonės naudoja', 'Žymos yra, bet naudojamos retai', 'Žymų nėra'],
          'Pradėkite nuo kelių jautrumo žymų', 'Paskelbkite tris ar keturias Microsoft Purview žymas ir pirmiausia pritaikykite jas jautriausioms svetainėms. Copilot iš pažymėtų failų sukurtas turinys paveldi žymą.'],
        ['Ar turite taisykles, ką darbuotojai gali įkelti į DI įrankius?',
          ['Rašytinė DI naudojimo politika, kurią darbuotojai žino', 'Tik neformalūs patarimai', 'Taisyklių dar nėra'],
          'Parašykite vieno puslapio DI naudojimo politiką', 'Nurodykite, kurie DI įrankiai patvirtinti, kokių duomenų negalima dėti į kitus įrankius ir į ką kreiptis abejojant.'],
        ['Ar galite peržiūrėti Copilot veiklą, jei reikia ką nors ištirti?',
          ['Auditas įjungtas, Copilot saugojimo trukmė nustatyta', 'Auditas įjungtas, saugojimo trukmė nenustatyta', 'Nenustatyta arba nežinome'],
          'Nustatykite Copilot auditą ir saugojimą', 'Patikrinkite, ar įjungtas Microsoft Purview auditas, ir nuspręskite, kiek laiko saugoti Copilot užklausas ir atsakymus.'],
        ['Ar pasirinkote pirmąsias užduotis, kurioms padės Copilot?',
          ['Taip, konkrečias kiekvienos komandos užduotis, žinome, kiek laiko jos užima dabar', 'Bendros idėjos, nieko konkretaus', 'Dar ne'],
          'Pasirinkite pirmąsias užduotis', 'Išrinkite tris–penkias pasikartojančias užduotis, pavyzdžiui, susitikimų apibendrinimus ar ataskaitų juodraščius, ir užsirašykite, kiek laiko jos užima dabar.'],
        ['Kas padės kolegoms išmokti naudotis Copilot?',
          ['Kiekvienoje komandoje paskirti ambasadoriai ir mokymai', 'Į klausimus atsakys IT', 'Plano dar nėra'],
          'Kiekvienoje komandoje paskirkite ambasadorių', 'Išrinkite po vieną žmogų kiekvienoje komandoje ir surenkite trumpus mokymus su realiais tos komandos darbo pavyzdžiais.'],
        ['Kaip nuspręsite, ar Copilot verta licencijos kainos?',
          ['Sutarti rodikliai ir data jiems peržiūrėti', 'Žiūrėsime naudojimo ataskaitas', 'Nenuspręsta'],
          'Sutarkite, kaip matuosite naudą', 'Prieš bandomąjį diegimą pasirinkite du ar tris rodiklius, pavyzdžiui, sutaupytas valandas, ir nustatykite datą, kada spręsite, kam licencija lieka.'],
        ['Kas gali kurti ir bendrinti agentus bei Power Platform programėles?',
          ['Kūrėjai dirba valdomose aplinkose su duomenų politikomis', 'Kurti gali visi, yra kelios duomenų politikos', 'Kurti gali visi, duomenų politikų nėra'],
          'Nustatykite taisykles agentams ir programėlėms', 'Įdiekite Power Platform duomenų praradimo prevencijos (DLP) politikas ir atskiras aplinkas kūrėjams, kad agentai negalėtų sujungti jautrių duomenų su netinkamomis vietomis.'],
        ['Kiek aktualus turinys SharePoint ir Teams?',
          ['Senas ir pasikartojantis turinys reguliariai archyvuojamas', 'Šiek tiek tvarkoma, bet daug senų versijų lieka', 'Niekas netvarko'],
          'Suarchyvuokite pasenusį turinį', 'Copilot atsako pagal tai, ką randa, todėl senos politikos ir juodraščiai lemia klaidingus atsakymus. Suarchyvuokite nebenaudojamas svetaines ir pašalinkite dublikatus.'],
        ['Ar turite pirmosios bandomosios grupės planą?',
          ['Taip: kas, kiek laiko ir ką jie mums praneša', 'Žinome kas, bet ne detales', 'Plano dar nėra'],
          'Suplanuokite bandomąjį diegimą', 'Pradėkite nuo 10–30 žmonių iš kelių komandų šešioms–aštuonioms savaitėms, tada plėskite prieigą pagal tai, ką sužinosite.']
      ]
    },

    de: {
      h1: 'Ist Ihr Microsoft 365 bereit für Copilot?',
      lede: 'Copilot findet und fasst alles zusammen, worauf eine Person bereits Zugriff hat. Dieser Check prüft Anmeldung, Freigaben, Datenschutz, Menschen und Agenten und zeigt Ihnen, was Sie zuerst angehen sollten.',
      facts: '15 Fragen, etwa 5 Minuten. Ihre Antworten bleiben in diesem Browser.',
      start: 'Check starten', resume: 'Check fortsetzen', restart: 'Neu beginnen',
      areas: ['Grundlagen', 'Zugriff und Freigaben', 'Datenschutz', 'Menschen und Aufgaben', 'Agenten und Einführung'],
      count: (n, t) => `Frage ${n} von ${t}`,
      back: 'Zurück', notSure: 'Weiß nicht',
      outOf: 'von 100',
      bands: {
        fix: ['Erst Zugriff und Anmeldung absichern, dann Copilot.', 'Copilot zeigt jeder Person alles, was sie bereits öffnen kann. Schließen Sie zuerst die Lücken unten und starten Sie dann einen kleinen Pilot.'],
        low: ['Erst die Grundlagen schaffen, dann Copilot.', 'Mehrere Grundlagen fehlen noch. Unten steht die Reihenfolge, in der wir sie angehen würden.'],
        mid: ['Bereit für einen kleinen Pilot nach einigen Korrekturen.', 'Die Grundlagen sind da. Beheben Sie die Punkte unten für die Pilotteams und nehmen Sie den Rest des Unternehmens später dazu.'],
        high: ['Bereit für einen Pilot.', 'Ihre Grundlagen sind gut aufgestellt. Starten Sie mit einer Pilotgruppe und bereiten Sie mit den Punkten unten die breite Einführung vor.'],
        top: ['Bereit für die Einführung.', 'Die wichtigsten Risiken sind abgedeckt. Prüfen Sie Zugriffe und Agenten weiter, während die Nutzung wächst.']
      },
      fixesTitle: 'Was Sie zuerst angehen sollten',
      nothing: 'Nichts Dringendes. Prüfen Sie den Websitezugriff jedes Quartal und beobachten Sie, wie Copilot genutzt wird.',
      sendText: 'Senden Sie diese Ergebnisse an Opus Meum. Wir antworten Ihnen, was wir in Ihrem Tenant zuerst tun würden.',
      email: 'Ergebnisse per E-Mail senden', copy: 'Ergebnisse kopieren', copied: 'Kopiert',
      note: 'Dies ist eine Selbsteinschätzung, kein Audit. Manche Maßnahmen brauchen Microsoft-Lizenzen über Ihren Basisplan hinaus.',
      subject: s => `Copilot-Readiness-Check: ${s}/100`,
      body: (s, band, areas, fixes, link) =>
        `Hallo,\n\nhier sind unsere Ergebnisse des Copilot-Readiness-Checks.\n\nGesamt: ${s} von 100. ${band}\n\n${areas}\n\nZuerst angehen:\n${fixes}\n\nAlle Ergebnisse: ${link}\n\nUnternehmen:\nName:\n`,
      footer: 'Beratung für Microsoft Power Platform und KI',
      q: [
        ['Welchen Microsoft-365-Plan haben die meisten Ihrer Mitarbeitenden?',
          ['Business Standard, Business Premium, E3 oder E5', 'Business Basic, Frontline-Pläne oder eine Mischung', 'Wir nutzen Microsoft 365 noch nicht'],
          'Pläne je Gruppe prüfen', 'Prüfen Sie, ob der Plan jedes Teams für Copilot infrage kommt und in welchen Apps es Copilot nutzen wird. Reine Web-Pläne schränken ein, wo Copilot verfügbar ist.'],
        ['Melden sich alle Mitarbeitenden mit mehrstufiger Authentifizierung (MFA) an?',
          ['Ja, alle, mit Richtlinien für bedingten Zugriff', 'Die meisten, oder MFA ohne bedingten Zugriff', 'Nur einige oder niemand'],
          'MFA für alle einschalten', 'Mit Copilot kann ein gestohlenes Passwort alles durchsuchen, was diese Person öffnen kann. Verlangen Sie vor der Einführung MFA für jedes Konto.'],
        ['Wo liegen die Arbeitsdateien Ihrer Mitarbeitenden?',
          ['Überwiegend in OneDrive, SharePoint und Teams', 'Teils in Microsoft 365, teils auf Fileservern oder anderen Laufwerken', 'Überwiegend auf Fileservern, Laptops oder in einer anderen Cloud'],
          'Aktuelle Arbeit nach Microsoft 365 holen', 'Copilot arbeitet mit dem, was in Microsoft 365 liegt oder daran angebunden ist. Verschieben Sie aktuelle Dateien nach SharePoint und OneDrive oder planen Sie Connectoren für die übrigen Systeme.'],
        ['Wie sind SharePoint-Websites und Teams mit sensiblen Inhalten freigegeben?',
          ['Nur für die Gruppen, die sie brauchen', 'Einige Websites sind für das ganze Unternehmen offen', 'Viele Websites sind für alle im Unternehmen offen'],
          'Für alle offene Websites schließen', 'Finden Sie Websites, die für „Everyone“ oder „Everyone except external users“ freigegeben sind, und schränken Sie sie ein. SharePoint Advanced Management, in Copilot-Lizenzen enthalten, bietet dafür Berichte.'],
        ['Was ist die Standardeinstellung für neue Freigabelinks?',
          ['Bestimmte Personen', 'Personen in Ihrem Unternehmen', 'Jeder mit dem Link'],
          'Freigabelinks standardmäßig auf bestimmte Personen setzen', 'Ändern Sie die Standardeinstellung, damit sich Dateien beim Teilen nicht weiter verbreiten als beabsichtigt.'],
        ['Hat jede Website einen Besitzer, der die Zugriffe prüft?',
          ['Ja, Besitzer prüfen die Zugriffe mindestens einmal im Jahr', 'Besitzer gibt es, aber sie prüfen selten', 'Viele Websites haben keinen aktiven Besitzer'],
          'Jeder Website einen Besitzer geben', 'Benennen Sie aktive Besitzer und führen Sie Zugriffsprüfungen durch. SharePoint Advanced Management kann Besitzer zur Prüfung auffordern.'],
        ['Kennzeichnen Sie sensible Dokumente, zum Beispiel als Vertraulich?',
          ['Ja, mit Vertraulichkeitsbezeichnungen, die genutzt werden', 'Bezeichnungen gibt es, sie werden aber selten verwendet', 'Keine Bezeichnungen'],
          'Mit wenigen Vertraulichkeitsbezeichnungen starten', 'Veröffentlichen Sie drei oder vier Microsoft-Purview-Bezeichnungen und wenden Sie sie zuerst auf die sensibelsten Websites an. Was Copilot aus gekennzeichneten Dateien erstellt, übernimmt die Bezeichnung.'],
        ['Gibt es Regeln, was Mitarbeitende in KI-Werkzeuge eingeben dürfen?',
          ['Eine schriftliche KI-Richtlinie, die bekannt ist', 'Nur informelle Hinweise', 'Noch keine Regeln'],
          'Eine einseitige KI-Richtlinie schreiben', 'Legen Sie fest, welche KI-Werkzeuge freigegeben sind, welche Daten nie in andere Werkzeuge gehören und wen man im Zweifel fragt.'],
        ['Können Sie Copilot-Aktivitäten nachvollziehen, wenn Sie etwas untersuchen müssen?',
          ['Audit ist aktiv, Aufbewahrung für Copilot ist festgelegt', 'Audit ist aktiv, Aufbewahrung nicht festgelegt', 'Nicht eingerichtet oder unbekannt'],
          'Audit und Aufbewahrung für Copilot einrichten', 'Prüfen Sie, ob Microsoft Purview Audit aktiv ist, und legen Sie fest, wie lange Copilot-Eingaben und -Antworten aufbewahrt werden.'],
        ['Haben Sie die ersten Aufgaben ausgewählt, bei denen Copilot helfen soll?',
          ['Ja, konkrete Aufgaben je Team, mit ihrem heutigen Zeitaufwand', 'Allgemeine Ideen, noch nichts Konkretes', 'Noch nicht'],
          'Die ersten Aufgaben auswählen', 'Wählen Sie drei bis fünf wiederkehrende Aufgaben, etwa Besprechungsnotizen oder erste Berichtsentwürfe, und notieren Sie, wie lange sie heute dauern.'],
        ['Wer hilft Kolleginnen und Kollegen, Copilot zu lernen?',
          ['Benannte Champions in jedem Team, dazu Schulungen', 'Die IT beantwortet Fragen', 'Noch kein Plan'],
          'In jedem Team einen Champion benennen', 'Wählen Sie pro Team eine Person und halten Sie kurze Schulungen mit echten Beispielen aus der Arbeit dieses Teams.'],
        ['Wie entscheiden Sie, ob Copilot die Lizenzkosten wert ist?',
          ['Vereinbarte Kennzahlen und ein Termin zur Bewertung', 'Wir schauen auf die Nutzungsberichte', 'Noch nicht entschieden'],
          'Festlegen, wie Sie den Nutzen messen', 'Wählen Sie vor dem Pilot zwei oder drei Kennzahlen, etwa eingesparte Stunden, und legen Sie einen Termin fest, an dem Sie über die Lizenzen entscheiden.'],
        ['Wer darf Agenten und Power-Platform-Apps erstellen und teilen?',
          ['Maker arbeiten in verwalteten Umgebungen mit Datenrichtlinien', 'Alle dürfen erstellen, es gibt einige Datenrichtlinien', 'Alle dürfen erstellen, ohne Datenrichtlinien'],
          'Regeln für Agenten und Apps festlegen', 'Richten Sie Data-Loss-Prevention-Richtlinien für die Power Platform und eigene Umgebungen für Maker ein, damit Agenten sensible Daten nicht mit den falschen Zielen verbinden.'],
        ['Wie aktuell sind die Inhalte in SharePoint und Teams?',
          ['Alte und doppelte Inhalte werden regelmäßig archiviert', 'Etwas Aufräumen, aber viele alte Versionen bleiben', 'Niemand räumt auf'],
          'Veraltete Inhalte archivieren', 'Copilot antwortet mit dem, was es findet. Alte Richtlinien und Entwürfe führen zu falschen Antworten. Archivieren Sie verwaiste Websites und entfernen Sie Duplikate.'],
        ['Gibt es einen Plan für eine erste Pilotgruppe?',
          ['Ja: wer, wie lange und was sie zurückmelden', 'Wir wissen wer, aber nicht die Details', 'Noch kein Plan'],
          'Einen Pilot planen', 'Starten Sie mit 10 bis 30 Personen aus einigen Teams für sechs bis acht Wochen und erweitern Sie den Zugang dann anhand der Erfahrungen.']
      ]
    }
  };

  const lang = (document.documentElement.lang || 'en').slice(0, 2);
  const T = TEXT[lang] || TEXT.en;
  const N = T.q.length;
  const KEY = 'om-copilot-check';
  const $ = s => document.querySelector(s);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
    }
    for (const k of kids) if (k != null) n.append(k);
    return n;
  };

  // answers: array of '0' | '1' | '2' | 'n' | null (index into the three options, or not sure)
  let answers = new Array(N).fill(null);
  let current = 0;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ a: answers, c: current })); } catch (e) {} };
  const load = () => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && Array.isArray(d.a) && d.a.length === N) { answers = d.a; current = Math.min(d.c || 0, N - 1); return true; }
    } catch (e) {}
    return false;
  };
  const code = () => answers.map(a => (a == null ? 'n' : a)).join('');
  const fromCode = s => (/^[012n]{15}$/.test(s) ? s.split('') : null);

  const points = a => (a === '0' ? 2 : a === '1' ? 1 : 0);

  function score() {
    const areaPts = [0, 0, 0, 0, 0], areaMax = [0, 0, 0, 0, 0];
    answers.forEach((a, i) => { areaPts[AREA_OF[i]] += points(a); areaMax[AREA_OF[i]] += 2; });
    const areaPct = areaPts.map((p, i) => Math.round((p / areaMax[i]) * 100));
    let w = 0, ws = 0;
    areaPct.forEach((p, i) => { ws += p * AREA_WEIGHT[i]; w += AREA_WEIGHT[i]; });
    const total = Math.round(ws / w);
    const critical = CRITICAL.some(([q, bad]) => bad.includes(answers[q]));
    const band = critical ? 'fix' : total < 40 ? 'low' : total < 70 ? 'mid' : total < 90 ? 'high' : 'top';
    const fixes = answers
      .map((a, i) => {
        const gap = 2 - points(a);
        const crit = CRITICAL.some(([q, bad]) => q === i && bad.includes(a));
        return { i, rank: gap * AREA_WEIGHT[AREA_OF[i]] + (crit ? 10 : 0) - i * 0.001 };
      })
      .filter(f => f.rank > 0)
      .sort((x, y) => y.rank - x.rank)
      .slice(0, 5)
      .map(f => f.i);
    return { total, areaPct, band, fixes };
  }

  /* ---------- screens ---------- */
  const scrIntro = $('#intro'), scrAsk = $('#ask'), scrResult = $('#result');
  function show(s) {
    for (const x of [scrIntro, scrAsk, scrResult]) x.hidden = x !== s;
    window.scrollTo(0, 0);
  }

  function renderIntro() {
    const hasProgress = answers.some(a => a != null);
    const bars = el('ul', { class: 'bars', 'aria-label': T.areas.join(', ') });
    T.areas.forEach(a => bars.append(el('li', {}, el('span', { class: 'name' }, el('span', { text: a })), el('span', { class: 'track' }))));
    const actions = el('div', { class: 'actions' });
    const startBtn = el('button', { class: 'btn btn-solid', type: 'button', text: hasProgress ? T.resume : T.start });
    startBtn.addEventListener('click', () => { if (!hasProgress) current = 0; renderAsk(); });
    actions.append(startBtn);
    if (hasProgress) {
      const again = el('button', { class: 'btn btn-line', type: 'button', text: T.restart });
      again.addEventListener('click', reset);
      actions.append(again);
    }
    scrIntro.replaceChildren(el('div', { class: 'wrap' },
      el('div', {},
        el('h1', { text: T.h1 }),
        el('p', { class: 'lede', text: T.lede }),
        el('p', { class: 'facts', text: T.facts }),
        actions),
      bars));
    show(scrIntro);
  }

  function renderAsk(focus = true) {
    const [q, opts] = T.q[current];
    const area = AREA_OF[current];
    const prog = el('div', { class: 'progress', 'aria-hidden': 'true' });
    for (let a = 0; a < 5; a++) {
      const qs = AREA_OF.map((x, i) => (x === a ? i : -1)).filter(i => i >= 0);
      const done = qs.filter(i => answers[i] != null).length;
      const seg = el('span', {}, el('i'));
      seg.firstChild.style.width = `${(done / qs.length) * 100}%`;
      prog.append(seg);
    }
    const h = el('h2', { id: 'q', tabindex: '-1', text: q });
    const list = el('ul', { class: 'opts', 'aria-labelledby': 'q' });
    opts.forEach((o, k) => {
      const b = el('button', { class: 'opt', type: 'button', 'aria-pressed': String(answers[current] === String(k)) },
        el('span', { class: 'key', 'aria-hidden': 'true', text: String(k + 1) }), el('span', { text: o }));
      b.addEventListener('click', () => choose(String(k)));
      list.append(el('li', {}, b));
    });
    const back = el('button', { class: 'btn btn-text', type: 'button', text: T.back });
    back.addEventListener('click', () => { if (current === 0) renderIntro(); else { current--; save(); renderAsk(); } });
    const unsure = el('button', { class: 'btn btn-line', type: 'button', 'aria-pressed': String(answers[current] === 'n'), text: T.notSure });
    unsure.addEventListener('click', () => choose('n'));
    scrAsk.replaceChildren(el('div', { class: 'wrap' },
      prog,
      el('p', { class: 'where' }, el('b', { text: T.areas[area] }), el('span', { text: T.count(current + 1, N) })),
      h, list,
      el('div', { class: 'nav' }, back, unsure)));
    show(scrAsk);
    if (focus) h.focus({ preventScroll: true });
  }

  let advancing = false;
  function choose(v) {
    if (advancing) return;
    answers[current] = v;
    save();
    scrAsk.querySelectorAll('.opt').forEach((b, k) => b.setAttribute('aria-pressed', String(v === String(k))));
    advancing = true;
    setTimeout(() => {
      advancing = false;
      if (current < N - 1) { current++; save(); renderAsk(); }
      else renderResult();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 60 : 240);
  }

  function resultsLink() {
    return `${location.origin}${location.pathname}#r=${code()}`;
  }

  function renderResult() {
    const r = score();
    const [head, why] = T.bands[r.band];
    try { history.replaceState(null, '', `#r=${code()}`); } catch (e) {}

    const bars = el('ul', { class: 'bars' });
    T.areas.forEach((a, i) => {
      const fill = el('span', { class: 'fill' });
      bars.append(el('li', {},
        el('span', { class: 'name' }, el('span', { text: a }), el('span', { class: 'val', text: String(r.areaPct[i]) })),
        el('span', { class: 'track', role: 'img', 'aria-label': `${a}: ${r.areaPct[i]} / 100` }, fill)));
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = `${r.areaPct[i]}%`; }));
    });

    const fixes = el('ol', { class: 'fixes' });
    if (r.fixes.length) {
      r.fixes.forEach(i => fixes.append(el('li', {}, el('div', {}, el('strong', { text: T.q[i][2] })), el('p', { text: T.q[i][3] }))));
    } else {
      fixes.append(el('li', { class: 'none' }, el('p', { text: T.nothing })));
    }

    const areaLines = T.areas.map((a, i) => `${a}: ${r.areaPct[i]}`).join('\n');
    const fixLines = r.fixes.length ? r.fixes.map((i, n) => `${n + 1}. ${T.q[i][2]}`).join('\n') : T.nothing;
    const body = T.body(r.total, head, areaLines, fixLines, resultsLink());
    const mail = el('a', { class: 'btn btn-solid', href: `mailto:${EMAIL}?subject=${encodeURIComponent(T.subject(r.total))}&body=${encodeURIComponent(body)}`, text: T.email });
    const copy = el('button', { class: 'btn btn-line', type: 'button', text: T.copy });
    if (navigator.clipboard) {
      copy.addEventListener('click', () => navigator.clipboard.writeText(body).then(() => {
        copy.textContent = T.copied;
        setTimeout(() => { copy.textContent = T.copy; }, 2500);
      }));
    } else copy.hidden = true;
    const again = el('button', { class: 'btn btn-text again', type: 'button', text: T.restart });
    again.addEventListener('click', reset);

    const h = el('h2', { tabindex: '-1', text: head });
    scrResult.replaceChildren(el('div', { class: 'wrap' },
      el('div', {},
        el('p', { class: 'score' }, el('b', { text: String(r.total) }), T.outOf),
        h,
        el('p', { class: 'why', text: why }),
        bars),
      el('div', {},
        el('h3', { text: T.fixesTitle }),
        fixes,
        el('div', { class: 'send' }, el('p', { text: T.sendText }), el('div', { class: 'actions' }, mail, copy, again)),
        el('p', { class: 'note', text: T.note }))));
    show(scrResult);
    h.focus({ preventScroll: true });
  }

  function reset() {
    answers = new Array(N).fill(null);
    current = 0;
    save();
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    renderAsk();
  }

  // Keyboard: 1-3 answer, 0 or N for not sure, Backspace goes back.
  document.addEventListener('keydown', e => {
    if (scrAsk.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (['1', '2', '3'].includes(e.key)) { e.preventDefault(); choose(String(Number(e.key) - 1)); }
    else if (e.key === '0' || e.key.toLowerCase() === 'n') { e.preventDefault(); choose('n'); }
    else if (e.key === 'Backspace' && current > 0 && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); current--; save(); renderAsk(); }
  });

  // Start: a results link (#r=...) shows those results; otherwise the intro.
  const m = location.hash.match(/^#r=([012n]{15})$/);
  if (m) { answers = fromCode(m[1]); renderResult(); }
  else { load(); renderIntro(); }
})();
