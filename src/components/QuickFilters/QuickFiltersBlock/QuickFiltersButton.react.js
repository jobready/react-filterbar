export class QuickFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      label: this.props.filters.label,
      filters: this.props.filters.filters,
      blockName: this.props.blockName,
      quickFilterButton: this.props.filters
    };
  }

  onClick(e) {
    Object.keys(this.state.filters).map(function(filter) {
      var value = this.state.filters[filter].value;
      var filterName = this.state.filters[filter].filter;
      this.context.filterBarActor.applyQuickFilter(filterName, value, this.state.name, this.state.blockName);
    }, this);
  }

  render() {
    var klasses = 'btn btn-primary btn-xs quick-filters-button';
    if(this.state.quickFilterButton.active === true)
      klasses += ' btn-warning';

    return (
      <button className={klasses}  type="button"  onClick={this.onClick.bind(this)}>
        {this.state.label}
      </button>
    );
  }
}

QuickFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};
