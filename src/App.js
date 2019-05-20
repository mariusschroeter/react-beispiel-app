import React, { Component } from 'react';
import Modal from "react-modal"
import './styles/App.css';
import "normalize.css/normalize.css"

class App extends Component {
  constructor(props) {
    super(props)
    this.handleRemoveAll = this.handleRemoveAll.bind(this)
    this.handlePick = this.handlePick.bind(this)
    this.handleAddOption = this.handleAddOption.bind(this)
    this.handleRemoveOne = this.handleRemoveOne.bind(this)
    this.handleModal = this.handleModal.bind(this)
    this.state = {
      options: props.options,
      selectedOption: undefined
    }
  }

  componentDidMount() {
    try {
      const data = JSON.parse(localStorage.getItem("data"));
      if (data) {
        this.setState(() => ({ options: data }))
      }
    } catch (e) {

    }
  }

  componentDidUpdate(prevP, prevS) {
    if (prevS.options.length !== this.state.options.length) {
      const data = JSON.stringify(this.state.options)
      localStorage.setItem("data", data)
    }
  }

  handleRemoveOne(optionText) {
    this.setState((prev) => ({
      options: prev.options.filter((el) => el !== optionText)
    }))
  }

  handleRemoveAll() {
    this.setState(() => ({ options: [] }))
  }

  handlePick() {
    const random = (Math.random() * (this.state.options.length - 1)).toFixed()
    this.setState(() => ({ selectedOption: this.state.options[random] }))
  }

  handleAddOption(optionText) {
    if (!optionText) {
      return "Enter a valid option!"
    } else if (this.state.options.indexOf(optionText) > -1) {
      return "This option already exists!"
    }

    this.setState(() => ({ options: [...this.state.options, optionText] }))
  }

  handleModal() {
    this.setState(() => ({ selectedOption: undefined }))
  }

  render() {
    const subtitle = "Put your life in the Hands of a computer"

    return (
      <div className="App">
        <Header subtitle={subtitle} />
        <div className="container">
          <Action hasOptions={this.state.options.length > 1} handlePick={this.handlePick} />
          <div className="widget">
            <Options options={this.state.options} handleRemoveAll={this.handleRemoveAll} handleRemoveOne={this.handleRemoveOne} />
            <AddOption handleAddOption={this.handleAddOption} />
          </div>
        </div>
        <OptionModal selectedOption={this.state.selectedOption} handleModal={this.handleModal} />
      </div>
    );
  }
}

App.defaultProps = {
  options: []
}

const Header = (props) => (
  <div className="header">
    <div className="container">
      <h1 className="header__title">{props.title}</h1>
      {props.subtitle && <h2 className="header__subtitle">{props.subtitle}</h2>}
    </div>
  </div>
)


Header.defaultProps = {
  title: "Indecision"
}

const Action = (props) => (
  <React.Fragment>
    <button className="button--big" onClick={props.handlePick} disabled={!props.hasOptions}>
      What should I do?
        </button>
  </React.Fragment>
)

const Options = (props) => (
  <div>
    <div className="widget-header">
      <h3 className="widget-header__title">Your Options</h3>
      <button className="button button--link" onClick={props.handleRemoveAll}>Delete All</button>
    </div>
    {props.options.length < 2 && <p className="widget__message">Add two Options to start!</p>}
    {
      props.options.map((el, i) => (
        <Option
          key={i}
          optionText={el}
          count={i + 1}
          handleRemoveOne={props.handleRemoveOne}
        />
      ))
    }
  </div>
)

const Option = (props) => (
  <div className="option">
    <p className="option__text">{props.count}. {props.optionText}</p>
    <button
      className="button button--link"
      onClick={(e) => {
        props.handleRemoveOne(props.optionText)
      }
      }
    >
      Remove
    </button>
  </div>
)

class AddOption extends Component {
  constructor(props) {
    super(props)
    this.handleAddOption = this.handleAddOption.bind(this)
    this.state = {
      error: undefined
    }
  }

  handleAddOption(e) {
    e.preventDefault()

    const optionText = e.target.elements.option.value.trim()
    const error = this.props.handleAddOption(optionText)

    this.setState(() => ({ error }))

    if (!error) e.target.elements.option.value = ""
  }

  render() {
    return (
      <div>
        {this.state.error && <p className="add-option-error">{this.state.error}</p>}
        <form className="add-option" onSubmit={this.handleAddOption}>
          <input className="add-option__input" type="text" name="option"></input>
          <button className="button" type="submit">Add Option</button>
        </form>
      </div>
    )
  }
}

const OptionModal = (props) => (
  <Modal
    isOpen={!!props.selectedOption}
    onRequestClose={props.handleModal}
    contentLabel="Selected Option"
    closeTimeoutMS={200}
    className="modal"
  >
    <h3 className="modal__title">Selected Option</h3>
    {props.selectedOption && <p className="modal__body">{props.selectedOption}</p>}
    <button className="button" onClick={props.handleModal}>Okay</button>
  </Modal>
)


export default App;
