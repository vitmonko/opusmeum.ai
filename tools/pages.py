"""Write the Copilot readiness check pages for each language.
Run: python3 tools/pages.py   (content lives in assets/check.js)"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://vitmonko.github.io/opusmeum.ai"
LANGS = {
    "en": ("copilot-readiness/", "Copilot readiness check | Opus Meum",
           "Fifteen questions on sign-in, sharing, data protection, people and agents. See how ready your Microsoft 365 is for Copilot and what to fix first.",
           "Skip to content", "Language", "This check needs JavaScript. You can also email us at"),
    "lt": ("lt/copilot-readiness/", "Copilot pasirengimo patikrinimas | Opus Meum",
           "Penkiolika klausimų apie prisijungimą, bendrinimą, duomenų apsaugą, žmones ir agentus. Sužinokite, ar jūsų Microsoft 365 pasirengęs Copilot ir ką taisyti pirmiausia.",
           "Pereiti prie turinio", "Kalba", "Šiam patikrinimui reikia JavaScript. Taip pat galite mums parašyti"),
    "de": ("de/copilot-readiness/", "Copilot-Readiness-Check | Opus Meum",
           "Fünfzehn Fragen zu Anmeldung, Freigaben, Datenschutz, Menschen und Agenten. Sehen Sie, wie bereit Ihr Microsoft 365 für Copilot ist und was Sie zuerst angehen sollten.",
           "Zum Inhalt springen", "Sprache", "Dieser Check braucht JavaScript. Sie können uns auch schreiben:"),
}
FOOT = {"en": "Microsoft Power Platform and AI consultancy", "lt": "Microsoft Power Platform ir DI konsultacijos", "de": "Beratung für Microsoft Power Platform und KI"}
LOGO = ('<svg viewBox="530 180 870 480" aria-hidden="true" focusable="false"><defs>'
        '<mask id="c" maskUnits="userSpaceOnUse" x="500" y="150" width="1000" height="600"><rect x="500" y="150" width="1000" height="600" fill="#fff"/>'
        '<polygon points="876,360 1500,360 1500,900 1416,900" fill="#000"/></mask>'
        '<clipPath id="t"><rect x="500" y="208" width="1000" height="600"/></clipPath></defs>'
        '<path mask="url(#c)" d="M 949.7 376.9 A 178 178 0 1 1 902.9 294.1"/>'
        '<path clip-path="url(#t)" stroke-miterlimit="10" d="M 897.9 289.1 L 1095 486 L 1323 222 L 1323 633"/></svg>')
for lang, (path, title, desc, skip, langlabel, nojs) in LANGS.items():
    up = "../" * path.count("/")
    rel = lambda p: up + p
    alts = "\n".join(f'<link rel="alternate" hreflang="{c}" href="{SITE}/{LANGS[c][0]}">' for c in LANGS)
    switch = "".join(
        f'<a href="{rel(LANGS[c][0])}" hreflang="{c}" lang="{c}"{" aria-current=\"true\"" if c == lang else ""}>{c.upper()}</a>'
        for c in LANGS)
    html = f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}/{path}">
<meta name="theme-color" content="#ffffff">
<link rel="canonical" href="{SITE}/{path}">
{alts}
<link rel="alternate" hreflang="x-default" href="{SITE}/{LANGS['en'][0]}">
<link rel="icon" href="{rel('favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{rel('assets/check.css')}">
</head>
<body>
<a class="skip" href="#main">{skip}</a>
<header class="top">
  <div class="wrap">
    <a class="brand" href="{rel('')}">{LOGO}<span>Opus Meum</span></a>
    <nav class="lang" aria-label="{langlabel}">{switch}</nav>
  </div>
</header>
<main id="main">
  <section class="screen intro" id="intro" aria-live="off"><div class="wrap"><noscript><p>{nojs} <a href="mailto:vitalijus@opusmeum.net">vitalijus@opusmeum.net</a></p></noscript></div></section>
  <section class="screen ask" id="ask" hidden></section>
  <section class="screen result" id="result" hidden></section>
</main>
<footer class="foot">
  <div class="wrap">
    <span>Opus Meum, {FOOT[lang]}</span>
    <span><a href="https://opusmeum.net/{'' if lang == 'en' else lang + '/'}">opusmeum.net</a> &nbsp; <a href="mailto:vitalijus@opusmeum.net">vitalijus@opusmeum.net</a></span>
  </div>
</footer>
<script src="{rel('assets/check.js')}" defer></script>
</body>
</html>
"""
    os.makedirs(os.path.join(ROOT, path), exist_ok=True)
    open(os.path.join(ROOT, path, "index.html"), "w", encoding="utf-8").write(html)
    print("wrote", path)
