// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

// ==============================
// ========== LANGUAGE ==========
// ==============================

let lang = module.exports = {
  
  wrd: {
    poll: "Abstimmung",
    polls: "Abstimmungen",
    user: "User",
    preview: "Vorschau",
    vote: "Stimme",
    votes: "Stimmen",
    allowed: "erlaubt",
    page: "Seite",
    total: "Gesamt",
    filter: "Filter"
  },
  
  btn: {
    back: "< Zurück",
    next: "Weiter >",
    edit: "Bearbeiten",
    open: "Öffnen",
    close: "Schließen",
    delete: "Löschen",
    done: "Fertig",
    cancel: "Abbrechen",
    dismiss: "Ausblenden",
    showhelp: "Hilfe anzeigen",
    yes: "Ja",
    no: "Nein",
    all: "Alle",
    
    poll: {
      create: "Erstellen",
      show: "Anzeigen",
      edit: "Bearbeiten",
      allpolls: "Alle Abstimmungen",
      openpolls: "Offene Abst.",
      closedpolls: "Geschlossene Abst.",
      mypolls: "Meine Abstimmungen",
      asc: "Aufsteigend",
      desc: "Absteigend"
    }
  },
  
  msg: {
    confirm: "Sind Sie sicher?",
    confirmcancel: "Sind Sie sicher, dass Sie den Vorgang abbrechen wollen?",
    
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
      main: "Das ist das Hauptmenü für Abstimmungen."
    }
  },
  
  err: {
    poll: {
      notfound: "Eine Abstimmung mit dieser ID konnte nicht gefunden werden."
      
    }
  }
};