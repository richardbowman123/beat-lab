/* ============================================================
   BEAT LAB — learn to produce
   Step-by-step music production tutorial game
   ============================================================ */

const Z16 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const N8  = [null,null,null,null,null,null,null,null];
const N16 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
const LAYER_COLOURS = { bass: '#e8a849', drums: '#4a9eff', synth: '#c44aff', lead: '#4affb8' };
const SECTIONS = ['intro','verse','chorus','drop','outro'];
const DRUM_VOICES = ['clap','hat','snare','kick']; // top to bottom (kick at bottom)
const DRUM_LABELS = ['CLAP','HI-HAT','SNARE','KICK'];

// ===== MIDI NOTE HELPER =====
function noteToMidi(n) {
  const m = n.match(/^([A-G])(b|#)?(\d+)$/);
  if (!m) return 0;
  const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]];
  const mod = m[2]==='#'?1:m[2]==='b'?-1:0;
  return (parseInt(m[3])+1)*12+base+mod;
}
function shortNote(n) {
  const m = n.match(/^([A-G]b?#?)(\d+)$/);
  return m ? m[1]+m[2] : n;
}

// Collect unique notes across all sections for a melodic layer
function getLayerNotes(layerData) {
  const notes = new Set();
  for (const sec of SECTIONS) {
    const pat = layerData.sections[sec];
    for (const step of pat) {
      if (!step) continue;
      if (Array.isArray(step)) step.forEach(n => { if(n) notes.add(n); });
      else notes.add(step);
    }
  }
  return [...notes].sort((a,b) => noteToMidi(b)-noteToMidi(a)); // high to low
}


// ===== 8 TRACK DEFINITIONS =====
const TRACKS = [
  // ---- 1. DEEP HOUSE (122) Cm ----
  {
    name: 'DEEP HOUSE', bpm: 122,
    bass: {
      osc:'triangle', filterFreq:500, attack:0.01, decay:0.3, sustain:0.35, release:0.2, noteDur:'8n',
      sections: {
        intro:  ['C2',null,null,null,'C2',null,null,null],
        verse:  ['C2',null,null,'G1','C2',null,'Eb2',null],
        chorus: ['C2',null,'G1',null,'Ab1',null,'Bb1',null],
        drop:   ['C2','C2',null,'G1','Ab1',null,'Bb1','C2'],
        outro:  ['C2',null,null,null,null,null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16},
      verse:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16},
      chorus: {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      drop:   {kick:[1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0], hat:[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      outro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16}
    }},
    synth: {
      osc:'triangle', filterFreq:1400, attack:0.4, decay:0.6, sustain:0.6, release:1.2, noteDur:'2n',
      sections: {
        intro:  N8,
        verse:  [['C4','Eb4','G4'],null,null,null,['Ab3','C4','Eb4'],null,null,null],
        chorus: [['C4','Eb4','G4'],null,['Ab3','C4','Eb4'],null,['Bb3','D4','F4'],null,['Ab3','C4','Eb4'],null],
        drop:   [['C4','Eb4','G4','Bb4'],null,['Ab3','C4','Eb4'],null,['Bb3','D4','F4'],null,['G3','Bb3','D4'],null],
        outro:  [['C4','Eb4','G4'],null,null,null,null,null,null,null]
      }
    },
    lead: {
      osc:'sine', filterFreq:2500, attack:0.08, decay:0.35, sustain:0.3, release:0.5, noteDur:'8n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['G4',null,null,null,'Eb4',null,'F4',null,'G4',null,null,null,null,null,null,null],
        drop:   ['G4',null,'Eb4',null,'F4','G4',null,'Bb4','C5',null,null,'Bb4','G4',null,'F4',null],
        outro:  N16
      }
    }
  },

  // ---- 2. TECHNO (130) Am ----
  {
    name: 'TECHNO', bpm: 130,
    bass: {
      osc:'sawtooth', filterFreq:280, attack:0.005, decay:0.12, sustain:0.15, release:0.08, noteDur:'16n',
      sections: {
        intro:  ['A1',null,'A1',null,'A1',null,'A1',null],
        verse:  ['A1',null,'A1',null,'A1','G1',null,'A1'],
        chorus: ['A1','A1',null,'A1','G1',null,'A1','C2'],
        drop:   ['A1','A1','A1','G1','A1','A1','C2','A1'],
        outro:  ['A1',null,null,null,'A1',null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:Z16},
      verse:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      chorus: {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], hat:[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      drop:   {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1], clap:[0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0]},
      outro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:Z16}
    }},
    synth: {
      osc:'square', filterFreq:800, attack:0.005, decay:0.08, sustain:0, release:0.05, noteDur:'16n',
      sections: {
        intro:  N8,
        verse:  N8,
        chorus: [['A3','E4'],null,null,null,['G3','D4'],null,null,null],
        drop:   [['A3','E4'],null,['G3','D4'],null,['A3','E4'],null,['C4','G4'],null],
        outro:  N8
      }
    },
    lead: {
      osc:'sawtooth', filterFreq:1800, attack:0.005, decay:0.1, sustain:0, release:0.08, noteDur:'16n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['A4',null,null,null,'E4',null,'G4',null,null,null,null,null,null,null,null,null],
        drop:   ['A4',null,'E4','G4','A4',null,'C5',null,'A4',null,'G4',null,'E4',null,'G4','A4'],
        outro:  N16
      }
    }
  },

  // ---- 3. DRUM & BASS (174) Em — Reese bass, breakbeats, atmospheric ----
  {
    name: 'DRUM & BASS', bpm: 174,
    bass: {
      osc:'fatsawtooth', oscCount:3, oscSpread:30,
      filterFreq:300, filterQ:2, rolloff:-24,
      distortion:0.15,
      attack:0.005, decay:0.4, sustain:0.6, release:0.3, noteDur:'4n',
      sub: { attack:0.005, decay:0.5, sustain:0.7, release:0.3, volume:-8 },
      sections: {
        // Intro: single root note, space to breathe
        intro:  ['E1',null,null,null,null,null,null,null],
        // Verse: bass starts walking — root, fifth, octave drop, chromatic tension
        verse:  ['E1',null,null,'D1','G1',null,null,'A1'],
        // Chorus: syncopated Reese — pushes against the beat
        chorus: ['E1',null,'B0',null,null,'G1','A1',null],
        // Drop: relentless driving bass riff with chromatic run
        drop:   ['E1',null,'E1','G1',null,'A1','Bb1','B1'],
        // Outro: fading, just the root breathing
        outro:  ['E1',null,null,null,null,null,'E1',null]
      }
    },
    drums: { sections: {
      // Intro: classic two-step with space — kick on 1 and the "and" of 2
      intro:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16},
      // Verse: breakbeat enters — syncopated snare, ghost hat accents
      verse:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:Z16},
      // Chorus: kick gets busier, ghost hats, clap reinforces snare
      chorus: {kick:[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0], hat:[1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0]},
      // Drop: amen-inspired chaos — double kicks, rapid snares, full hats
      drop:   {kick:[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0], snare:[0,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0], hat:[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      // Outro: stripped back, just the two-step fading
      outro:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0], clap:Z16}
    }},
    synth: {
      osc:'triangle',
      filterFreq:2200, rolloff:-12,
      attack:0.4, decay:0.8, sustain:0.7, release:2.5, noteDur:'2n',
      chorus: { freq:0.8, delay:4.0, depth:0.3, wet:0.35 },
      sections: {
        intro:  N8,
        // Verse: Em pad, single sustained chord — atmosphere building
        verse:  [['E3','G3','B3'],null,null,null,null,null,null,null],
        // Chorus: Em → Am movement, chords breathe on the off-beat
        chorus: [['E3','G3','B3'],null,null,null,['A3','C4','E4'],null,null,null],
        // Drop: full chord progression — Em, Am, G, Am — driving harmonic movement
        drop:   [['E3','G3','B3'],null,['A3','C4','E4'],null,['G3','B3','D4'],null,['A3','C4','E4'],null],
        // Outro: single chord dissolving
        outro:  [['E3','G3','B3'],null,null,null,null,null,null,null]
      }
    },
    lead: {
      osc:'fatsawtooth', oscCount:2, oscSpread:15,
      filterFreq:4000, rolloff:-12,
      attack:0.005, decay:0.1, sustain:0.05, release:0.08, noteDur:'16n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        // Chorus: hooky melody — call and response, ends with a rest that pulls you forward
        chorus: ['B4',null,null,'A4','G4',null,'E4',null,null,null,'G4','A4','B4',null,null,null],
        // Drop: frantic energy — rapid stabs with octave jumps and chromatic tension
        drop:   ['B4',null,'E5',null,'D5','B4',null,'A4','G4',null,'A4','B4','E5','D5',null,'B4'],
        outro:  N16
      }
    }
  },

  // ---- 4. TRANCE (138) Am ----
  {
    name: 'TRANCE', bpm: 138,
    bass: {
      osc:'sawtooth', filterFreq:320, attack:0.005, decay:0.1, sustain:0.12, release:0.08, noteDur:'16n',
      sections: {
        intro:  ['A1',null,'A1',null,'A1',null,'A1',null],
        verse:  ['A1',null,'A1',null,'F1',null,'G1',null],
        chorus: ['A1',null,'A1',null,'F1',null,'G1',null],
        drop:   ['A1','A1',null,'A1','F1','F1',null,'G1'],
        outro:  ['A1',null,null,null,'A1',null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16},
      verse:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      chorus: {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      drop:   {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      outro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16}
    }},
    synth: {
      osc:'sawtooth', filterFreq:2200, attack:0.2, decay:0.35, sustain:0.7, release:1.0, noteDur:'2n',
      sections: {
        intro:  N8,
        verse:  [['A3','C4','E4'],null,null,null,['F3','A3','C4'],null,null,null],
        chorus: [['A3','C4','E4'],null,['F3','A3','C4'],null,['G3','B3','D4'],null,['F3','A3','C4'],null],
        drop:   [['A3','C4','E4','G4'],null,['F3','A3','C4'],null,['G3','B3','D4','F4'],null,['E3','G3','B3'],null],
        outro:  [['A3','C4','E4'],null,null,null,null,null,null,null]
      }
    },
    lead: {
      osc:'sawtooth', filterFreq:4000, attack:0.03, decay:0.25, sustain:0.4, release:0.4, noteDur:'8n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['E5',null,null,null,'D5',null,'C5',null,'B4',null,null,null,'A4',null,null,null],
        drop:   ['E5',null,'C5','D5','E5',null,'G5',null,'E5',null,'D5','C5','B4',null,'A4','B4'],
        outro:  ['E5',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
      }
    }
  },

  // ---- 5. UK GARAGE (132) Fm ----
  {
    name: 'UK GARAGE', bpm: 132,
    bass: {
      osc:'sine', filterFreq:350, attack:0.01, decay:0.18, sustain:0.25, release:0.12, noteDur:'8n',
      sections: {
        intro:  ['F2',null,null,null,null,null,null,null],
        verse:  ['F2',null,null,'Ab2',null,null,'C3',null],
        chorus: ['F2',null,'Ab2',null,'Bb2',null,'C3','Ab2'],
        drop:   ['F2','F2',null,'Ab2','Bb2',null,'C3','Ab2'],
        outro:  ['F2',null,null,null,null,null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:Z16, hat:[0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1], clap:Z16},
      verse:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0], hat:[0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1], clap:Z16},
      chorus: {kick:[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0], hat:[1,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1], clap:[0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0]},
      drop:   {kick:[1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0], hat:[1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      outro:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:Z16, hat:[0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1], clap:Z16}
    }},
    synth: {
      osc:'square', filterFreq:1400, attack:0.005, decay:0.1, sustain:0.08, release:0.08, noteDur:'8n',
      sections: {
        intro:  N8,
        verse:  [['F3','Ab3','C4'],null,null,null,null,null,null,null],
        chorus: [['F3','Ab3','C4'],null,null,['Bb3','Db4','F4'],null,null,null,null],
        drop:   [['F3','Ab3','C4'],null,['Bb3','Db4','F4'],null,['Ab3','C4','Eb4'],null,['Bb3','Db4','F4'],null],
        outro:  N8
      }
    },
    lead: {
      osc:'sine', filterFreq:3000, attack:0.02, decay:0.2, sustain:0.25, release:0.3, noteDur:'8n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['C5',null,null,null,'Bb4',null,null,null,'Ab4',null,'Bb4',null,null,null,null,null],
        drop:   ['C5',null,'Ab4','Bb4','C5',null,'F5',null,'Eb5',null,'C5',null,'Bb4',null,'Ab4',null],
        outro:  N16
      }
    }
  },

  // ---- 6. ELECTRO (126) Dm ----
  {
    name: 'ELECTRO', bpm: 126,
    bass: {
      osc:'square', filterFreq:220, attack:0.005, decay:0.08, sustain:0.25, release:0.08, noteDur:'16n',
      sections: {
        intro:  ['D1',null,null,null,'D1',null,null,null],
        verse:  ['D1','D1',null,null,'F1',null,'D1',null],
        chorus: ['D1','D1',null,'F1','G1',null,'A1','D1'],
        drop:   ['D1','D1','D1',null,'D1','F1','G1','A1'],
        outro:  ['D1',null,null,null,null,null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], clap:Z16},
      verse:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:Z16},
      chorus: {kick:[1,0,0,1,1,0,0,0,1,0,0,1,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      drop:   {kick:[1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0], snare:[0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0], hat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], clap:[0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1]},
      outro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], clap:Z16}
    }},
    synth: {
      osc:'square', filterFreq:700, attack:0.005, decay:0.06, sustain:0, release:0.04, noteDur:'16n',
      sections: {
        intro:  N8,
        verse:  N8,
        chorus: [['D4','A4'],null,null,null,['F4','C5'],null,null,null],
        drop:   [['D4','A4'],null,['F4','C5'],null,['G4','D5'],null,['F4','C5'],null],
        outro:  N8
      }
    },
    lead: {
      osc:'square', filterFreq:2000, attack:0.005, decay:0.06, sustain:0.08, release:0.06, noteDur:'16n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['D5',null,null,null,'A4',null,'D5',null,'F5',null,null,null,null,null,null,null],
        drop:   ['D5','A4','D5','F5','D5','A4','G4',null,'D5','F5','G5','F5','D5',null,'A4','D5'],
        outro:  N16
      }
    }
  },

  // ---- 7. LO-FI (85) Gmaj ----
  {
    name: 'LO-FI', bpm: 85,
    bass: {
      osc:'triangle', filterFreq:450, attack:0.03, decay:0.35, sustain:0.45, release:0.4, noteDur:'4n',
      sections: {
        intro:  ['G2',null,null,null,null,null,null,null],
        verse:  ['G2',null,null,null,'B2',null,null,null],
        chorus: ['G2',null,'A2',null,'B2',null,'D3',null],
        drop:   ['G2',null,'B2','D3','G2',null,'A2',null],
        outro:  ['G2',null,null,null,null,null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0], clap:Z16},
      verse:  {kick:[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16},
      chorus: {kick:[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0], clap:Z16},
      drop:   {kick:[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:Z16},
      outro:  {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], snare:Z16, hat:[0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0], clap:Z16}
    }},
    synth: {
      osc:'triangle', filterFreq:1500, attack:0.15, decay:0.5, sustain:0.55, release:0.9, noteDur:'2n',
      sections: {
        intro:  N8,
        verse:  [['G3','B3','D4','F#4'],null,null,null,['E3','G3','B3','D4'],null,null,null],
        chorus: [['G3','B3','D4'],null,['A3','C4','E4'],null,['E3','G3','B3'],null,['D3','F#3','A3'],null],
        drop:   [['G3','B3','D4','F#4'],null,['A3','C4','E4'],null,['E3','G3','B3','D4'],null,['D3','F#3','A3','C4'],null],
        outro:  [['G3','B3','D4'],null,null,null,null,null,null,null]
      }
    },
    lead: {
      osc:'sine', filterFreq:2200, attack:0.06, decay:0.35, sustain:0.35, release:0.5, noteDur:'4n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['D5',null,null,null,'B4',null,null,null,'A4',null,null,null,'G4',null,null,null],
        drop:   ['D5',null,'B4',null,'A4',null,'G4',null,'A4',null,'B4',null,'D5',null,null,null],
        outro:  N16
      }
    }
  },

  // ---- 8. SYNTHWAVE (108) Em ----
  {
    name: 'SYNTHWAVE', bpm: 108,
    bass: {
      osc:'sawtooth', filterFreq:400, attack:0.01, decay:0.2, sustain:0.35, release:0.2, noteDur:'8n',
      sections: {
        intro:  ['E2',null,null,null,'E2',null,null,null],
        verse:  ['E2',null,'E2',null,'G2',null,'A2',null],
        chorus: ['E2',null,'G2',null,'A2',null,'B2','A2'],
        drop:   ['E2','E2',null,'G2','A2',null,'B2','G2'],
        outro:  ['E2',null,null,null,null,null,null,null]
      }
    },
    drums: { sections: {
      intro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:Z16, clap:Z16},
      verse:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], clap:Z16},
      chorus: {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      drop:   {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0], hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      outro:  {kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:Z16, hat:Z16, clap:Z16}
    }},
    synth: {
      osc:'sawtooth', filterFreq:2000, attack:0.005, decay:0.1, sustain:0.08, release:0.08, noteDur:'16n',
      sections: {
        intro:  N8,
        verse:  [['E3','G3','B3'],null,null,null,['A3','C4','E4'],null,null,null],
        chorus: ['E4','G4','B4','E4','A4','C5','E5','A4'],
        drop:   ['E4','G4','B4','G4','A4','C5','E5','C5'],
        outro:  [['E3','G3','B3'],null,null,null,null,null,null,null]
      }
    },
    lead: {
      osc:'sawtooth', filterFreq:4500, attack:0.02, decay:0.2, sustain:0.45, release:0.35, noteDur:'8n', subdiv:'16n',
      sections: {
        intro:  N16,
        verse:  N16,
        chorus: ['B4',null,'E5',null,'D5',null,'B4',null,'A4',null,null,null,'G4',null,'A4',null],
        drop:   ['B4',null,'E5','D5','B4',null,'E5',null,'G5',null,'E5','D5','B4',null,'A4','B4'],
        outro:  N16
      }
    }
  }
];


// ===== D&B TUTORIAL TASKS =====
// Track index 2 is DRUM & BASS. Tasks reference the D&B patterns.
const DNB_TRACK_INDEX = 2;

const TUTORIAL_TASKS = {
  intro: {
    title: 'INTRO',
    subtitle: 'Building the Foundation',
    description: 'Start with the basics: a two-step kick and off-beat hats to set the D&B tempo.',
    tasks: [
      {
        text: 'Add kick on beat 1',
        hint: 'Click the KICK row at column 1. This is where the bar starts.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'kick', col: 0 }
      },
      {
        text: 'Add the second kick off-beat',
        hint: 'In D&B, the second kick lands late. Click KICK at column 11.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'kick', col: 10 }
      },
      {
        text: 'Add off-beat hi-hats',
        hint: 'Click HI-HAT at columns 3, 7, 11, 15. Off-beat hats drive the groove.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'hat', cols: [2,6,10,14] }
      },
      {
        text: 'Drop in the bass root note',
        hint: 'Click E1 at step 1 in the bass grid. Feel the sub.',
        layer: 'bass',
        type: 'grid_on',
        check: { layer:'bass', note:'E1', col: 0 }
      },
      {
        text: 'Add a touch of swing',
        hint: 'Pull GROOVE to about 20%. Makes it feel human, not robotic.',
        layer: 'drums',
        type: 'param',
        check: { param:'drums-groove', min: 0.12, max: 0.35 }
      }
    ]
  },
  verse: {
    title: 'VERSE',
    subtitle: 'Breakbeat & Bass Movement',
    description: 'Layer in the classic breakbeat snare and get the bass walking.',
    tasks: [
      {
        text: 'Add the breakbeat snare',
        hint: 'Click SNARE at column 5. This is the classic D&B snare spot.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'snare', col: 4 }
      },
      {
        text: 'Add a ghost snare',
        hint: 'Click SNARE at column 8. Ghost notes give it that jungle shuffle.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'snare', col: 7 }
      },
      {
        text: 'Snare roll at the bar end',
        hint: 'Click SNARE at column 15. Drives into the next bar.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'snare', col: 14 }
      },
      {
        text: 'Walk the bass down to D1',
        hint: 'Click D1 at step 4. The bass drops a tone — instant tension.',
        layer: 'bass',
        type: 'grid_on',
        check: { layer:'bass', note:'D1', col: 6 }
      },
      {
        text: 'Bass up to G1',
        hint: 'Click G1 at step 5. Now the bass is moving.',
        layer: 'bass',
        type: 'grid_on',
        check: { layer:'bass', note:'G1', col: 8 }
      },
      {
        text: 'Bring in the synth pad',
        hint: 'Click E3 at step 1 in the synth grid. Atmosphere.',
        layer: 'synth',
        type: 'grid_on',
        check: { layer:'synth', note:'E3', col: 0 }
      },
      {
        text: 'Open up the pad with SPACE',
        hint: 'Drag SPACE to about 40%. Let the reverb breathe.',
        layer: 'synth',
        type: 'param',
        check: { param:'synth-space', min: 0.3, max: 0.55 }
      }
    ]
  },
  chorus: {
    title: 'CHORUS',
    subtitle: 'The Hook',
    description: 'The melody arrives. This is what people remember.',
    tasks: [
      {
        text: 'Start the hook on B4',
        hint: 'Click B4 at step 1 in the lead panel. Strong opening note.',
        layer: 'lead',
        type: 'grid_on',
        check: { layer:'lead', note:'B4', col: 0 }
      },
      {
        text: 'Drop to A4',
        hint: 'Click A4 at step 4. The melody steps down.',
        layer: 'lead',
        type: 'grid_on',
        check: { layer:'lead', note:'A4', col: 3 }
      },
      {
        text: 'Down to G4',
        hint: 'Click G4 at step 5. Falling melody — classic trick.',
        layer: 'lead',
        type: 'grid_on',
        check: { layer:'lead', note:'G4', col: 4 }
      },
      {
        text: 'Land on E4',
        hint: 'Click E4 at step 7. That\'s home — the root note.',
        layer: 'lead',
        type: 'grid_on',
        check: { layer:'lead', note:'E4', col: 7 }
      },
      {
        text: 'Add the second chord',
        hint: 'Click A3 at step 5 in synth. Two chords = harmonic movement.',
        layer: 'synth',
        type: 'grid_on',
        check: { layer:'synth', note:'A3', col: 8 }
      },
      {
        text: 'Clap on the snare hit',
        hint: 'Click CLAP at column 5. Layers with the snare for power.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'clap', col: 4 }
      },
      {
        text: 'Open the lead filter',
        hint: 'Drag BRIGHT to about 60%. Let the melody cut through.',
        layer: 'lead',
        type: 'param',
        check: { param:'lead-bright', min: 0.5, max: 0.75 }
      },
      {
        text: 'Add echo to the lead',
        hint: 'Drag ECHO to about 25%. The delay adds space and depth.',
        layer: 'lead',
        type: 'param',
        check: { param:'lead-echo', min: 0.15, max: 0.4 }
      }
    ]
  },
  drop: {
    title: 'DROP',
    subtitle: 'Maximum Energy',
    description: 'Everything hits at once. This is where the crowd goes off.',
    tasks: [
      {
        text: 'Drop the kick pattern in',
        hint: 'Add kicks at columns 1, 7, 10. Driving double-time energy.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'kick', cols: [0, 6, 9] }
      },
      {
        text: 'Amen-style snare pattern',
        hint: 'Snares at 5, 8, 13, 15 — the spirit of the amen break.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'snare', cols: [4, 7, 12, 14] }
      },
      {
        text: 'Fill out the hi-hats',
        hint: 'Use the mute toggle (click HI-HAT label) to unmute, then fill gaps.',
        layer: 'drums',
        type: 'grid_on',
        check: { layer:'drums', voice:'hat', cols: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] }
      },
      {
        text: 'Bass riff — E1 at steps 1 and 3',
        hint: 'The bass doubles up. Click E1 at columns 1 and 5.',
        layer: 'bass',
        type: 'grid_on',
        check: { layer:'bass', note:'E1', cols: [0, 4] }
      },
      {
        text: 'Chromatic bass climb — Bb1',
        hint: 'Click Bb1 at step 7. That semitone tension is pure D&B.',
        layer: 'bass',
        type: 'grid_on',
        check: { layer:'bass', note:'Bb1', col: 12 }
      },
      {
        text: 'Crank the bass WEIGHT',
        hint: 'Drag WEIGHT to 80%+. Feel the Reese in your chest.',
        layer: 'bass',
        type: 'param',
        check: { param:'bass-weight', min: 0.7, max: 0.95 }
      },
      {
        text: 'Max out the PUNCH',
        hint: 'Drag PUNCH to 80%+. The drums need to slam.',
        layer: 'drums',
        type: 'param',
        check: { param:'drums-punch', min: 0.7, max: 1.0 }
      },
      {
        text: 'Push BRIGHT to max',
        hint: 'Drag BRIGHT to 75%+. The lead screams over the top.',
        layer: 'lead',
        type: 'param',
        check: { param:'lead-bright', min: 0.7, max: 1.0 }
      }
    ]
  },
  outro: {
    title: 'OUTRO',
    subtitle: 'The Fade',
    description: 'Strip it back. One by one, the layers disappear into the night.',
    tasks: [
      {
        text: 'Fade the lead out',
        hint: 'Drag lead VOL down to zero. The melody fades away.',
        layer: 'lead',
        type: 'volume',
        check: { layer:'lead', min: 0, max: 0.08 }
      },
      {
        text: 'Kill the snare',
        hint: 'Click OFF all snare cells. Just kick and hats now.',
        layer: 'drums',
        type: 'grid_off',
        check: { layer:'drums', voice:'snare', allOff: true }
      },
      {
        text: 'Pull the bass down',
        hint: 'Drag bass VOL to about 40%. The sub fades away.',
        layer: 'bass',
        type: 'volume',
        check: { layer:'bass', min: 0.3, max: 0.55 }
      },
      {
        text: 'Strip the claps',
        hint: 'Click OFF all clap cells. Nearly gone now.',
        layer: 'drums',
        type: 'grid_off',
        check: { layer:'drums', voice:'clap', allOff: true }
      },
      {
        text: 'Fade to black',
        hint: 'Pull MASTER down to about 30%. The track disappears.',
        layer: 'master',
        type: 'master_volume',
        check: { min: 0.15, max: 0.4 }
      }
    ]
  }
};


