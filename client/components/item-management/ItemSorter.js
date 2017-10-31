import React from 'react';
import Select from 'react-select';
import RadioBar from '../RadioBar';
import A from '../A';
import Icon from '../Icon';

const ItemSorter = ({
  viewMode,
  sortBy, sortDesc, onSetSort,
  itemMeta,
}) => (
  <div className="item-sort">
    {viewMode == 'grid' ? (
      <div className="grid-sort">
        <Select
          value={sortBy}
          options={itemMeta.sortableProps.map(prop => ({
            value: prop,
            label: itemMeta.labels[prop]
          }))}
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
        <div className={`${itemMeta.slug}-select`} style={{width: 40}}></div>
        {itemMeta.sortableProps.map(prop => {
          let active = prop == sortBy;
          return (
            <div
              key={prop}
              className={`item-col-header ${itemMeta.slug}-${prop} ${active ? ' active' : ''}`}
            >
              <A onClick={() => onSetSort(prop, active ? !sortDesc : false)} >
                <div className="item-col-header-inner">{itemMeta.labels[prop]}</div>
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
