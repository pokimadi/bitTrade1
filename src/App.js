import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { accoutTrade } from './actions/account-actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      price: 0,  // Updated To bit coin Trade price on Mount.
      amountUsd: "", //This Will Hold The users Input in USD
      amountBtc: "0", //This Will Hold The users BTC Value of input
      valid: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.convertToBTC = this.convertToBTC.bind(this);
    this.trade = this.trade.bind(this);
  }

  /*
    handleChange is called whenever the user enter an input.
    It checks if the input is valid and if it is updates the 
    Bitcoin Value.
  */
  handleChange(event) {
    let value = (event.target.value)? event.target.value : "0";
    if(this.validate(value)){
      this.setState(
        { amountBtc: this.convertToBTC(value), 
          amountUsd: parseFloat(value),
          valid:true }
      );
    }
  }


  /*
    Converts USD to BTC based on the price at the time the app was initialized.
  */
  convertToBTC(value){
    return parseFloat(value / this.state.price);
  }


  /*
    Trade is triggered when the trade button is clicked
    trade checks that the current the valid state boolean to ensure input is valid.
    If Valid it resets the user input and updaters the user account.
  */
  trade(event){
    if(this.state.valid){

      let state = {
        amountUsd: "",
        amountBtc: "0",
        valid: false
      };
      this.props.accoutTrade({
          balanceUsd: this.props.account.balanceUsd - parseFloat(this.state.amountUsd),
          balanceBtc: this.props.account.balanceBtc + parseFloat(this.state.amountBtc)
      });
      this.setState(state);
      event.preventDefault();
    }

  }

  /*
    validate: Call every time user changes input.
    Checks to ensure that the input is a number between 0 and and the users account baclance.
  */
  validate(value){
      if (!isNaN(parseFloat(value)) && isFinite(value)){ //is numeric
        if (value >= 0 && value <= this.props.account.balanceUsd){
          return true;
        }
      }
    return false;
  }

  /*
    On Mount makes rest call to retreive the current trade price.
  */
  componentDidMount() {
    fetch("https://api.bitfinex.com/v1/pubticker/btcusd")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            price: result.last_price
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  render() {
    const { error, isLoaded, price } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="App">
          <form class="form">

              <div class="account-balance">
                <span class="account-balance__title">Account Balance</span>
                <span class="account-balance__val-01"> USD: {parseFloat(this.props.account.balanceUsd).toFixed(2)}</span>
                <span class="account-balance__val-01"> BTC: {parseFloat(this.props.account.balanceBtc).toFixed(8)} </span>
              </div>
              <fieldset class="fieldset">
                <legend>Trade </legend>
      
                <select class="input--select" name="input--01">
                  <option>USD</option>
                </select>
                <input input type="number" onChange={this.handleChange} value={this.state.amountUsd} 
                class="input--text is--error" name="input--02" placeholder="Enter your amount"></input>
              </fieldset>

              <fieldset class="fieldset">
                <legend>For</legend>
                
                <select class="input--select" name="input--01">
                  <option>BTC</option>
                </select>
                
              
                <input type="text" class="input--text" name="input--03" value={parseFloat(this.state.amountBtc).toFixed(8)} placeholder="Display Quote" readonly>
                </input>
              </fieldset>
              
              <button class="btn--submit" onClick={this.trade}>
                submit
              </button>

            </form>
        </div>
      );
    }
  }
}

const mapStatetoProps = state =>({
  account: state.account
});

const mapActionToProps =  {
   accoutTrade: accoutTrade
};

export default connect(mapStatetoProps, mapActionToProps) (App);