// ===== DRUM KIT (layered synthesis) =====
class DrumKit {
  constructor(dest) {
    // ---- KICK: sub body + click attack + soft distortion ----
    this.kickDist = new Tone.Distortion(0.12);
    this.kickDist.connect(dest);

    this.kickSub = new Tone.MembraneSynth({
      pitchDecay:0.08, octaves:8, oscillator:{type:'sine'},
      envelope:{attack:0.001, decay:0.45, sustain:0, release:0.08}
    });
    this.kickSub.connect(this.kickDist);
    this.kickSub.volume.value = -4;

    this.kickClick = new Tone.MembraneSynth({
      pitchDecay:0.02, octaves:3, oscillator:{type:'triangle'},
      envelope:{attack:0.001, decay:0.04, sustain:0, release:0.02}
    });
    this.kickClick.connect(dest);
    this.kickClick.volume.value = -10;

    // ---- SNARE: triangle body + pink noise through bandpass ----
    this.snareBody = new Tone.MembraneSynth({
      pitchDecay:0.015, octaves:5, oscillator:{type:'triangle'},
      envelope:{attack:0.001, decay:0.18, sustain:0, release:0.06}
    });
    this.snareBody.connect(dest);
    this.snareBody.volume.value = -8;

    this.snareNoise = new Tone.NoiseSynth({
      noise:{type:'pink'},
      envelope:{attack:0.001, decay:0.15, sustain:0, release:0.05}
    });
    this.snareBP = new Tone.Filter({frequency:4000, type:'bandpass', Q:1.2});
    this.snareBP.connect(dest);
    this.snareNoise.connect(this.snareBP);
    this.snareNoise.volume.value = -8;

    // ---- HI-HAT: white noise through steep highpass ----
    this.hatNoise = new Tone.NoiseSynth({
      noise:{type:'white'},
      envelope:{attack:0.001, decay:0.04, sustain:0, release:0.008}
    });
    this.hatHP = new Tone.Filter({frequency:8000, type:'highpass', rolloff:-24});
    this.hatHP.connect(dest);
    this.hatNoise.connect(this.hatHP);
    this.hatNoise.volume.value = -14;

    // ---- CLAP: white noise through bandpass ----
    this.clapNoise = new Tone.NoiseSynth({
      noise:{type:'white'},
      envelope:{attack:0.001, decay:0.13, sustain:0, release:0.06}
    });
    this.clapBP = new Tone.Filter({frequency:2500, type:'bandpass', Q:1.5});
    this.clapBP.connect(dest);
    this.clapNoise.connect(this.clapBP);
    this.clapNoise.volume.value = -8;
  }
  triggerKick(t) {
    this.kickSub.triggerAttackRelease('C1','8n',t);
    this.kickClick.triggerAttackRelease('G3','32n',t);
  }
  triggerSnare(t) {
    this.snareBody.triggerAttackRelease('D3','16n',t);
    this.snareNoise.triggerAttackRelease('16n',t);
  }
  triggerHat(t) { this.hatNoise.triggerAttackRelease('32n',t); }
  triggerClap(t) { this.clapNoise.triggerAttackRelease('16n',t); }
  setPunch(v) {
    this.kickSub.volume.value = -4 + v*4;
    this.kickClick.volume.value = -10 + v*5;
    this.snareBody.volume.value = -8 + v*5;
    this.snareNoise.volume.value = -8 + v*5;
  }
  dispose() {
    [this.kickSub,this.kickClick,this.kickDist,
     this.snareBody,this.snareNoise,this.snareBP,
     this.hatNoise,this.hatHP,
     this.clapNoise,this.clapBP].forEach(n=>n.dispose());
  }
}


