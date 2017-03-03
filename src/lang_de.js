// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

// ==============================
// ========== LANGUAGE ==========
// ==============================

let lang = module.exports = {
  
  wrd: {
    user: "User",
    preview: "Vorschau",
    event: "Event",
    events: "Events",
    poll: "Abstimmung",
    polls: "Abstimmungen",
    vote: "Stimme",
    votes: "Stimmen",
    allowed: "erlaubt",
    page: "Seite",
    total: "Gesamt",
    filter: "Filter",
    deleted: "Gelöscht",
    member: "Teilnehmer",
    
    
  },
  
  btn: {
    create: "Erstellen",
    show: "Anzeigen",
    edit: "Bearbeiten",
    delete: "Löschen",
    undelete: "Wiederherstellen",
    done: "Fertig",
    cancel: "Abbrechen",
    dismiss: "Ausblenden",
    showhelp: "Hilfe anzeigen",
    back: "< Zurück",
    next: "Weiter >",
    yes: "Ja",
    no: "Nein",
    asc: "Aufsteigend",
    desc: "Absteigend",
    all: "Alle",
    
    dest: {
      summary: "Übersicht",
      pve: "PvE",
      raids: "Raids",
      pvp: "PvP",
      special: "Spezielle Events",
      vendors: "Händler",
      details: "Details"
    },
    
    evt: {
      join: "Teilnehmen",
      leave: "Verlassen",
      ok: "Ok",
      cancel: "Absagen",
      allevents: "Alle Events",
      comingevents: "Kommende Events",
      outdatedevents: "Abgelaufene Events",
      myevents: "Meine Events",
      title: "Titel",
      text: "Text",
      members: "Teilnehmer",
      max: "Max. Teilnehmer",
      deletetext: "Text entfernen",
      nomax: "Kein Max."
    },
    
    poll: {
      allpolls: "Alle Abstimmungen",
      openpolls: "Offene Abst.",
      closedpolls: "Geschlossene Abst.",
      mypolls: "Meine Abstimmungen",
      title: "Titel",
      text: "Text",
      answers: "Antworten",
      max: "Max. Stimmen",
      names: "Stimmenliste",
      deletetext: "Text entfernen",
      open: "Abst. öffnen",
      close: "Abst. schließen"
    }
  },
  
  msg: {
    confirm: "Sind Sie sicher?",
    confirmcancel: "Sind Sie sicher, dass Sie den Vorgang abbrechen wollen?",
    
    dest: {
      main: "Destiny | Aktivitäten Übersicht",
      weeklyreset: "Destiny | Wöchtentlicher Reset",
      dailyupdate: "Destiny | Tägliches Update",
      armsdayupdate: "Destiny | Waffentag Update",
      ironbannerupdate: "Destiny | Eisenbanner Update",
      xurupdate: "Destiny | Xûr Update",
      trialsupdate: "Destiny | Prüfungen von Osiris Update",
      
      activetill: "Aktiv bis:",
      dateformat: "dd, D.M.YYYY, HH:mm",
      raid: "Raid",
      nochallenge: "Keine Herausforderung",
      recom: "Empfohlen:",
      light: "Licht",
      level: "Level",
      warlock: "Warlock",
      titan: "Titan",
      hunter: "Jäger",
      link: "Link",
      stats: "Stats:",
      perks: "Perks:",
      noactivities: "Keine Aktivitäten verfügbar.",
      nodetails: "Keine Details verfügbar,",
      notactive: "Aktivität ist derzeit nicht aktiv.",
      moreinfo: "Mehr Informationen:",
      
      help: ""
    },
    
    evt: {
      main: "Das ist das Hauptmenü für Events.",
      
      entertitle: "Event-Titel eingeben: `/event <title>`",
      entertext: "Event-Text eingeben: `/event <text>` (optional)",
      enterdatetime: "Event-Datum/Zeit eingeben: `/event <DD.MM.YYYY>;<hh:mm>`",
      wrongdatetimeinput: "*Falsches Format!*",
      wrongdatetimestamp: "*Datum/Zeit muss mindestens 30 Minuten in der Zukunft liegen!*",
      entermax: "Wie viele Teilnehmer sollen maximal möglich sein? (Standard: 6)",
      
      neweventcreated: "Ein neuer Event wurde erstellt:",
      dateformat: "[Am] dd, [*]D.M.YYYY[*], [um] [*]HH:mm[*]",
      
      confirmdelete: "Sind Sie sicher, dass Sie diesen Event löschen wollen?",
      deleted: "Event wurde erfolgreich gelöscht.",
      
      notfound: "Eine Abstimmung mit dieser ID konnte nicht gefunden werden.",
      notowner: "Nur der Ersteller dieser Abstimmung kann diese bearbeiten.",
      
      startingsoon: "Ein Event an dem Sie teilnehmen beginnt in Kürze!",
      confirmcancel: "Sind Sie sicher, dass Sie diesen Event absagen wollen?",
      hascanceled: "hat für den folgenden Event abgesagt:",
      
      help: "Liste aller Befehle:\n`/event` : Hauptmenü\n`/event <title>;<dd.mm.yy>;<hh:mm>` : Schnell-Erstellung eines Events\n`/event create` : Erstellung eines Events\n`/event list` : Anzeigen aller Events\n`/event show <id>` : Anzeigen des Events mit der ID <id>\n`/event edit <id>` : Bearbeiten des Events mit der ID <id>\n`/event post <id>` : Posten des Events mit der ID <id> im aktuellen Channel\n`/event help` : Anzeigen der Hilfe"
    },
    
    poll: {
      main: "Das ist das Hauptmenü für Abstimmungen.",
      
      entertitle: "Abstimmungs-Titel eingeben: `/poll <title>`",
      entertext: "Abstimmungs-Text eingeben: `/poll <text>` (optional)",
      enteranswer: "Abstimmungs-Antwort eingeben: `/poll <answer>`",
      enteranswers: "Abstimmungs-Antwort eingeben: `/poll <answer>` (mind. 2, max. 10)\nEs können auch mehrere Antworten auf einmal eingegeben werden: `/poll <answer1>;<answer2>;...`",
      entermax: "Wie viele Antworten sollen auswählbar sein? (Standard: 1)",
      shownames: "Sollen Nutzernamen angezeigt werden? (Standard: Ja)",
      
      newpollcreated: "Eine neue Abstimmung wurde erstellt:",
      novotes: "Keine Stimmen",
      pollclosed: "Abstimmung wurde geschlossen.",
      
      editlist: "Liste Ihrer Abstimmungen:",
      selectedit: "Welche Information soll bearbeitet werden?",
      selectansweredit: "Welche Antwort soll bearbeitet werden?\nZum Hinzufügen neuer Abstimmungs-Antworten: `/poll <answer>` (max. 10)\nEs können auch mehrere Antworten auf einmal eingegeben werden: `/poll <answer1>;<answer2>;...`",
      confirmdeleteanswer: "Sind Sie sicher, dass Sie diese Antwort löschen wollen?",
      
      confirmdelete: "Sind Sie sicher, dass Sie diese Abstimmung löschen wollen?",
      deleted: "Abstimmung wurde erfolgreich gelöscht.",
      
      success: "Erfolgreich abgestimmt.",
      nopollfound: "Keine Abstimmungen gefunden.",
      notfound: "Eine Abstimmung mit dieser ID konnte nicht gefunden werden.",
      notowner: "Nur der Ersteller dieser Abstimmung kann diese bearbeiten.",
      
      help: "Liste aller Befehle:\n`/poll` : Hauptmenü\n`/poll <title>;<answer1>;<answer2>;...` : Schnell-Erstellung einer Abstimmung\n`/poll create` : Erstellung einer Abstimmung\n`/poll list` : Anzeigen aller Abstimmungen\n`/poll show <id>` : Anzeigen der Abstimmung mit der ID <id>\n`/poll edit <id>` : Bearbeiten der Abstimmung mit der ID <id>\n`/poll post <id>` : Posten der Abstimmung mit der ID <id> im aktuellen Channel\n`/poll help` : Anzeigen der Hilfe"
    }
  }
};