import * as ModalHelper from "../../helpers/ModalHelper";

export class ConfigurationButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    $.ajax({
      url: this.context.filterBarStore.getConfigurationUrl(),
      type: "GET",
      dataType: "html",
      success: function(data) {
        ModalHelper.displayModalForData(data);
      }.bind(this)
    });
  }

  render() {
    return (
      <button className="btn btn-default" onClick={this.onClick.bind(this)}>
        <i className="icon icon-edit-outline" />
        Columns
      </button>
    );
  }
}

ConfigurationButton.contextTypes = {
  filterBarStore: React.PropTypes.object.isRequired
};
