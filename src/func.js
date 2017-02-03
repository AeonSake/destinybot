// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

// ===============================
// ========== FUNCTIONS ==========
// ===============================

let func = module.exports = {
  
  // Method to get a random RGB color in hex
  getRandomColor: () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
};


