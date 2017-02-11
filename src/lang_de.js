// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

// ==============================
// ========== LANGUAGE ==========
// ==============================

let lang = module.exports = {
  
  wrd: {
    poll: "Umfrage",
    user: "User",
    preview: "Vorschau",
    vote: "Stimme",
    votes: "Stimmen",
    allowed: "erlaubt",
    page: "Seite"
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
      createpoll: "Umfrage erstellen",
      showpolls: "Umfragen anzeigen",
      editpoll: "Umfrage bearbeiten"
    }
  },
  
  msg: {
    confirm: "Sind Sie sicher?",
    confirmcancel: "Sind Sie sicher, dass Sie den Vorgang abbrechen wollen?",
    
    poll: {
      entertitle: "Umfragen-Titel eingeben: `/poll <title>`",
      entertext: "Umfragen-Text eingeben: `/poll <text>` (optional)",
      enteranswer: "Umfragen-Antwort eingeben: `/poll <answer>` (mind. 2, max. 10)\nEs können auch mehrere Antworten auf einmal eingegeben werden: `/poll <answer1>;<answer2>;...`",
      entermax: "Wie viele Antworten sollen auswählbar sein? (Standard: 1)",
      shownames: "Sollen Nutzernamen angezeigt werden? (Standard: Ja)",
      selectedit: "Welche Information soll bearbeitet werden?",
      novotes: "Keine Stimmen",
      pollclosed: "Umfrage wurde geschlossen.",
      newpollcreated: "Eine neue Umfrage wurde erstellt:",
      openpolls: "offene Umfragen."
    }
  },
  
  err: {
    poll: {
      notfound: "Eine Umfrage mit dieser ID konnte nicht gefunden werden."
      
    }
  }
};