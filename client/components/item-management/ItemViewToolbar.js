import React from 'react';
import RadioBar from '../RadioBar';
import ToggleSelecting from './ToggleSelecting';
import Icon from '../Icon';

const ItemViewToolbar = ({
  isSelecting, onToggleSelecting,
  onSetFilter,
  viewMode, onSetViewMode,
}) => (
  <div className="item-view-toolbar container">
    <ToggleSelecting
      active={isSelecting}
      onClick={onToggleSelecting}
    />

    <input
      className="input-slim item-filter"
      type="text"
      onChange={e => onSetFilter(e.target.value)}
      placeholder="filter by name..."
    />

    <RadioBar
      value={viewMode}
      options={[
        {value: 'grid', label: <Icon slug="th" alt="Grid"/>},
        {value: 'list', label: <Icon slug="list" alt="List" />}
      ]}
      onChange={o => onSetViewMode(o.value)}
    />
  </div>
);

export default ItemViewToolbar;
