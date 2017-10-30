import React from 'react';
import Spinner from '../Spinner';

class FlexibleItemView extends React.Component {
  
  handleMouseDown(e, item) {
    let { isSelecting, onSelect, onDeselect } = this.props;

    if(!isSelecting || !onSelect || e.button > 0) return;

    item.selected ? onDeselect(item.id, e) : onSelect(item.id, e);
  }

  handleClick(e, item) {
    let { onOpen, isSelecting } = this.props;

    if(isSelecting)
      e.preventDefault(); // prevent links from being followed
    else if(onOpen)
      onOpen(item.id, e);
  }

  handlePress(e, item) {
    let { onSelect, isSelecting } = this.props;

    if(!onSelect || isSelecting) return;

    onSelect(item.id, e);
  }

  getPlaceholder = () => {
    let {isLoading, filter, placeholder} = this.props;
    if(isLoading) return <Spinner />;
    if(filter) return 'No matches';
    return placeholder;
  }

  render() {
    let { items, itemComponent: ItemComp, } = this.props;

    return (
      <div className="flexible-item-view" data-deselect>
        { items.length ? items.map(item => (
          <ItemComp
            key={item.id}
            onMouseDown={e => this.handleMouseDown(e, item)}
            onClick={e => this.handleClick(e, item)}
            onPress={e => this.handlePress(e, item)}
            {...item}
          />
        )) : (
          <div className="placeholder">
            {this.getPlaceholder()}
          </div>
        ) }
      </div>
    );
  }
}

FlexibleItemView.defaultProps = {
  filter: '',
  placeholder: 'Nothing to show',
  sortBy: 'created',
  sortDesc: false,
  isLoading: false,
  isSelecting: false,
}

//props:
// itemComponent,
// items[],
// getItemProp
// selectedItems,
// flippedItems
// onSelect
// onOpen
// sortBy
// sortDesc
// filter
// isSelecting
//

export default FlexibleItemView;
