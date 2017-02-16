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
    filter: "Filter"
  },
  
  btn: {
    create: "Erstellen",
    show: "Anzeigen",
    edit: "Bearbeiten",
    delete: "Löschen",
    open: "Öffnen",
    close: "Schließen",
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
      
    },
    
    evt: {
      
    },
    
    poll: {
      allpolls: "Alle Abstimmungen",
      openpolls: "Offene Abst.",
      closedpolls: "Geschlossene Abst.",
      mypolls: "Meine Abstimmungen"
    }
  },
  
  msg: {
    confirm: "Sind Sie sicher?",
    confirmcancel: "Sind Sie sicher, dass Sie den Vorgang abbrechen wollen?",
    
    dest: {
      
    },
    
    evt: {
      confirmdelete: "Sind Sie sicher, dass Sie diesen Event löschen wollen?",
      
      help: "Liste aller Befehle:\n`/event` : Hauptmenü\n`/event <title>;<dd.mm.yy>;<hh:mm>` : Schnell-Erstellung eines Events\n`/event create` : Erstellung eines Events\n`/event list` : Anzeigen aller Events\n`/event show <id>` : Anzeigen des Events mit der ID <id>\n`/event post <id>` : Posten des Events mit der ID <id> im aktuellen Channel\n`/event edit <id>` : Bearbeiten des Events mit der ID <id>\n `/event help` : Anzeigen der Hilfe"
    },
    
    poll: {
      entertitle: "Abstimmungs-Titel eingeben: `/poll <title>`",
      entertext: "Abstimmungs-Text eingeben: `/poll <text>` (optional)",
      enteranswer: "Abstimmungs-Antwort eingeben: `/poll <answer>` (mind. 2, max. 10)\nEs können auch mehrere Antworten auf einmal eingegeben werden: `/poll <answer1>;<answer2>;...`",
      entermax: "Wie viele Antworten sollen auswählbar sein? (Standard: 1)",
      shownames: "Sollen Nutzernamen angezeigt werden? (Standard: Ja)",
      selectedit: "Welche Information soll bearbeitet werden?",
      novotes: "Keine Stimmen",
      pollclosed: "Abstimmung wurde geschlossen.",
      newpollcreated: "Eine neue Abstimmung wurde erstellt:",
      nopollfound: "Keine Abstimmungen gefunden.",
      success: "Erfolgreich abgestimmt.",
      main: "Das ist das Hauptmenü für Abstimmungen.",
      confirmdelete: "Sind Sie sicher, dass Sie diese Abstimmung löschen wollen?",
      
      help: "Liste aller Befehle:\n`/poll` : Hauptmenü\n`/poll <title>;<answer1>;<answer2>;...` : Schnell-Erstellung einer Abstimmung\n`/poll create` : Erstellung einer Abstimmung\n`/poll list` : Anzeigen aller Abstimmungen\n`/poll show <id>` : Anzeigen der Abstimmung mit der ID <id>\n`/poll post <id>` : Posten der Abstimmung mit der ID <id> im aktuellen Channel\n`/poll edit <id>` : Bearbeiten der Abstimmung mit der ID <id>\n `/poll help` : Anzeigen der Hilfe"
    }
  },
  
  err: {
    dest: {
      
    },
    
    evt: {
      
    },
    
    poll: {
      notfound: "Eine Abstimmung mit dieser ID konnte nicht gefunden werden.",
      notowner: "Nur der Ersteller dieser Abstimmung kann diese bearbeiten."
    }
  }
};