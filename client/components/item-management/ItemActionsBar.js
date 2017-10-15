import React from 'react';
import A from '../A';
import Icon from '../Icon';
import Popup from '../Popup';

// wrapper is necessary for css positioning
const ItemActionsBar = ({actions, numPrimary}) => {
  let primary = actions.slice(0, numPrimary);
  let additional = actions.slice(numPrimary);

  return (
      <div className="actions-bar">
        {primary.map(action => (
          <A
            key={action.label}
            title={action.label}
            onClick={action.call}
            disabled={action.disabled}
          >
            <Icon slug={action.icon}/>
          </A>
        ))}
        {additional &&
          <Popup label={<Icon slug="ellipsis-h"/>} title="More actions...">
            {additional.map(action => (
              <A
                key={action.label}
                onClick={action.call}
                disabled={action.disabled}
              >
                <Icon fw slug={action.icon} />
                {action.label}
              </A>
            ))}
          </Popup>}
      </div>
  );
};

/*
primary [
  {icon: 'plus', label: 'Add Deck', disabled: false, call: function(){} }
]

other [
  {label: 'Merge Decks', disabled: false, call: function(){} }
]
*/


export default ItemActionsBar;
