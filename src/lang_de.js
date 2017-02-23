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
      vendors: "Händler"
    },
    
    evt: {
      
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
      weekendupdate: "Destiny | Wochenend-Update",
      moreinfo: "Mehr Informationen:",
      raid: "Raid",
      nochallenge: "Keine Herausforderung",
      recom: "Empfohlen",
      light: "Licht",
      level: "Level",
      activetill: "Aktiv bis:"
    },
    
    evt: {
      confirmdelete: "Sind Sie sicher, dass Sie diesen Event löschen wollen?",
      deleted: "Event wurde erfolgreich gelöscht.",
      
      help: "Liste aller Befehle:\n`/event` : Hauptmenü\n`/event <title>;<dd.mm.yy>;<hh:mm>` : Schnell-Erstellung eines Events\n`/event create` : Erstellung eines Events\n`/event join <id>` : Dem Event mit der ID <id> beitreten\n`/event leave <id>` : Den Event mit der ID <id> verlassen\n`/event list` : Anzeigen aller Events\n`/event show <id>` : Anzeigen des Events mit der ID <id>\n`/event post <id>` : Posten des Events mit der ID <id> im aktuellen Channel\n`/event edit <id>` : Bearbeiten des Events mit der ID <id>\n `/event help` : Anzeigen der Hilfe"
    },
    
    poll: {
      entertitle: "Abstimmungs-Titel eingeben: `/poll <title>`",
      entertext: "Abstimmungs-Text eingeben: `/poll <text>` (optional)",
      enteranswer: "Abstimmungs-Antwort eingeben: `/poll <answer>`",
      enteranswers: "Abstimmungs-Antwort eingeben: `/poll <answer>` (mind. 2, max. 10)\nEs können auch mehrere Antworten auf einmal eingegeben werden: `/poll <answer1>;<answer2>;...`",
      entermax: "Wie viele Antworten sollen auswählbar sein? (Standard: 1)",
      shownames: "Sollen Nutzernamen angezeigt werden? (Standard: Ja)",
      novotes: "Keine Stimmen",
      pollclosed: "Abstimmung wurde geschlossen.",
      newpollcreated: "Eine neue Abstimmung wurde erstellt:",
      nopollfound: "Keine Abstimmungen gefunden.",
      success: "Erfolgreich abgestimmt.",
      main: "Das ist das Hauptmenü für Abstimmungen.",
      editlist: "Liste Ihrer Abstimmungen:",
      selectedit: "Welche Information soll bearbeitet werden?",
      selectansweredit: "Welche Antwort soll bearbeitet werden?\nZum Hinzufügen neuer Abstimmungs-Antworten: `/poll <answer>` (max. 10)\nEs können auch mehrere Antworten auf einmal eingegeben werden: `/poll <answer1>;<answer2>;...`",
      confirmdelete: "Sind Sie sicher, dass Sie diese Abstimmung löschen wollen?",
      confirmdeleteanswer: "Sind Sie sicher, dass Sie diese Antwort löschen wollen?",
      deleted: "Abstimmung wurde erfolgreich gelöscht.",
      
      help: "Liste aller Befehle:\n`/poll` : Hauptmenü\n`/poll <title>;<answer1>;<answer2>;...` : Schnell-Erstellung einer Abstimmung\n`/poll create` : Erstellung einer Abstimmung\n`/poll list` : Anzeigen aller Abstimmungen\n`/poll show <id>` : Anzeigen der Abstimmung mit der ID <id>\n`/poll post <id>` : Posten der Abstimmung mit der ID <id> im aktuellen Channel\n`/poll edit <id>` : Bearbeiten der Abstimmung mit der ID <id>\n `/poll help` : Anzeigen der Hilfe"
    }
  },
  
  err: {
    dest: {
      
    },
    
    evt: {
      notfound: "Ein Event mit dieser ID konnte nicht gefunden werden.",
      notowner: "Nur der Ersteller dieses Events kann diesen bearbeiten."
    },
    
    poll: {
      notfound: "Eine Abstimmung mit dieser ID konnte nicht gefunden werden.",
      notowner: "Nur der Ersteller dieser Abstimmung kann diese bearbeiten."
    }
  }
};