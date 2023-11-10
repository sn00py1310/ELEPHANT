# Examples how to use ELEPHANT
## Replace simple words

- `Höhere Mathematik` &rarr; `HM`
- Before: `SUMMARY:0186800 - Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog`
- After: `SUMMARY:0186800 - HM II (Analysis) für die Fachrichtung Informatik (V), Herzog`


## Replace the whole event summary
- `SUMMARY:0186800 - Höhere Mathematik II \(Analysis\) für die Fachrichtung Informatik \(V\), Herzog` &rarr; `SUMMARY:HM`
- Before: `SUMMARY:0186800 - Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog`
- After: `SUMMARY:HM`


## Remove the leading numbers
- `SUMMARY:\d+ -`&rarr; `SUMMARY:`
- Before: `SUMMARY:0186800 - Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog`
- After: `SUMMARY:Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog`


## Move the leading numbers to the back
- `SUMMARY:(\d+) - (.*)` &rarr; `SUMMARY:$2 - $1`
- Before: `SUMMARY:0186800 - Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog`
- After: `SUMMARY:Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog - 0186800`


## Capture the whole event to change a specific information (here it is the LOCATION)
```
(BEGIN:VEVENT
UID:0xA480B19D37AF42978AE73CBBAAEB8489@campus\.kit\.edu[\s\S]*?)
LOCATION:30\.46 Chemie, Neuer Hörsaal
([\s\S]*?END:VEVENT)
```
&darr;
```
$1
LOCATION:Ha.S.F
$2
```

Before
```
BEGIN:VEVENT
UID:0xA480B19D37AF42978AE73CBBAAEB8489@campus.kit.edu
SUMMARY:0186800 - Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog
DTSTART;TZID=Europe/Berlin:20230510T094500
DTEND;TZID=Europe/Berlin:20230510T111500
SEQUENCE:0
DTSTAMP:20231105T001422
RRULE:FREQ=WEEKLY;UNTIL=20230726T111500
EXDATE;TZID=Europe/Berlin:20230531T094500
LOCATION:30.46 Chemie, Neuer Hörsaal
DESCRIPTION:https://campus.studium.kit.edu/ev/hnBbu2P7TeWBA7O0Tyg8fA
URL:https://campus.studium.kit.edu/ev/hnBbu2P7TeWBA7O0Tyg8fA
END:VEVENT
```

After
```
BEGIN:VEVENT
UID:0xA480B19D37AF42978AE73CBBAAEB8489@campus.kit.edu
SUMMARY:0186800 - Höhere Mathematik II (Analysis) für die Fachrichtung Informatik (V), Herzog
DTSTART;TZID=Europe/Berlin:20230510T094500
DTEND;TZID=Europe/Berlin:20230510T111500
SEQUENCE:0
DTSTAMP:20231105T001422
RRULE:FREQ=WEEKLY;UNTIL=20230726T111500
EXDATE;TZID=Europe/Berlin:20230531T094500
LOCATION:Ha.S.F
DESCRIPTION:https://campus.studium.kit.edu/ev/hnBbu2P7TeWBA7O0Tyg8fA
URL:https://campus.studium.kit.edu/ev/hnBbu2P7TeWBA7O0Tyg8fA
END:VEVENT
```
