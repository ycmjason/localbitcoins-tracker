// Config
const BUY_IN_RATE = 1883.33; // GBP/BTC
const AMOUNT = 50;  // GBP
//
//
//
var fetch = require('node-fetch');
var _uniqWith = require('lodash.uniqwith');
var _isEqual = require('lodash.isequal');
var Table = require('cli-table');
var colors = require('colors');

const NUMBER_OF_ROWS = process.argv[2] || 10;
const output = process.argv[3] || "table";

const roundTo = (x, p) => {
  var factor = Math.pow(10, p)
  return Math.round(x * factor) / factor
}

var btc_amount = roundTo(AMOUNT / BUY_IN_RATE, 8);

var promise = fetch('https://localbitcoins.com/sell-bitcoins-online/GBP/.json')
  .then(res => res.json())
  .then(res => res.data)
  .then(data => data.ad_list.map(ad => ad.data))
  .then(data => _uniqWith(data.map(_parseSale), _isEqual))
  .then(analyseSales)
  .then(sales => sales.slice(0, NUMBER_OF_ROWS))
  .then(sales => sales.map((sale, i) => Object.assign({id: i + 1}, sale)))
  .then((output === "json")? showJson: showTable);

function analyseSales(sales){
  return sales.map(sale => {
    var gross = sale.price * btc_amount;
    return Object.assign(sale, {
      gross: sale.price * btc_amount,
      net: gross - AMOUNT,
    });
  });
}

function showTable(sales){
  var table = new Table({
    head: ['#', 'Name', 'Price (GBP/BTC)', 'How much you get (GBP)', 'How much you earn (GBP)'],
    style: {head: ['bold']}
  });
  sales.map((sale) => {
    var color = (x) => colors[(sale.net > 0)? 'green': 'red'](x);
    table.push([sale.id, sale.seller, sale.price, sale.gross, sale.net].map(color));
  });
  console.log(table.toString());
}

function showJson(sales){
  console.log(JSON.stringify(sales, null, 4));
}

function _parseSale(sale){
  return {
    seller: sale.profile.name,
    price: sale.temp_price,
  };
}
