import React from 'react';
import Spinner from '../Spinner';

class FlexibleItemView extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);

  }

  handleMouseDown(e, id) {
    let { isSelecting, selectedItems, onSelect } = this.props;

    if(!isSelecting || !onSelect || e.button > 0) return;

    let newSelected = selectedItems.filter(thisId => thisId != id);
    // if nothing was removed, add instead
    if(selectedItems.length == newSelected.length)
      newSelected.push(id);

    onSelect(newSelected, e);
  }

  handleClick(e, id) {
    let { onOpen, isSelecting } = this.props;

    if(isSelecting)
      e.preventDefault(); // prevent links from being followed
    else if(onOpen)
      onOpen(id, e);
  }

  handlePress(e, id) {
    let { onSelect, isSelecting } = this.props;

    if(!onSelect || isSelecting) return;

    onSelect([id], e);
  }

  filterAndSortItems(items) {
    let {
      sortBy,
      sortDesc,
      filter,
      itemComponent: ItemComp,
      getItemProp,
    } = this.props;

    // NOTE: ItemComp should have properties filterableProps (and sortableProps?)
    // to indicate how it can be sorted/filtered

    // case insensitive filters
    filter = filter.toLowerCase();

    // do filtering
    let filteredItems = items.filter(item => {
      for(let prop of ItemComp.filterableProps)
        if(getItemProp(item, prop).toLowerCase().includes(filter))
          return true;

      return false;
    });

    // do sorting
    let sortedItems = filteredItems.sort((a, b) => {
      a = getItemProp(a, sortBy), b = getItemProp(b, sortBy);
      if(typeof a == 'string')
        a = a.toUpperCase(), b = b.toUpperCase();

      return a < b ? -1 : +(a != b);
    });

    if(sortDesc)
      sortedItems.reverse();

    return sortedItems;
  }

  getPlaceholder = () => {
    let {isLoading, filter, placeholder} = this.props;
    if(isLoading) return <Spinner />;
    if(filter) return 'No matches';
    return placeholder;
  }

  render() {
    let {
      items,
      itemComponent: ItemComp,
      onItemClick,
      selectedItems,
      placeholder = 'Nothing to show',
      isLoading,
    } = this.props;

    items = this.filterAndSortItems(items);

    return (
      <div className="flexible-item-view">
        { items.length ? items.map(item => (
          <ItemComp
            key={item.id}
            isSelected={selectedItems.includes(item.id)}
            onMouseDown={(e) => this.handleMouseDown(e, item.id)}
            onClick={(e) => this.handleClick(e, item.id)}
            onPress={(e) => this.handlePress(e, item.id)}
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
  getItemProp: (item, prop) => item[prop]
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
