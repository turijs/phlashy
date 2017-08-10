import React from 'react';

class FlexibleItemView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {items, sortable, itemComponent: ItemComp} = this.props;
    return (
      <div className="flexible-item-view">
        { items.map(item => {
          // let {id, ...rest} = item;
          return <ItemComp key={item.id} {...item} />
        }) }
      </div>
    );
  }
}

//props:
// itemComponent,
// items[],
// itemsState[],
// onItemClick
//

export default FlexibleItemView;
