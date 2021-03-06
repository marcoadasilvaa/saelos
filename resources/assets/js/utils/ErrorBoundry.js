import React from 'react'

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    })

    // @TODO: Log the error
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="col main-panel px-3 align-self-center full-panel">
          <h3 className="text-center text-muted">Whoops, something went wrong.</h3>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary
