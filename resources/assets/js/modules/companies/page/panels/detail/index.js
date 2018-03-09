import React from 'react';
import PropTypes from 'prop-types';
import * as MDIcons from 'react-icons/lib/md'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Opportunities from '../../../../opportunities/partials/_opportunities'
import Contacts from '../../../../contacts/partials/_contacts'
import Notes from '../../../../notes/partials/_notes'
import Company from '../../../Company'
import {getCompany, getFirstCompanyId} from '../../../store/selectors'

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: "default"
    }

    this._toggleView = this._toggleView.bind(this)

  }

  _toggleView(view) {
    this.setState({view: view})
  }

  render() {
    const {dispatch, company, user} = this.props

    switch(this.state.view){
      case 'default':
        return <Details company={company} dispatch={dispatch} toggle={this._toggleView} user={user} />
      case 'history':
        return <History activities={company.activities} dispatch={dispatch}  toggle={this._toggleView} />
    }
  }
}

const Details = ({company, dispatch, toggle, user}) => (
  <div key={1} className="col detail-panel border-left">
    <div className="border-bottom text-center py-2 heading">
      <h5>Company Details
        <div className="dropdown d-inline-block ml-2 pt-2">
          <div className="text-muted dropdown-toggle" id="detailViewToggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu dropdown-menu-right" aria-labelledby="detailViewToggle">
            <div className="dropdown-item disabled">Details</div>
            <div className="dropdown-item" onClick={() => toggle('history')} >History</div>
          </div>
        </div>
      </h5>
    </div>
    <div className="h-scroll">
      <div className="card">
        <div className="card-header" id="headingSRI">
          <h6 className="mb-0" data-toggle="collapse" data-target="#collapseSRI" aria-expanded="true" aria-controls="collapseSRI">
            <MDIcons.MdKeyboardArrowDown /> Readiness Indicator
          </h6>
        </div>

        <div id="collapseSRI" className="collapse show" aria-labelledby="headingSRI">
          <div className="card-body border-bottom">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </div>
      </div>

      <Contacts contacts={company.contacts} dispatch={dispatch} />
      <Opportunities opportunities={company.opportunities} dispatch={dispatch} />
      <Notes notes={company.notes} dispatch={dispatch} entityId={company.id} entityType="App\Company" user={user} />

    </div>
  </div>
)

const History = ({activities, dispatch, toggle}) => (
  <div key={1} className="col detail-panel border-left">
    <div className="border-bottom text-center py-2 heading">
      <h5>History
        <div className="dropdown d-inline-block ml-2 pt-2">
          <div className="text-muted dropdown-toggle" id="detailViewToggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu dropdown-menu-right" aria-labelledby="detailViewToggle">
            <div className="h5 dropdown-item" onClick={() => toggle('default')}>Details</div>
            <div className="h5 dropdown-item disabled">History</div>
          </div>
        </div>
      </h5>
    </div>
  </div>
)

Detail.propTypes = {
  company: PropTypes.instanceOf(Company).isRequired,
  user: PropTypes.object.isRequired
}

export default withRouter(connect((state, ownProps) => ({
  company: getCompany(state, ownProps.match.params.id || getFirstCompanyId(state)),
  user: state.user
}))(Detail))