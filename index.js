import React from 'react'

export default class Dropzone extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isDragActive: false }

    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onDragEnter(e) {
    e.preventDefault()

    this.setState({
      isDragActive: true
    })

    if (this.props.onDragEnter) {
      this.props.onDragEnter(e)
    }
  }

  onDragOver(e) {
    e.preventDefault()
  }

  onDragLeave(e) {
    e.preventDefault()

    this.setState({
      isDragActive: false
    })

    if (this.props.onDragLeave) {
      this.props.onDragLeave(e)
    }
  }

  onDrop(e) {
    e.preventDefault()

    this.setState({
      isDragActive: false
    })

    var droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files
    var max = this.props.multiple ? droppedFiles.length : 1
    var files = []

    for (var i = 0; i < max; i++) {
      var file = droppedFiles[i]
      file.preview = URL.createObjectURL(file)
      files.push(file)
    }

    if (this.props.onDrop) {
      this.props.onDrop(files, e)
    }
  }

  onClick() {
    if (!this.props.disableClick) {
      this.open()
    }
  }

  open() {
    var fileInput = React.findDOMNode(this.refs.fileInput)
    fileInput.value = null
    fileInput.click()
  }

  render() {
    var className
    if (this.props.className) {
      className = this.props.className
      if (this.state.isDragActive) {
        className += ' ' + this.props.activeClassName
      }
    }

    var style, activeStyle
    if (this.props.style) {
      style = this.props.style
      activeStyle = this.props.activeStyle
    } else if (!className) {
      style = {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
      }
      activeStyle = {
        borderStyle: 'solid',
        backgroundColor: '#eee'
      }
    }

    var appliedStyle
    if (style && this.state.isDragActive) {
      appliedStyle = {
        ...style,
        ...activeStyle
      }
    } else {
      appliedStyle = {
        ...style
      }
    }

    return (
      <div
        className={className}
        style={appliedStyle}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <input
          type='file'
          ref='fileInput'
          style={{ display: 'none' }}
          multiple={this.props.multiple}
          onChange={this.onDrop}
        >
          {this.props.children}
        </input>
      </div>
    )
  }
}

Dropzone.defaultProps = {
  disableClick: false,
  multiple: true
}

Dropzone.propTypes = {
  onDrop: React.PropTypes.func.isRequired,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,

  style: React.PropTypes.object,
  activeStyle: React.PropTypes.object,
  className: React.PropTypes.string,
  activeClassName: React.PropTypes.string,

  disableClick: React.PropTypes.bool,
  multiple: React.PropTypes.bool
}