// ===== MELODIC LAYER (enhanced: fat oscillators, distortion, chorus, sub) =====
class MelodicLayer {
  constructor(config, dest) {
    this.extras = []; // extra nodes for disposal

    // Signal chain: synth → [distortion] → filter → [chorus] → dest
    this.filter = new Tone.Filter({
      frequency: config.filterFreq||2000, type:'lowpass',
      rolloff: config.rolloff||-12, Q: config.filterQ||1
    });

    // Optional chorus (after filter)
    let chainEnd = dest;
    if (config.chorus) {
      this.chorus = new Tone.Chorus({
        frequency: config.chorus.freq||1.5,
        delayTime: config.chorus.delay||3.5,
        depth: config.chorus.depth||0.7,
        wet: config.chorus.wet||0.5
      }).start();
      this.chorus.connect(dest);
      chainEnd = this.chorus;
      this.extras.push(this.chorus);
    }
    this.filter.connect(chainEnd);

    // Optional distortion (before filter)
    let synthTarget = this.filter;
    if (config.distortion) {
      this.dist = new Tone.Distortion(config.distortion);
      this.dist.connect(this.filter);
      synthTarget = this.dist;
      this.extras.push(this.dist);
    }

    // Main synth — supports fat oscillators via oscCount/oscSpread
    const oscConfig = { type: config.osc||'sawtooth' };
    if (config.oscCount) {
      oscConfig.count = config.oscCount;
      oscConfig.spread = config.oscSpread||20;
    }
    this.synth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: config.polyphony||8,
      oscillator: oscConfig,
      envelope: {
        attack: config.attack||0.01, decay: config.decay||0.2,
        sustain: config.sustain||0.3, release: config.release||0.2
      }
    });
    this.synth.connect(synthTarget);

    // Optional sub-bass layer (clean sine, bypasses distortion/filter)
    this.subSynth = null;
    if (config.sub) {
      this.subSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 4,
        oscillator: { type:'sine' },
        envelope: {
          attack: config.sub.attack||0.005, decay: config.sub.decay||0.5,
          sustain: config.sub.sustain||0.7, release: config.sub.release||0.3
        }
      });
      this.subSynth.connect(dest);
      this.subSynth.volume.value = config.sub.volume||-6;
    }

    this.baseFilterFreq = config.filterFreq||2000;
    this.noteDur = config.noteDur||'8n';
  }

  // Play note(s) — triggers main synth + sub if present
  play(note, duration, time) {
    const notes = Array.isArray(note) ? note : [note];
    this.synth.triggerAttackRelease(notes, duration, time);
    if (this.subSynth) this.subSynth.triggerAttackRelease(notes, duration, time);
  }

  setFilterFreq(v) {
    this.filter.frequency.value = 80 * Math.pow(150, v); // 80Hz to 12kHz
  }
  dispose() {
    this.synth.dispose(); this.filter.dispose();
    if (this.subSynth) this.subSynth.dispose();
    this.extras.forEach(n=>n.dispose());
  }
}


// ===== MIX ENGINE =====
class MixEngine {
  constructor() {
    this.currentTrackIdx = 0;
    this.currentSection = 'intro';
    this.isPlaying = false;
    this.sequences = [];
    this.volumes = { bass:0.75, drums:0.75, synth:0.75, lead:0.75 };
    this.masterVolume = 0.8;

    // Master gain → limiter → destination
    this.masterGain = new Tone.Gain(0.8);
    this.limiter = new Tone.Limiter(-2);
    this.masterGain.connect(this.limiter);
    this.limiter.toDestination();

    // Effects
    this.delay = new Tone.FeedbackDelay({delayTime:'8n.', feedback:0.3, wet:0});
    this.delay.connect(this.masterGain);
    this.reverb = new Tone.Reverb({decay:3.5, wet:0});
    this.reverb.connect(this.masterGain);
    this._reverbReady = this.reverb.generate();

    // Drum bus compressor for glue
    this.drumComp = new Tone.Compressor({threshold:-18, ratio:4, attack:0.003, release:0.15});
    this.drumComp.connect(this.masterGain);

    // Per-layer gains
    this.gains = {
      bass: new Tone.Gain(0.75),
      drums: new Tone.Gain(0.75),
      synth: new Tone.Gain(0.75),
      lead: new Tone.Gain(0.75)
    };
    this.gains.bass.connect(this.masterGain);
    this.gains.drums.connect(this.drumComp);
    this.gains.synth.connect(this.masterGain);
    this.gains.lead.connect(this.masterGain);

    this.gains.synth.connect(this.reverb);
    this.gains.lead.connect(this.delay);

    this.drumKit = new DrumKit(this.gains.drums);
    this.bassLayer = null;
    this.synthLayer = null;
    this.leadLayer = null;

    // MUTABLE LIVE PATTERNS — the core game mechanic
    this.livePatterns = {};

    this.mutedVoices = new Set(); // drum voice mute toggles

    this.noteCallbacks = { bass:null, drums:null, synth:null, lead:null };
    this._debugInfo = 'engine ready';
  }

  async init() { await this._reverbReady; }

  // Deep copy current section patterns into livePatterns
  copyPatternToLive() {
    const track = TRACKS[this.currentTrackIdx];
    const sec = this.currentSection;
    this.livePatterns = {
      bass: [...track.bass.sections[sec]],
      drums: {
        kick:  [...track.drums.sections[sec].kick],
        snare: [...track.drums.sections[sec].snare],
        hat:   [...track.drums.sections[sec].hat],
        clap:  [...track.drums.sections[sec].clap]
      },
      synth: track.synth.sections[sec].map(s =>
        s === null ? null : (Array.isArray(s) ? [...s] : s)
      ),
      lead: [...track.lead.sections[sec]]
    };
  }

  // Clear livePatterns to empty (for tutorial start)
  clearLivePatterns() {
    const track = TRACKS[this.currentTrackIdx];
    const sec = this.currentSection;
    const bassLen = track.bass.sections[sec].length;
    const synthLen = track.synth.sections[sec].length;
    const leadLen = track.lead.sections[sec].length;
    this.livePatterns = {
      bass: new Array(bassLen).fill(null),
      drums: {
        kick: new Array(16).fill(0),
        snare: new Array(16).fill(0),
        hat: new Array(16).fill(0),
        clap: new Array(16).fill(0)
      },
      synth: new Array(synthLen).fill(null),
      lead: new Array(leadLen).fill(null)
    };
  }

  // Toggle a drum cell on/off
  toggleDrumCell(voice, col) {
    if (!this.livePatterns.drums) return;
    this.livePatterns.drums[voice][col] = this.livePatterns.drums[voice][col] ? 0 : 1;
    this.rebuildLayerSequence('drums');
    return this.livePatterns.drums[voice][col];
  }

  // Toggle a melodic cell on/off
  // noteIndex = row index in the note list, col = 0-15 column
  toggleMelodicCell(layerName, noteIndex, col) {
    if (!this.livePatterns[layerName]) return;
    const track = TRACKS[this.currentTrackIdx];
    const allNotes = getLayerNotes(track[layerName]);
    const note = allNotes[noteIndex];
    if (!note) return;

    const is16 = layerName === 'lead';
    const stepIdx = is16 ? col : Math.floor(col / 2);

    if (!is16 && col % 2 !== 0) return; // 8-step layers: only even cols

    const pattern = this.livePatterns[layerName];
    const current = pattern[stepIdx];

    if (current === null) {
      // Turn on
      pattern[stepIdx] = note;
    } else if (Array.isArray(current)) {
      if (current.includes(note)) {
        // Turn off this note in chord
        const filtered = current.filter(n => n !== note);
        pattern[stepIdx] = filtered.length === 0 ? null : (filtered.length === 1 ? filtered[0] : filtered);
      } else {
        // Add to chord
        current.push(note);
      }
    } else {
      if (current === note) {
        // Turn off
        pattern[stepIdx] = null;
      } else {
        // Different note already here — make chord
        pattern[stepIdx] = [current, note];
      }
    }
    this.rebuildLayerSequence(layerName);
  }

  // Rebuild just one layer's sequence while playing
  rebuildLayerSequence(layerName) {
    // Find and dispose old sequence for this layer
    const layerIdx = { bass:0, drums:1, synth:2, lead:3 }[layerName];
    if (this.sequences[layerIdx]) {
      this.sequences[layerIdx].stop();
      this.sequences[layerIdx].dispose();
    }

    const track = TRACKS[this.currentTrackIdx];
    let seq;

    switch(layerName) {
      case 'bass': {
        const bp = this.livePatterns.bass;
        const bd = track.bass.noteDur||'8n';
        seq = new Tone.Sequence((t,n) => {
          if (n && this.volumes.bass > 0) {
            this.bassLayer.play(n, bd, t);
            if (this.noteCallbacks.bass) Tone.Draw.schedule(()=>this.noteCallbacks.bass(), t);
          }
        }, bp, '8n');
        break;
      }
      case 'drums': {
        const ds = this.livePatterns.drums;
        const mv = this.mutedVoices;
        seq = new Tone.Sequence((t,i) => {
          if (this.volumes.drums === 0) return;
          if (ds.kick[i] && !mv.has('kick')) this.drumKit.triggerKick(t);
          if (ds.snare[i] && !mv.has('snare')) this.drumKit.triggerSnare(t);
          if (ds.hat[i] && !mv.has('hat')) this.drumKit.triggerHat(t);
          if (ds.clap[i] && !mv.has('clap')) this.drumKit.triggerClap(t);
          if ((ds.kick[i]||ds.snare[i]||ds.hat[i]||ds.clap[i]) && this.noteCallbacks.drums)
            Tone.Draw.schedule(()=>this.noteCallbacks.drums(), t);
        }, [...Array(16).keys()], '16n');
        break;
      }
      case 'synth': {
        const sp = this.livePatterns.synth;
        const sd = track.synth.noteDur||'2n';
        seq = new Tone.Sequence((t,n) => {
          if (n && this.volumes.synth > 0) {
            this.synthLayer.play(n, sd, t);
            if (this.noteCallbacks.synth) Tone.Draw.schedule(()=>this.noteCallbacks.synth(), t);
          }
        }, sp, '8n');
        break;
      }
      case 'lead': {
        const lp = this.livePatterns.lead;
        const ld = track.lead.noteDur||'8n';
        seq = new Tone.Sequence((t,n) => {
          if (n && this.volumes.lead > 0) {
            this.leadLayer.play(n, ld, t);
            if (this.noteCallbacks.lead) Tone.Draw.schedule(()=>this.noteCallbacks.lead(), t);
          }
        }, lp, '16n');
        break;
      }
    }

    this.sequences[layerIdx] = seq;
    if (this.isPlaying) seq.start(0);
  }

