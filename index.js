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

const NUMBER_OF_ROWS = 10 || process.argv[2];

const roundTo = (x, p) => {
  var factor = Math.pow(10, p)
  return Math.round(x * factor) / factor
}

var btc_amount = roundTo(AMOUNT / BUY_IN_RATE, 8);

var promise = fetch('https://localbitcoins.com/sell-bitcoins-online/GBP/.json')
  .then(res => res.json())
  .then(res => res.data)
  .then(data => _uniqWith(data.ad_list.map(ad => ad.data).map(_parseSale), _isEqual))
  .then(show);

function show(sales){
  var table = new Table({
    head: ['Name', 'Price (GBP/BTC)', 'How much you get (GBP)', 'How much you earn (GBP)'],
    style: {head: ['bold']}
  });
  sales = sales.slice(0, NUMBER_OF_ROWS);
  sales.map(sale => {
    var gbp_get = sale.price * btc_amount;
    var gbp_earn = gbp_get - AMOUNT;
    gbp_earn = colors[(gbp_earn > 0)? 'green': 'red'](gbp_earn);
    table.push([sale.seller, sale.price, gbp_get, gbp_earn]);
  });
  console.log(table.toString());
}

function _parseSale(sale){
  return {
    seller: sale.profile.name,
    price: sale.temp_price,
  };
}
