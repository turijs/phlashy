import React from 'react';
import Select from 'react-select';
import RadioBar from '../RadioBar';
import A from '../A';
import Icon from '../Icon';

const ItemSorter = ({
  viewMode,
  sortBy, sortDesc, onSetSort,
  Item,
}) => (
  <div className="item-sort">
    {viewMode == 'grid' ? (
      <div className="grid-sort">
        <Select
          value={sortBy}
          options={Item.publicProps}
          onChange={o => onSetSort(o.value, sortDesc)}
          clearable={false}
        />
        <RadioBar
          value={sortDesc ? 'DESC' : 'ASC'}
          options={[
            {value: 'ASC', label: '↑'},
            {value: 'DESC', label: '↓'}
          ]}
          onChange={o => onSetSort(sortBy, o.value == 'DESC')}
        />
      </div>
    ) : (
      <div className="item-col-headers">
        {Item.publicProps.map(opt => {
          let active = opt.value == sortBy;
          return (
            <div
              key={opt.value}
              className={`item-col-header ${Item.prefix}-${opt.value} ${active ? ' active' : ''}`}
            >
              <A onClick={() => onSetSort(opt.value, active ? !sortDesc : false)} >
                <div className="item-col-header-inner">{opt.label}</div>
                {active &&
                  <Icon sm slug={'chevron-'+(sortDesc ? 'down' : 'up')} />}
              </A>
            </div>
          )
        })}
      </div>
    )}
  </div>
);

export default ItemSorter;