  loadTrack(idx) {
    this.stopSequences();
    const track = TRACKS[idx];
    this.currentTrackIdx = idx;
    Tone.Transport.bpm.value = track.bpm;

    if (this.bassLayer) this.bassLayer.dispose();
    if (this.synthLayer) this.synthLayer.dispose();
    if (this.leadLayer) this.leadLayer.dispose();

    this.bassLayer = new MelodicLayer(track.bass, this.gains.bass);
    this.bassLayer.synth.volume.value = -6;

    this.synthLayer = new MelodicLayer(track.synth, this.gains.synth);
    this.synthLayer.synth.volume.value = -12;

    this.leadLayer = new MelodicLayer(track.lead, this.gains.lead);
    this.leadLayer.synth.volume.value = -6;

    this.copyPatternToLive();
    this.buildSequences();
    if (this.isPlaying) this.startSequences();
  }

  buildSequences() {
    this.stopSequences();
    this.sequences = [];
    const track = TRACKS[this.currentTrackIdx];

    // Bass (8 steps at 8n) — from livePatterns
    const bp = this.livePatterns.bass, bd = track.bass.noteDur||'8n';
    this.sequences.push(new Tone.Sequence((t,n) => {
      if (n && this.volumes.bass > 0) {
        this.bassLayer.play(n, bd, t);
        if (this.noteCallbacks.bass) Tone.Draw.schedule(()=>this.noteCallbacks.bass(), t);
      }
    }, bp, '8n'));

    // Drums (16 steps at 16n) — from livePatterns
    const ds = this.livePatterns.drums;
    const mv = this.mutedVoices;
    this.sequences.push(new Tone.Sequence((t,i) => {
      if (this.volumes.drums === 0) return;
      if (ds.kick[i] && !mv.has('kick')) this.drumKit.triggerKick(t);
      if (ds.snare[i] && !mv.has('snare')) this.drumKit.triggerSnare(t);
      if (ds.hat[i] && !mv.has('hat')) this.drumKit.triggerHat(t);
      if (ds.clap[i] && !mv.has('clap')) this.drumKit.triggerClap(t);
      if ((ds.kick[i]||ds.snare[i]||ds.hat[i]||ds.clap[i]) && this.noteCallbacks.drums)
        Tone.Draw.schedule(()=>this.noteCallbacks.drums(), t);
    }, [...Array(16).keys()], '16n'));

    // Synth (8 steps at 8n) — from livePatterns
    const sp = this.livePatterns.synth, sd = track.synth.noteDur||'2n';
    this.sequences.push(new Tone.Sequence((t,n) => {
      if (n && this.volumes.synth > 0) {
        this.synthLayer.play(n, sd, t);
        if (this.noteCallbacks.synth) Tone.Draw.schedule(()=>this.noteCallbacks.synth(), t);
      }
    }, sp, '8n'));

    // Lead (16 steps at 16n) — from livePatterns
    const lp = this.livePatterns.lead, ld = track.lead.noteDur||'8n';
    this.sequences.push(new Tone.Sequence((t,n) => {
      if (n && this.volumes.lead > 0) {
        this.leadLayer.play(n, ld, t);
        if (this.noteCallbacks.lead) Tone.Draw.schedule(()=>this.noteCallbacks.lead(), t);
      }
    }, lp, '16n'));
  }

  startSequences() { this.sequences.forEach(s => s.start(0)); }
  stopSequences() { this.sequences.forEach(s => { s.stop(); s.dispose(); }); this.sequences = []; }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.buildSequences();
    this.startSequences();
    Tone.Transport.start();
  }
  stop() {
    this.isPlaying = false;
    Tone.Transport.stop();
    this.stopSequences();
  }
  togglePlay() { if (this.isPlaying) this.stop(); else this.play(); return this.isPlaying; }

  setSection(sec) {
    this.currentSection = sec;
    this.copyPatternToLive();
    if (this.isPlaying) { this.buildSequences(); this.startSequences(); }
  }

  setVolume(layer, val) {
    this.volumes[layer] = val;
    const gain = val * val;
    this.gains[layer].gain.rampTo(gain, 0.05);
  }

  setMasterVolume(val) {
    this.masterVolume = val;
    this.masterGain.gain.rampTo(val * val, 0.05);
  }

  setParam(param, val) {
    switch(param) {
      case 'bass-tone': if(this.bassLayer) this.bassLayer.setFilterFreq(val); break;
      case 'bass-weight':
        if(this.bassLayer) {
          this.bassLayer.synth.volume.value = -14 + val*10;
          if(this.bassLayer.subSynth) this.bassLayer.subSynth.volume.value = -10 + val*6;
        }
        break;
      case 'drums-punch': this.drumKit.setPunch(val); break;
      case 'drums-groove': Tone.Transport.swing = val * 0.4; break;
      case 'synth-colour': if(this.synthLayer) this.synthLayer.setFilterFreq(val); break;
      case 'synth-space': this.reverb.wet.value = val * 0.6; break;
      case 'lead-bright': if(this.leadLayer) this.leadLayer.setFilterFreq(val); break;
      case 'lead-echo': this.delay.wet.value = val*0.5; this.delay.feedback.value = val*0.4; break;
    }
  }

  // Get drum pattern for grid from livePatterns
  getDrumGrid() {
    const d = this.livePatterns.drums;
    return DRUM_VOICES.map(v => d[v]);
  }

  // Get melodic grid data from livePatterns
  getMelodicGrid(layerName) {
    const track = TRACKS[this.currentTrackIdx];
    const layerData = track[layerName];
    const allNotes = getLayerNotes(layerData);
    if (allNotes.length === 0) return { notes: [], grid: [] };

    const pattern = this.livePatterns[layerName];
    const is16 = layerName === 'lead';
    const cols = 16;

    const grid = allNotes.map(note => {
      const row = new Array(cols).fill(0);
      pattern.forEach((step, i) => {
        if (!step) return;
        const col = is16 ? i : i * 2;
        if (col >= cols) return;
        const stepNotes = Array.isArray(step) ? step : [step];
        if (stepNotes.includes(note)) row[col] = 1;
      });
      return row;
    });
    return { notes: allNotes, grid };
  }

  // Drum voice mute/unmute
  toggleVoiceMute(voice) {
    if (this.mutedVoices.has(voice)) {
      this.mutedVoices.delete(voice);
    } else {
      this.mutedVoices.add(voice);
    }
    this.rebuildLayerSequence('drums');
    return this.mutedVoices.has(voice);
  }

  isVoiceMuted(voice) {
    return this.mutedVoices.has(voice);
  }
}


// ===== TASK CHECKER =====
class TaskChecker {
  constructor(engine) {
    this.engine = engine;
    this.paramValues = {};
  }

  updateParam(param, val) {
    this.paramValues[param] = val;
  }

  // Check a single task, return true if complete
  check(task) {
    const eng = this.engine;
    const c = task.check;

    switch(task.type) {
      case 'grid_on': {
        if (c.layer === 'drums') {
          if (c.cols) {
            // Multiple columns must ALL be on
            return c.cols.every(col => eng.livePatterns.drums[c.voice][col] === 1);
          }
          return eng.livePatterns.drums[c.voice][c.col] === 1;
        }
        // Melodic
        const data = eng.getMelodicGrid(c.layer);
        const noteIdx = data.notes.indexOf(c.note);
        if (noteIdx === -1) return false;
        if (c.cols) {
          return c.cols.every(col => data.grid[noteIdx][col] === 1);
        }
        return data.grid[noteIdx][c.col] === 1;
      }

      case 'grid_off': {
        if (c.layer === 'drums') {
          if (c.allOff) {
            return eng.livePatterns.drums[c.voice].every(v => v === 0);
          }
          if (c.cols) {
            return c.cols.every(col => eng.livePatterns.drums[c.voice][col] === 0);
          }
          return eng.livePatterns.drums[c.voice][c.col] === 0;
        }
        return false;
      }

      case 'volume': {
        const vol = eng.volumes[c.layer];
        return vol >= c.min && vol <= c.max;
      }

      case 'master_volume': {
        return eng.masterVolume >= c.min && eng.masterVolume <= c.max;
      }

      case 'param': {
        const val = this.paramValues[c.param];
        if (val === undefined) return false;
        return val >= c.min && val <= c.max;
      }

      case 'voice_unmute': {
        return !eng.isVoiceMuted(c.voice);
      }

      case 'voice_mute': {
        return eng.isVoiceMuted(c.voice);
      }
    }
    return false;
  }
}


// ===== SLIDER CONTROL =====
class SliderControl {
  constructor(container, label, initVal, onChange, layerColor) {
    this.value = initVal;
    this.onChange = onChange;
    this.dragging = false;

    this.el = document.createElement('div');
    this.el.className = 'slider-unit';

    this.track = document.createElement('div');
    this.track.className = 'slider-track';

    this.fill = document.createElement('div');
    this.fill.className = 'slider-fill';
    this.track.appendChild(this.fill);

    this.thumb = document.createElement('div');
    this.thumb.className = 'slider-thumb';
    this.track.appendChild(this.thumb);

    const lbl = document.createElement('span');
    lbl.className = 'slider-label';
    lbl.textContent = label;

    this.el.appendChild(this.track);
    this.el.appendChild(lbl);
    container.appendChild(this.el);

    this.updateVisual();
    this.bindEvents();
  }

