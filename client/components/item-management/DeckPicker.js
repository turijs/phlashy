import React from 'react';
import Select from 'react-select';

function DeckPicker({decks, picked, onPick, className}) {

  let options = decks.map(deck => ({
    value: deck.id,
    label: `${deck.name} (${deck.cards.length})`
  }));

  return (
    <div className={`deck-picker ${className}`}>
      <Select
        options={options}
        multi
        value={picked}
        onChange={(opts) => onPick( opts.map(o => o.value) ) }
      />
    </div>
  );
}

export default DeckPicker;
