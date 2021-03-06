import {DateInput} from "./DateInput.react";

export class RelativeDateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value || { from: null, to: null, value: null } };
    this.setDisplayDates(this.props.value['value']);
  }

  // If relative option selected, set dates for the datepickers to display
  setDisplayDates(relativeDateSelection) {
    if(!this.relativeValueSelected(relativeDateSelection) || relativeDateSelection == 'None') {
      return;
    }

    var selected            = this.props.relativeOptions[relativeDateSelection];
    this.state.displayFrom  = selected.from && selected.from.format(this.props.dateFormat);
    this.state.displayTo    = selected.to   && selected.to.format(this.props.dateFormat);
  }

  onRelativeChange(event) {
    var selectedOption = $(event.target.childNodes[event.target.selectedIndex]);
    var newValue = { value: selectedOption.val() };
    this.state = { value: newValue }
    this.updateFilter(newValue);
  }

  onDatePickerChange(event) {
    var newValue = {
      from: this.state.value.from || this.state.displayFrom,
      to: this.state.value.to || this.state.displayTo
    };

    if(event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
    }

    this.setState({value: newValue});
  }

  relativeValueSelected(selection) {
    if(selection === undefined) {
      selection = this.state.value.value;
    }

    return selection !== undefined && selection !== null && selection != '';
  }

  updateFilter(newValue) {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
  }

  relativeOption(optionKey) {
    var optionItem = this.props.relativeOptions[optionKey];
    return <option
      key={optionKey}
      value={optionItem.value !== undefined ? optionItem.value : optionKey}
      data-from={optionItem.from} data-to={optionItem.to}>
      {optionKey}
    </option>
  }

  render() {
    return (
      <div>
        <select
          className="form-control"
          onChange={this.onRelativeChange.bind(this)}
          value={this.state.value.value}
          ref="relativeSelect"
        >
          {Object.keys(this.props.relativeOptions).map((optionKey) => (
            this.relativeOption(optionKey)
          ))}
        </select>
        <DateInput value={this.state.value} filterUid={this.props.filterUid} displayFrom={this.state.displayFrom} displayTo={this.state.displayTo} onDateChangeCustom={this.onDatePickerChange} disabled={this.relativeValueSelected()}/>
      </div>
    )
  }
}

RelativeDateInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

RelativeDateInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

RelativeDateInput.defaultProps = {
  dateFormat: 'DD/MM/YYYY',
  relativeOptions: relativeOptions()
}

function relativeOptions() {
    var lastWeek = moment().subtract(1, 'week');

    return {
      'Custom Period':                { value: '', from: null, to: null },
      'None':                         {},
      'Today':                        { from: moment(), to: moment() },
      'Last Week':                    { from: lastWeek.clone().startOf('isoWeek'), to: lastWeek.clone().endOf('isoWeek') },
      'This Week':                    { from: moment().startOf('isoWeek'), to: moment().endOf('isoWeek') },
      'Older than 7 days':            { from: null, to: moment().subtract(8, 'day') },
      'Older than 14 days':           { from: null, to: moment().subtract(15, 'day') },
      'Older than 20 days':           { from: null, to: moment().subtract(21, 'day') },
      'Older than 30 days':           { from: null, to: moment().subtract(31, 'day') },
      'Older than 42 days (6 weeks)': { from: null, to: moment().subtract(43, 'day') },
    }
}