  updateVisual() {
    const pct = this.value * 100;
    this.fill.style.height = pct + '%';
    this.thumb.style.bottom = pct + '%';
  }

  setValue(v) {
    this.value = Math.max(0, Math.min(1, v));
    this.updateVisual();
  }

  bindEvents() {
    const getVal = (y) => {
      const rect = this.track.getBoundingClientRect();
      return 1 - Math.max(0, Math.min(1, (y - rect.top) / rect.height));
    };

    this.track.addEventListener('mousedown', e => {
      this.dragging = true;
      this.setValue(getVal(e.clientY));
      this.onChange(this.value);
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!this.dragging) return;
      this.setValue(getVal(e.clientY));
      this.onChange(this.value);
    });
    window.addEventListener('mouseup', () => { this.dragging = false; });

    this.track.addEventListener('touchstart', e => {
      this.dragging = true;
      this.setValue(getVal(e.touches[0].clientY));
      this.onChange(this.value);
      e.preventDefault();
    }, {passive:false});
    window.addEventListener('touchmove', e => {
      if (!this.dragging) return;
      this.setValue(getVal(e.touches[0].clientY));
      this.onChange(this.value);
    }, {passive:false});
    window.addEventListener('touchend', () => { this.dragging = false; });
  }
}


// ===== BEAT LAB APP =====
class BeatLabApp {
  constructor() {
    this.engine = null;
    this.sliders = {};
    this.gridCells = {};
    this.lastStep = -1;
    this.taskChecker = null;
    this.tutorialMode = false;
    this.currentTutorialSection = 'intro';
    this.taskStates = {}; // { sectionName: [bool, bool, ...] }
    this.completedSections = new Set();
    this.painting = false; // touch-and-paint state
    this.paintMode = null; // 'on' or 'off'
    this.paintLayer = null;
    // Enjoy phase — let music play for a few bars before showing celebration
    this.enjoyPhase = false;
    this.enjoyBarsTarget = 4;
    this.enjoyBarsPlayed = 0;
    this.enjoyLastBar = -1;
  }

  async start() {
    await Tone.start();

    this.engine = new MixEngine();
    await this.engine.init();

    document.getElementById('start-overlay').classList.add('fade-out');
    setTimeout(() => document.getElementById('start-overlay').style.display = 'none', 600);
    document.getElementById('app').classList.remove('hidden');

    this.buildSliders();
    this.buildMasterSlider();
    this.bindControls();

    // Start in tutorial mode on D&B track
    this.engine.loadTrack(DNB_TRACK_INDEX);
    this.tutorialMode = true;
    this.startTutorialSection('intro');

    this.updateTrackDisplay();
    this.buildAllGrids();

    this.engine.play();
    document.getElementById('play-pause').classList.add('playing');
    this.startUILoop();
    this.updateSectionButtons();
  }

  buildMasterSlider() {
    const track = document.querySelector('.master-slider-track');
    const fill = document.querySelector('.master-slider-fill');
    const thumb = document.querySelector('.master-slider-thumb');
    let dragging = false;

    const getVal = (y) => {
      const rect = track.getBoundingClientRect();
      return 1 - Math.max(0, Math.min(1, (y - rect.top) / rect.height));
    };
    const update = (v) => {
      const val = Math.max(0, Math.min(1, v));
      this.engine.setMasterVolume(val);
      fill.style.height = (val * 100) + '%';
      thumb.style.bottom = (val * 100) + '%';
      this.checkTasks();
    };

    // Set initial
    fill.style.height = '80%';
    thumb.style.bottom = '80%';

    track.addEventListener('mousedown', e => { dragging = true; update(getVal(e.clientY)); e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (dragging) update(getVal(e.clientY)); });
    window.addEventListener('mouseup', () => { dragging = false; });
    track.addEventListener('touchstart', e => { dragging = true; update(getVal(e.touches[0].clientY)); e.preventDefault(); }, {passive:false});
    window.addEventListener('touchmove', e => { if (dragging) update(getVal(e.touches[0].clientY)); }, {passive:false});
    window.addEventListener('touchend', () => { dragging = false; });
  }

  buildSliders() {
    const params = {
      bass:  [{param:'bass-vol', label:'VOL', init:0.75, isVol:true},
              {param:'bass-tone', label:'TONE', init:0.5},
              {param:'bass-weight', label:'WEIGHT', init:0.5}],
      drums: [{param:'drums-vol', label:'VOL', init:0.75, isVol:true},
              {param:'drums-punch', label:'PUNCH', init:0.5},
              {param:'drums-groove', label:'GROOVE', init:0.15}],
      synth: [{param:'synth-vol', label:'VOL', init:0.75, isVol:true},
              {param:'synth-colour', label:'COLOUR', init:0.5},
              {param:'synth-space', label:'SPACE', init:0.2}],
      lead:  [{param:'lead-vol', label:'VOL', init:0.75, isVol:true},
              {param:'lead-bright', label:'BRIGHT', init:0.5},
              {param:'lead-echo', label:'ECHO', init:0.15}]
    };

    for (const [layer, defs] of Object.entries(params)) {
      const container = document.querySelector(`.sliders[data-layer="${layer}"]`);
      for (const def of defs) {
        const slider = new SliderControl(container, def.label, def.init, (v) => {
          if (def.isVol) {
            this.engine.setVolume(layer, v);
          } else {
            this.engine.setParam(def.param, v);
            if (this.taskChecker) this.taskChecker.updateParam(def.param, v);
          }
          this.checkTasks();
        }, LAYER_COLOURS[layer]);
        this.sliders[def.param] = slider;
        if (def.isVol) this.engine.setVolume(layer, def.init);
        else {
          this.engine.setParam(def.param, def.init);
          if (this.taskChecker) this.taskChecker.updateParam(def.param, def.init);
        }
      }
    }
  }

  buildAllGrids() {
    this.buildDrumGrid();
    this.buildMelodicGrid('bass');
    this.buildMelodicGrid('synth');
    this.buildMelodicGrid('lead');
  }

  createBeatNumberCorner() {
    const corner = document.createElement('div');
    corner.className = 'beat-number-corner';
    return corner;
  }

  createBeatNumber(col, hidden) {
    const num = document.createElement('div');
    num.className = 'beat-number';
    if (hidden) num.classList.add('beat-number-hidden');
    num.textContent = col + 1;
    return num;
  }

  buildDrumGrid() {
    const container = document.querySelector('.grid[data-layer="drums"]');
    container.innerHTML = '';
    const pattern = this.engine.getDrumGrid();
    const rows = DRUM_VOICES.length;
    container.style.gridTemplateRows = `auto repeat(${rows}, 1fr)`;

    // Beat number header row
    container.appendChild(this.createBeatNumberCorner());
    for (let c = 0; c < 16; c++) {
      container.appendChild(this.createBeatNumber(c));
    }

    this.gridCells.drums = [];
    for (let r = 0; r < rows; r++) {
      const voice = DRUM_VOICES[r];
      const isMuted = this.engine.isVoiceMuted(voice);

      // Clickable mute label with indicator dot
      const label = document.createElement('div');
      label.className = 'grid-label drum-label';
      if (isMuted) label.classList.add('muted');

      const dot = document.createElement('span');
      dot.className = 'mute-dot';
      label.appendChild(dot);

      const labelText = document.createElement('span');
      labelText.textContent = DRUM_LABELS[r];
      label.appendChild(labelText);

      // Mute toggle click
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const nowMuted = this.engine.toggleVoiceMute(voice);
        label.classList.toggle('muted', nowMuted);
        // Toggle visual state on all cells in this row
        const rowIdx = DRUM_VOICES.indexOf(voice);
        if (this.gridCells.drums[rowIdx]) {
          this.gridCells.drums[rowIdx].forEach(cell => {
            cell.classList.toggle('voice-muted', nowMuted);
          });
        }
        this.checkTasks();
      });

      container.appendChild(label);

