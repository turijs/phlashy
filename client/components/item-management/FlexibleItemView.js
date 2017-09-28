import React from 'react';

class FlexibleItemView extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);

  }

  handleMouseDown(e, id) {
    let { isSelecting, selectedItems, onSelect } = this.props;

    if(!isSelecting || !onSelect) return;

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
      sortBy = 'created',
      sortDesc = false,
      filter = '',
      itemComponent: ItemComp
    } = this.props;

    // NOTE: ItemComp should have properties filterableProps (and sortableProps?)
    // to indicate how it can be sorted/filtered

    // case insensitive filters
    filter = filter.toLowerCase();

    // do filtering
    let filteredItems = items.filter(item => {
      for(let prop of ItemComp.filterableProps)
        if(item[prop].toLowerCase().includes(filter))
          return true;

      return false;
    });

    // do sorting
    let sortedItems = filteredItems.sort((a, b) => {
      a = a[sortBy], b = b[sortBy];
      if(typeof a == 'string')
        a = a.toLowerCase(), b = b.toLowerCase();

      return a < b ? -1 : +(a != b);
    });

    if(sortDesc)
      sortedItems.reverse();

    return sortedItems;
  }

  render() {
    let {items, itemComponent: ItemComp, onItemClick, selectedItems} = this.props;

    items = this.filterAndSortItems(items);
    // let mapSelected = arrayToMap(selectedItems);

    return (
      <div className="flexible-item-view">
        { items.map(item => (
          <ItemComp
            key={item.id}
            isSelected={selectedItems.includes(item.id)}
            onMouseDown={(e) => this.handleMouseDown(e, item.id)}
            onClick={(e, isPress) => this.handleClick(e, item.id, isPress)}
            onPress={(e) => this.handlePress(e, item.id)}
            {...item}
          />
        )) }
      </div>
    );
  }
}

//props:
// itemComponent,
// items[],
// selectedItems,
// flippedItems
// onSelect
// onOpen
// sort
// sortDesc
// filter
// isSelecting
//

export default FlexibleItemView;
