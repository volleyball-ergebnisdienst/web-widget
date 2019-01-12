# Volleyball Ergebnisdienst Widget

Zeigt eure Tabellen direkt in eurer Homepage an. Einfache Integration für jedes Content-Management-System, das HTML und Javascript Code erlaubt, wie Joomla, Wordpress, Typo3, u.v.m.

## Javascript Widget einbinden

Platziere den Code dort, wo die Tabelle auf deiner Seite erscheinen soll.
Beim Integrieren von Tabelle und Spielplan, `vly.min.js` nur einmal auf der Seite einbinden!

```html
<div class="vly" data-league-id="bbvv_m_0_1"></div>
  
<script src="//volleyball-ergebnisdienst.de/widget/vly.min.js"></script>
```

### Konfiguration

| Attribute           | Beschreibung                              |  
|---------------------|-------------------------------------------|  
| `data-league-id="bbvv_m_0_1"` | ID der Liga  |  
| `data-special` | Heim-, Auswärts- und Streakdaten |  
| `data-team='scm'` | Teammarkierung und Auswahl bei `data-games` Spielplananzeige |  
| `data-games` | Anzeige des Spielplans anstelle der Tabelle |  