      const rowCells = [];
      for (let c = 0; c < 16; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.col = c;
        cell.dataset.voice = voice;
        cell.dataset.row = r;
        if (pattern[r][c]) cell.classList.add('on');
        if (isMuted) cell.classList.add('voice-muted');
        this.bindCellClick(cell, 'drums', r, c);
        container.appendChild(cell);
        rowCells.push(cell);
      }
      this.gridCells.drums.push(rowCells);
    }
  }

  buildMelodicGrid(layerName) {
    const container = document.querySelector(`.grid[data-layer="${layerName}"]`);
    container.innerHTML = '';
    const data = this.engine.getMelodicGrid(layerName);
    const rows = data.notes.length;
    const is16 = layerName === 'lead';

    if (rows === 0) {
      container.style.gridTemplateRows = '1fr';
      this.gridCells[layerName] = [];
      return;
    }

    container.style.gridTemplateRows = `auto repeat(${rows}, 1fr)`;
    this.gridCells[layerName] = [];

    // Beat number header row
    container.appendChild(this.createBeatNumberCorner());
    const cols = is16 ? 16 : 16; // always 16 visual columns
    for (let c = 0; c < cols; c++) {
      container.appendChild(this.createBeatNumber(c, !is16 && c % 2 !== 0));
    }

    for (let r = 0; r < rows; r++) {
      const label = document.createElement('div');
      label.className = 'grid-label';
      label.textContent = shortNote(data.notes[r]);
      container.appendChild(label);

      const rowCells = [];
      for (let c = 0; c < 16; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.col = c;
        cell.dataset.row = r;
        cell.dataset.note = data.notes[r];
        if (data.grid[r][c]) cell.classList.add('on');

        // Grey out odd columns for 8-step layers
        if (!is16 && c % 2 !== 0) {
          cell.classList.add('disabled');
        } else {
          this.bindCellClick(cell, layerName, r, c);
        }

        container.appendChild(cell);
        rowCells.push(cell);
      }
      this.gridCells[layerName].push(rowCells);
    }
  }

  bindCellClick(cell, layerName, row, col) {
    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let newState;
      if (layerName === 'drums') {
        const voice = DRUM_VOICES[row];
        newState = this.engine.toggleDrumCell(voice, col);
      } else {
        this.engine.toggleMelodicCell(layerName, row, col);
        // Re-read state
        const data = this.engine.getMelodicGrid(layerName);
        newState = data.grid[row]?.[col];
      }
      cell.classList.toggle('on', !!newState);
      cell.classList.add('just-toggled');
      setTimeout(() => cell.classList.remove('just-toggled'), 150);

      // Set paint mode for drag
      this.painting = true;
      this.paintMode = newState ? 'on' : 'off';
      this.paintLayer = layerName;
      this.paintRow = row;

      this.checkTasks();
    };

    const handlePaintMove = (targetCell) => {
      if (!this.painting || this.paintLayer !== layerName) return;
      const r = parseInt(targetCell.dataset.row);
      const c = parseInt(targetCell.dataset.col);
      if (targetCell.classList.contains('disabled')) return;

      // Only paint same row
      if (r !== this.paintRow) return;

      const isOn = targetCell.classList.contains('on');
      if (this.paintMode === 'on' && !isOn) {
        if (layerName === 'drums') {
          this.engine.toggleDrumCell(DRUM_VOICES[r], c);
        } else {
          this.engine.toggleMelodicCell(layerName, r, c);
        }
        targetCell.classList.add('on');
        targetCell.classList.add('just-toggled');
        setTimeout(() => targetCell.classList.remove('just-toggled'), 150);
        this.checkTasks();
      } else if (this.paintMode === 'off' && isOn) {
        if (layerName === 'drums') {
          this.engine.toggleDrumCell(DRUM_VOICES[r], c);
        } else {
          this.engine.toggleMelodicCell(layerName, r, c);
        }
        targetCell.classList.remove('on');
        this.checkTasks();
      }
    };

    cell.addEventListener('mousedown', handleToggle);
    cell.addEventListener('mouseenter', (e) => {
      if (e.buttons === 1) handlePaintMove(cell);
    });

    cell.addEventListener('touchstart', handleToggle, {passive:false});
    cell.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains('grid-cell') && !target.classList.contains('disabled')) {
        handlePaintMove(target);
      }
    }, {passive:false});
  }

  updateGridVisuals() {
    // Drums
    const dp = this.engine.getDrumGrid();
    if (this.gridCells.drums) {
      this.gridCells.drums.forEach((row, r) => {
        const voice = DRUM_VOICES[r];
        const isMuted = this.engine.isVoiceMuted(voice);
        row.forEach((cell, c) => {
          cell.classList.toggle('on', !!dp[r][c]);
          cell.classList.toggle('voice-muted', isMuted);
        });
      });
    }
    // Melodic
    ['bass','synth','lead'].forEach(layer => {
      const data = this.engine.getMelodicGrid(layer);
      if (!this.gridCells[layer] || this.gridCells[layer].length !== data.grid.length) {
        this.buildMelodicGrid(layer);
        return;
      }
      this.gridCells[layer].forEach((row, r) => {
        row.forEach((cell, c) => cell.classList.toggle('on', !!data.grid[r]?.[c]));
      });
    });
  }

  // ===== TUTORIAL / TASK SYSTEM =====

  startTutorialSection(sectionName) {
    this.currentTutorialSection = sectionName;
    this.engine.currentSection = sectionName;
    this.enjoyPhase = false;
    this.enjoyBarsPlayed = 0;
    this.enjoyLastBar = -1;

    // Section continuity: load target pattern, then clear only task-referenced cells
    this.prepareSectionPatterns(sectionName);

    // Initialize task states
    const tasks = TUTORIAL_TASKS[sectionName];
    if (!this.taskStates[sectionName]) {
      this.taskStates[sectionName] = new Array(tasks.tasks.length).fill(false);
    }

    // Create task checker
    this.taskChecker = new TaskChecker(this.engine);
    // Seed current param values
    Object.entries(this.sliders).forEach(([param, slider]) => {
      if (!param.endsWith('-vol')) {
        this.taskChecker.updateParam(param, slider.value);
      }
    });

    if (this.engine.isPlaying) {
      this.engine.buildSequences();
      this.engine.startSequences();
    }

    this.renderTaskPanel();
    this.buildAllGrids();
    this.applyGhostHints();
    this.updateSectionButtons();
  }

  // Load the target pattern and selectively clear only task-referenced cells.
  // Non-dynamic elements auto-play — the section builds on what came before.
  prepareSectionPatterns(sectionName) {
    // Step 1: Load the full target pattern for this section
    this.engine.copyPatternToLive();

    // Step 2: Scan tasks and clear cells that the user needs to add
    const sectionData = TUTORIAL_TASKS[sectionName];
    if (!sectionData) return;

    const track = TRACKS[this.engine.currentTrackIdx];
    const lp = this.engine.livePatterns;

    for (const task of sectionData.tasks) {
      const c = task.check;

      if (task.type === 'grid_on') {
        // Clear these cells so user has to add them
        if (c.layer === 'drums') {
          if (c.cols) {
            c.cols.forEach(col => { lp.drums[c.voice][col] = 0; });
          } else if (c.col !== undefined) {
            lp.drums[c.voice][c.col] = 0;
          }
        } else {
          // Melodic layer — find and clear the specific note at specific step(s)
          const allNotes = getLayerNotes(track[c.layer]);
          const is16 = c.layer === 'lead';
          const cols = c.cols ? c.cols : (c.col !== undefined ? [c.col] : []);
          for (const col of cols) {
            const stepIdx = is16 ? col : Math.floor(col / 2);
            const current = lp[c.layer][stepIdx];
            if (current === null) continue;
            if (Array.isArray(current)) {
              const filtered = current.filter(n => n !== c.note);
              lp[c.layer][stepIdx] = filtered.length === 0 ? null : (filtered.length === 1 ? filtered[0] : filtered);
            } else if (current === c.note) {
              lp[c.layer][stepIdx] = null;
            }
          }
        }
      }
      // grid_off tasks: target cells should already be ON from copyPatternToLive, which is correct
      // volume/param/master_volume: no pattern changes needed
    }
  }

  renderTaskPanel() {
    const section = TUTORIAL_TASKS[this.currentTutorialSection];
    if (!section) return;

    const states = this.taskStates[this.currentTutorialSection] || [];
    const completed = states.filter(s => s).length;
    const total = section.tasks.length;

    // Desktop panel
    const panel = document.getElementById('task-panel');
    if (panel) {
      document.getElementById('task-section-name').textContent = section.title;
      document.getElementById('task-progress').textContent = `${completed}/${total}`;
      document.getElementById('task-subtitle').textContent = section.description;

      const list = document.getElementById('task-list');
      list.innerHTML = '';
      section.tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (states[i]) li.classList.add('completed');
        else if (i === states.indexOf(false) || (!states[i] && states.slice(0, i).every(s => s))) {
          li.classList.add('active');
        }

        const check = document.createElement('span');
        check.className = 'task-check';
        check.textContent = states[i] ? '\u2713' : '';

        const textWrap = document.createElement('div');
        const dot = document.createElement('span');
        dot.className = 'task-layer-dot';
        dot.style.backgroundColor = LAYER_COLOURS[task.layer] || '#888';

        const text = document.createElement('div');
        text.className = 'task-text';
        text.appendChild(dot);
        text.appendChild(document.createTextNode(task.text));
        textWrap.appendChild(text);

        if (!states[i] && task.hint) {
          const hint = document.createElement('div');
          hint.className = 'task-hint';
          hint.textContent = task.hint;
          textWrap.appendChild(hint);
        }

        li.appendChild(check);
        li.appendChild(textWrap);
        list.appendChild(li);
      });
    }

    // Mobile drawer
    this.renderDrawer(section, states, completed, total);
  }

  renderDrawer(section, states, completed, total) {
    const drawer = document.getElementById('task-drawer');
    if (!drawer) return;
    document.getElementById('drawer-section-name').textContent = section.title;
    document.getElementById('drawer-progress').textContent = `${completed}/${total}`;
    document.getElementById('drawer-subtitle').textContent = section.description;

    const list = document.getElementById('drawer-task-list');
    list.innerHTML = '';
    section.tasks.forEach((task, i) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (states[i]) li.classList.add('completed');
      else if (!states[i] && states.slice(0, i).every(s => s)) {
        li.classList.add('active');
      }

      const check = document.createElement('span');
      check.className = 'task-check';
      check.textContent = states[i] ? '\u2713' : '';

      const textWrap = document.createElement('div');
      const dot = document.createElement('span');
      dot.className = 'task-layer-dot';
      dot.style.backgroundColor = LAYER_COLOURS[task.layer] || '#888';

      const text = document.createElement('div');
      text.className = 'task-text';
      text.appendChild(dot);
      text.appendChild(document.createTextNode(task.text));
      textWrap.appendChild(text);

      li.appendChild(check);
      li.appendChild(textWrap);
      list.appendChild(li);
    });
  }

  clearGhostHints() {
    document.querySelectorAll('.grid-cell.ghost').forEach(c => c.classList.remove('ghost'));
  }

  applyGhostHints() {
    this.clearGhostHints();
    if (!this.tutorialMode) return;

    const section = TUTORIAL_TASKS[this.currentTutorialSection];
    if (!section) return;
    const states = this.taskStates[this.currentTutorialSection] || [];

    // Find the first incomplete task
    const activeIdx = states.indexOf(false);
    if (activeIdx === -1) return;
    const task = section.tasks[activeIdx];
    const c = task.check;

    if (task.type === 'grid_on') {
      if (c.layer === 'drums') {
        // Ghost the drum cells that need to be turned on
        const voiceIdx = DRUM_VOICES.indexOf(c.voice);
        if (voiceIdx === -1 || !this.gridCells.drums) return;
        const cols = c.cols ? c.cols : (c.col !== undefined ? [c.col] : []);
        for (const col of cols) {
          const cell = this.gridCells.drums[voiceIdx]?.[col];
          if (cell && !cell.classList.contains('on')) {
            cell.classList.add('ghost');
          }
        }
      } else {
        // Melodic — find the note row and ghost the columns
        const track = TRACKS[this.engine.currentTrackIdx];
        const allNotes = getLayerNotes(track[c.layer]);
        const noteIdx = allNotes.indexOf(c.note);
        if (noteIdx === -1 || !this.gridCells[c.layer]) return;
        const cols = c.cols ? c.cols : (c.col !== undefined ? [c.col] : []);
        for (const col of cols) {
          const cell = this.gridCells[c.layer][noteIdx]?.[col];
          if (cell && !cell.classList.contains('on') && !cell.classList.contains('disabled')) {
            cell.classList.add('ghost');
          }
        }
      }
    } else if (task.type === 'grid_off') {
      if (c.layer === 'drums') {
        // Ghost the cells that need to be turned OFF (they're currently on)
        const voiceIdx = DRUM_VOICES.indexOf(c.voice);
        if (voiceIdx === -1 || !this.gridCells.drums) return;
        if (c.allOff) {
          // Ghost all ON cells for this voice
          this.gridCells.drums[voiceIdx]?.forEach(cell => {
            if (cell.classList.contains('on')) cell.classList.add('ghost');
          });
        } else {
          const cols = c.cols ? c.cols : (c.col !== undefined ? [c.col] : []);
          for (const col of cols) {
            const cell = this.gridCells.drums[voiceIdx]?.[col];
            if (cell && cell.classList.contains('on')) cell.classList.add('ghost');
          }
        }
      }
    }
    // volume/param/master_volume tasks: no ghost cells (slider-based)
  }

  checkTasks() {
    if (!this.tutorialMode || !this.taskChecker) return;

    const section = TUTORIAL_TASKS[this.currentTutorialSection];
    if (!section) return;

    const states = this.taskStates[this.currentTutorialSection];
    let anyChanged = false;

    section.tasks.forEach((task, i) => {
      if (states[i]) return; // Already done
      const result = this.taskChecker.check(task);
      if (result) {
        states[i] = true;
        anyChanged = true;
      }
    });

    if (anyChanged) {
      this.renderTaskPanel();
      this.applyGhostHints();

      // Check if section complete — enter enjoy phase
      if (states.every(s => s) && !this.enjoyPhase) {
        this.enjoyPhase = true;
        this.enjoyBarsPlayed = 0;
        this.enjoyLastBar = -1;
        this.renderEnjoyPanel();
      }
    }
  }

  renderEnjoyPanel() {
    // Replace task list with "Enjoy" message and bar counter
    const updatePanel = (sectionEl, progressEl, subtitleEl, listEl) => {
      if (!sectionEl) return;
      sectionEl.textContent = 'ENJOY';
      progressEl.textContent = `${this.enjoyBarsPlayed} / ${this.enjoyBarsTarget} bars`;
      subtitleEl.textContent = 'Listen to what you built';
      listEl.innerHTML = '';
    };

    // Desktop
    updatePanel(
      document.getElementById('task-section-name'),
      document.getElementById('task-progress'),
      document.getElementById('task-subtitle'),
      document.getElementById('task-list')
    );
    // Mobile drawer
    updatePanel(
      document.getElementById('drawer-section-name'),
      document.getElementById('drawer-progress'),
      document.getElementById('drawer-subtitle'),
      document.getElementById('drawer-task-list')
    );
  }

  updateEnjoyBar() {
    // Update the bar counter display during enjoy phase
    const update = (el) => {
      if (el) el.textContent = `${this.enjoyBarsPlayed} / ${this.enjoyBarsTarget} bars`;
    };
    update(document.getElementById('task-progress'));
    update(document.getElementById('drawer-progress'));
  }

  finishEnjoyPhase() {
    this.enjoyPhase = false;
    this.completedSections.add(this.currentTutorialSection);
    this.updateSectionButtons();
    this.showCelebration();
  }

  showCelebration() {
    const overlay = document.getElementById('celebration-overlay');
    const text = document.getElementById('celebration-text');
    const sectionIdx = SECTIONS.indexOf(this.currentTutorialSection);
    const nextSection = SECTIONS[sectionIdx + 1];

    if (nextSection) {
      text.textContent = 'SECTION COMPLETE!';
    } else {
      text.textContent = 'TRACK COMPLETE!';
    }

    overlay.classList.remove('celebration-hidden');

    setTimeout(() => {
      overlay.classList.add('celebration-hidden');
      if (nextSection) {
        this.startTutorialSection(nextSection);
      }
    }, 2000);
  }

  updateSectionButtons() {
    document.querySelectorAll('.sec-btn').forEach(btn => {
      const sec = btn.dataset.section;
      btn.classList.remove('active', 'completed', 'locked');

      if (sec === this.currentTutorialSection) {
        btn.classList.add('active');
      } else if (this.completedSections.has(sec)) {
        btn.classList.add('completed');
      } else if (this.tutorialMode) {
        // Lock sections that haven't been reached yet
        const currentIdx = SECTIONS.indexOf(this.currentTutorialSection);
        const secIdx = SECTIONS.indexOf(sec);
        if (secIdx > currentIdx && !this.completedSections.has(sec)) {
          btn.classList.add('locked');
        }
      }
    });
  }

  bindControls() {
    document.getElementById('prev-track').addEventListener('click', () => this.changeTrack(-1));
    document.getElementById('next-track').addEventListener('click', () => this.changeTrack(1));

    document.querySelectorAll('.sec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('locked')) return;
        const sec = btn.dataset.section;
        if (this.tutorialMode) {
          this.startTutorialSection(sec);
        } else {
          document.querySelectorAll('.sec-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.engine.setSection(sec);
          this.buildAllGrids();
        }
      });
    });

    document.getElementById('play-pause').addEventListener('click', () => {
      const playing = this.engine.togglePlay();
      document.getElementById('play-pause').classList.toggle('playing', playing);
    });

    // Stop painting on mouseup/touchend
    window.addEventListener('mouseup', () => { this.painting = false; });
    window.addEventListener('touchend', () => { this.painting = false; });

    // Mobile drawer toggle
    const drawerHandle = document.getElementById('drawer-handle');
    if (drawerHandle) {
      drawerHandle.addEventListener('click', () => {
        const drawer = document.getElementById('task-drawer');
        drawer.classList.toggle('drawer-hidden');
        drawer.classList.toggle('drawer-open');
      });
    }

    document.addEventListener('keydown', e => {
      if (e.key === ' ') { e.preventDefault(); document.getElementById('play-pause').click(); }
      if (e.key >= '1' && e.key <= '5') {
        const btn = document.querySelectorAll('.sec-btn')[e.key-1];
        if (btn && !btn.classList.contains('locked')) btn.click();
      }
      if (e.key === 'ArrowLeft') this.changeTrack(-1);
      if (e.key === 'ArrowRight') this.changeTrack(1);
    });

    ['bass','drums','synth','lead'].forEach(layer => {
      this.engine.noteCallbacks[layer] = () => {
        const panel = document.querySelector(`.panel[data-layer="${layer}"]`);
        panel.classList.add('hit');
        setTimeout(() => panel.classList.remove('hit'), 80);
      };
    });
  }

  changeTrack(dir) {
    let idx = this.engine.currentTrackIdx + dir;
    if (idx < 0) idx = TRACKS.length - 1;
    if (idx >= TRACKS.length) idx = 0;

    // Exit tutorial mode if changing away from D&B
    if (idx !== DNB_TRACK_INDEX) {
      this.tutorialMode = false;
      document.getElementById('task-panel').style.display = 'none';
      document.getElementById('task-drawer').style.display = 'none';
    } else {
      this.tutorialMode = true;
      document.getElementById('task-panel').style.display = '';
      document.getElementById('task-drawer').style.display = '';
    }

    this.engine.loadTrack(idx);
    this.updateTrackDisplay();
    this.buildAllGrids();
    this.updateSectionButtons();

    // Re-apply slider values
    Object.entries(this.sliders).forEach(([param, slider]) => {
      if (param.endsWith('-vol')) {
        this.engine.setVolume(param.split('-')[0], slider.value);
      } else {
        this.engine.setParam(param, slider.value);
      }
    });

    if (this.tutorialMode) {
      this.startTutorialSection(this.currentTutorialSection);
    }
  }

  updateTrackDisplay() {
    const track = TRACKS[this.engine.currentTrackIdx];
    document.getElementById('track-name').textContent = track.name;
    document.getElementById('bpm-display').textContent = track.bpm + ' BPM';
  }

  startUILoop() {
    const update = () => {
      if (this.engine.isPlaying) {
        const pos = Tone.Transport.position;
        const parts = pos.split(':').map(Number);
        const step = (parts[1] * 4 + Math.floor(parts[2])) % 16;
        const bar = parts[0];

        if (step !== this.lastStep) {
          this.lastStep = step;
          document.querySelectorAll('.grid-cell.current').forEach(c => c.classList.remove('current'));
          document.querySelectorAll(`.grid-cell[data-col="${step}"]`).forEach(c => c.classList.add('current'));
        }

        // Track bars during enjoy phase
        if (this.enjoyPhase) {
          if (this.enjoyLastBar === -1) {
            // First tick — record starting bar
            this.enjoyLastBar = bar;
          } else if (bar !== this.enjoyLastBar) {
            this.enjoyLastBar = bar;
            this.enjoyBarsPlayed++;
            this.updateEnjoyBar();

            if (this.enjoyBarsPlayed >= this.enjoyBarsTarget) {
              this.finishEnjoyPhase();
            }
          }
        }
      }
      requestAnimationFrame(update);
    };
    update();
  }
}


// ===== INIT =====
let app;
document.getElementById('start-btn').addEventListener('click', async () => {
  if (!app) {
    app = new BeatLabApp();
    try {
      await app.start();
    } catch(e) {
      console.error('Beat Lab start error:', e);
      const msg = document.createElement('div');
      msg.style.cssText = 'position:fixed;inset:0;background:#111;color:#f44;padding:40px;font:16px monospace;z-index:9999;white-space:pre-wrap;';
      const debug = app.engine ? '\n\nDebug: ' + app.engine._debugInfo : '\n\nNo engine created';
      msg.textContent = 'Error starting Beat Lab:\n\n' + (e.stack || e) + debug;
      document.body.appendChild(msg);
    }
  }
});
