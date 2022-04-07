import React, { useState } from "react";
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import NavBar from "./Navbar";
import UserPool from "../UserPool";
import axios from "axios";

export default function Sell(props) {
  const [stock, setStock] = useState("");
  const [amount, setAmount] = useState(0);
  const [quote, setQuote] = useState("");
  const [price, setPrice] = useState(0);

  const apiEndpoint = "http://localhost:3000";

  var user = UserPool.getCurrentUser();

  const onQuote = (event) => {
    event.preventDefault();

    const min = 1;
    const max = 9999999;
    const rand = min + Math.random() * (max - min);

    const post_req = {
      userid: user.username,
      nextTransactionNum: Math.round(rand),
      StockSymbol: quote,
    };

    axios.post(apiEndpoint + "/quote", post_req).then((res) => {
      const result = res.data.data.current_price;
      setPrice(result);
    });
  };

  const onSell = (event) => {
    event.preventDefault();

    console.log(stock);
    console.log(amount);

    const min = 1;
    const max = 9999999;
    const rand = min + Math.random() * (max - min);

    const post_req = {
      userid: user.username,
      nextTransactionNum: Math.round(rand),
      StockSymbol: stock,
      amount: amount,
    };

    axios.post(apiEndpoint + "/sell", post_req).then((res) => {
      const result = res.data;
      console.log(result);

      const sell_req = {
        userid: user.username,
        nextTransactionNum: Math.round(rand),
      };

      axios.post(apiEndpoint + "/commit_sell", sell_req).then((res) => {
        const result = res.data;
        console.log(result);
      });
      window.location.reload();
    });
  };

  return (
    <div className="sell-container">
      <NavBar />
      <div className="row">
        <div className="col-8 offset-md-2">
          <h3>Get Quote Price</h3>

          <InputGroup className="mb-3">
            <FormControl
              autoComplete="off"
              id="stock"
              placeholder="Quote"
              aria-label="Quote"
              aria-describedby="basic-addon1"
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
            />
          </InputGroup>
          <Button variant="primary" onClick={onQuote}>
            Get Price
          </Button>

          {price > 0 && (
            <h3>
              Current Price for <b>{quote}</b> is ${price} per share.
            </h3>
          )}
        </div>
      </div>
      <div className="row">
        <hr />
        <div className="col-8 offset-md-2">
          <h3>Sell Stock</h3>
          <InputGroup className="mb-3">
            <FormControl
              autoComplete="off"
              id="stock"
              placeholder="Stock"
              aria-label="Stock"
              aria-describedby="basic-addon1"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              autoComplete="off"
              id="amount"
              type="numeric"
              placeholder="amount"
              aria-label="amount"
              aria-describedby="basic-addon1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </InputGroup>
          <Button variant="primary" onClick={onSell}>
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
}
