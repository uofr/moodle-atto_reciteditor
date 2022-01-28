import React, { Component } from 'react'
import { createPortal } from 'react-dom'

export class IFrame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mountNode: null
    }
    this.setContentRef = (e) => {
      this.setState({mountNode: e.target.contentDocument.body})
    }
  }

  render() {
    const { children, ...props } = this.props
    const { mountNode } = this.state
    return (
      <iframe
        srcDoc={`<!DOCTYPE html>`}
        {...props}
        onLoad={this.setContentRef}
      >
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    )
  }
}