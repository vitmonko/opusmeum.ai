"""Write the self-check pages and the checks list page for each language.
Run: python3 tools/pages.py
Question content lives in assets/checks/<id>.js; the engine is assets/check.js."""
import os
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://vitmonko.github.io/opusmeum.ai"
LANGS = ["en", "lt", "de"]
EMAIL = "vitalijus@opusmeum.net"

UI = {
    "en": {"skip": "Skip to content", "lang": "Language", "nojs": "This check needs JavaScript. You can also email us at",
           "foot": "Microsoft Power Platform and AI consultancy", "minutes": "15 questions, about 5 minutes"},
    "lt": {"skip": "Pereiti prie turinio", "lang": "Kalba", "nojs": "Šiam patikrinimui reikia JavaScript. Taip pat galite mums parašyti",
           "foot": "Microsoft Power Platform ir DI konsultacijos", "minutes": "15 klausimų, apie 5 minutės"},
    "de": {"skip": "Zum Inhalt springen", "lang": "Sprache", "nojs": "Dieser Check braucht JavaScript. Sie können uns auch schreiben:",
           "foot": "Beratung für Microsoft Power Platform und KI", "minutes": "15 Fragen, etwa 5 Minuten"},
}

# id, folder, and per language: (page title, meta description, short line for the checks list)
CHECKS = [
    ("copilot", "copilot-readiness/", {
        "en": ("Copilot readiness check", "Fifteen questions on sign-in, sharing, data protection, people and agents. See how ready your Microsoft 365 is for Copilot and what to fix first.",
               "Sign-in, sharing, data protection, people and agents before you roll out Microsoft 365 Copilot."),
        "lt": ("Copilot pasirengimo patikrinimas", "Penkiolika klausimų apie prisijungimą, bendrinimą, duomenų apsaugą, žmones ir agentus. Sužinokite, ar jūsų Microsoft 365 pasirengęs Copilot ir ką taisyti pirmiausia.",
               "Prisijungimas, bendrinimas, duomenų apsauga, žmonės ir agentai prieš diegiant Microsoft 365 Copilot."),
        "de": ("Copilot-Readiness-Check", "Fünfzehn Fragen zu Anmeldung, Freigaben, Datenschutz, Menschen und Agenten. Sehen Sie, wie bereit Ihr Microsoft 365 für Copilot ist und was Sie zuerst angehen sollten.",
               "Anmeldung, Freigaben, Datenschutz, Menschen und Agenten vor der Einführung von Microsoft 365 Copilot."),
    }),
    ("sharepoint", "sharepoint-governance/", {
        "en": ("SharePoint governance check", "Fifteen questions for IT leads on SharePoint sharing, permissions, site lifecycle, data protection and monitoring, with the five changes to make first.",
               "Sharing and guests, permissions, site lifecycle, data protection, audit and admin rights."),
        "lt": ("SharePoint valdymo patikrinimas", "Penkiolika klausimų IT vadovams apie SharePoint bendrinimą, teises, svetainių ciklą, duomenų apsaugą ir stebėseną, su penkiais pirmaisiais pakeitimais.",
               "Bendrinimas ir svečiai, teisės, svetainių ciklas, duomenų apsauga, auditas ir administratorių teisės."),
        "de": ("SharePoint-Governance-Check", "Fünfzehn Fragen für IT-Verantwortliche zu Freigaben, Berechtigungen, Website-Lebenszyklus, Datenschutz und Überwachung in SharePoint, mit den fünf ersten Änderungen.",
               "Freigaben und Gäste, Berechtigungen, Website-Lebenszyklus, Datenschutz, Überwachung und Adminrechte."),
    }),
    ("power-platform", "power-platform-governance/", {
        "en": ("Power Platform governance check", "Fifteen questions for IT leads on Power Apps and Power Automate environments, data policies, ownership, monitoring and makers, with the five changes to make first.",
               "Power Apps and Power Automate: environments, data policies, ownership, monitoring and makers."),
        "lt": ("Power Platform valdymo patikrinimas", "Penkiolika klausimų IT vadovams apie Power Apps ir Power Automate aplinkas, duomenų politikas, savininkus, stebėseną ir kūrėjus, su penkiais pirmaisiais pakeitimais.",
               "Power Apps ir Power Automate: aplinkos, duomenų politikos, savininkai, stebėsena ir kūrėjai."),
        "de": ("Power-Platform-Governance-Check", "Fünfzehn Fragen für IT-Verantwortliche zu Umgebungen, Datenrichtlinien, Besitz, Überwachung und Makern in Power Apps und Power Automate, mit den fünf ersten Änderungen.",
               "Power Apps und Power Automate: Umgebungen, Datenrichtlinien, Besitz, Überwachung und Maker."),
    }),
]

HUB = ("checks/", {
    "en": ("Self-checks for Microsoft 365 and Power Platform", "Microsoft 365 and Power Platform self-checks | Opus Meum",
           "Three self-checks for IT leads: Copilot readiness, SharePoint governance and Power Platform governance. Each scores five areas and lists what to fix first.",
           "Each check scores five areas and lists the five changes we would make first. Your answers stay in your browser."),
    "lt": ("Microsoft 365 ir Power Platform savęs patikrinimai", "Microsoft 365 ir Power Platform savęs patikrinimai | Opus Meum",
           "Trys savęs patikrinimai IT vadovams: pasirengimas Copilot, SharePoint valdymas ir Power Platform valdymas. Kiekvienas įvertina penkias sritis ir parodo, ką taisyti pirmiausia.",
           "Kiekvienas patikrinimas įvertina penkias sritis ir nurodo penkis pakeitimus, kuriuos darytume pirmiausia. Jūsų atsakymai lieka jūsų naršyklėje."),
    "de": ("Selbst-Checks für Microsoft 365 und Power Platform", "Selbst-Checks für Microsoft 365 und Power Platform | Opus Meum",
           "Drei Selbst-Checks für IT-Verantwortliche: Copilot-Readiness, SharePoint-Governance und Power-Platform-Governance. Jeder bewertet fünf Bereiche und zeigt, was zuerst zu tun ist.",
           "Jeder Check bewertet fünf Bereiche und nennt die fünf Änderungen, die wir zuerst vornehmen würden. Ihre Antworten bleiben in Ihrem Browser."),
})

LOGO = ('<svg viewBox="530 180 870 480" aria-hidden="true" focusable="false"><defs>'
        '<mask id="c" maskUnits="userSpaceOnUse" x="500" y="150" width="1000" height="600"><rect x="500" y="150" width="1000" height="600" fill="#fff"/>'
        '<polygon points="876,360 1500,360 1500,900 1416,900" fill="#000"/></mask>'
        '<clipPath id="t"><rect x="500" y="208" width="1000" height="600"/></clipPath></defs>'
        '<path mask="url(#c)" d="M 949.7 376.9 A 178 178 0 1 1 902.9 294.1"/>'
        '<path clip-path="url(#t)" stroke-miterlimit="10" d="M 897.9 289.1 L 1095 486 L 1323 222 L 1323 633"/></svg>')


def prefix(lang):
    return "" if lang == "en" else lang + "/"


def page(lang, folder, title, desc, body, extra_head="", script=""):
    path = prefix(lang) + folder
    up = "../" * path.count("/")
    u = UI[lang]
    alts = "\n".join(f'<link rel="alternate" hreflang="{c}" href="{SITE}/{prefix(c)}{folder}">' for c in LANGS)
    switch = "".join(
        f'<a href="{up}{prefix(c)}{folder}" hreflang="{c}" lang="{c}"{" aria-current=\"true\"" if c == lang else ""}>{c.upper()}</a>'
        for c in LANGS)
    html = f"""<!doctype html>
<html lang="{lang}" data-root="{up}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title>
<meta name="description" content="{escape(desc)}">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}/{path}">
<meta name="theme-color" content="#ffffff">
<link rel="canonical" href="{SITE}/{path}">
{alts}
<link rel="alternate" hreflang="x-default" href="{SITE}/{folder}">
<link rel="icon" href="{up}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{up}assets/check.css">{extra_head}
</head>
<body>
<a class="skip" href="#main">{u['skip']}</a>
<header class="top">
  <div class="wrap">
    <a class="brand" href="{up}">{LOGO}<span>Opus Meum</span></a>
    <nav class="lang" aria-label="{u['lang']}">{switch}</nav>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="wrap">
    <span>Opus Meum, {u['foot']}</span>
    <span><a href="https://opusmeum.net/{prefix(lang)}">opusmeum.net</a> &nbsp; <a href="mailto:{EMAIL}">{EMAIL}</a></span>
  </div>
</footer>
{script.replace('{up}', up)}</body>
</html>
"""
    os.makedirs(os.path.join(ROOT, path), exist_ok=True)
    with open(os.path.join(ROOT, path, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", path)


for lang in LANGS:
    u = UI[lang]
    for cid, folder, t in CHECKS:
        title, desc, _ = t[lang]
        body = (f'  <section class="screen intro" id="intro"><div class="wrap"><noscript><p>{u["nojs"]} '
                f'<a href="mailto:{EMAIL}">{EMAIL}</a></p></noscript></div></section>\n'
                '  <section class="screen ask" id="ask" hidden></section>\n'
                '  <section class="screen result" id="result" hidden></section>')
        script = (f'<script src="{{up}}assets/checks/{cid}.js" defer></script>\n'
                  '<script src="{up}assets/check.js" defer></script>\n')
        page(lang, folder, f"{title} | Opus Meum", desc, body, script=script)

    h1, title, desc, lede = HUB[1][lang]
    items = "\n".join(
        f'      <li><a href="../{folder}" class="pick"><span class="pick-name">{escape(t[lang][0])}</span>'
        f'<span class="pick-desc">{escape(t[lang][2])}</span><span class="pick-meta">{u["minutes"]}</span></a></li>'
        for cid, folder, t in CHECKS)
    body = f"""  <section class="screen hub">
    <div class="wrap">
      <div>
        <h1>{escape(h1)}</h1>
        <p class="lede">{escape(lede)}</p>
      </div>
      <ul class="picks">
{items}
      </ul>
    </div>
  </section>"""
    page(lang, HUB[0], title, desc, body)
