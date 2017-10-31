import React from 'react';
import Select from 'react-select';
import RadioBar from '../RadioBar';
import A from '../A';
import Icon from '../Icon';
import Check from '../Check';

const ItemSorter = ({
  viewMode,
  sortBy, sortDesc, onSetSort,
  allSelected, onSelectAll, onSelectNone,
  itemMeta,
}) => {
  let toggleAll = allSelected ? onSelectNone : onSelectAll;
  return (
  <div className="item-headers">
    {viewMode == 'grid' ? [
      <div className="select-all-none" key="0">
        <Check title="Select all/none" on={allSelected} onClick={toggleAll} />
      </div>,
      <div className="grid-sort" key="1">
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
    ] : [
        <div className="select-all-none item-col-header" key="0">
          <Check title="Select all/none" on={allSelected} inline={false} onClick={toggleAll} />
        </div>,
        itemMeta.sortableProps.map(prop => {
          let active = prop == sortBy;
          return (
            <div
              key={prop}
              className={`item-col-header ${itemMeta.slug}-${prop} ${active ? ' active' : ''}`}
            >
              <A onClick={() => onSetSort(prop, active ? !sortDesc : false)} >
                <div className="item-col-header-inner">{itemMeta.labels[prop]}</div>
                {active &&
                  <Icon sm slug={'chevron-'+(sortDesc ? 'down' : 'up')} className="chevron" />}
              </A>
            </div>
          )
        })

    ]}
  </div>)
};

export default ItemSorter;
