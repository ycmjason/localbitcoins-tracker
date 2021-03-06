// Config
const BUY_IN_RATE = 1883.33; // GBP/BTC
const AMOUNT = 50;  // GBP
//
//
//
const NUMBER_OF_ROWS = process.argv[2] || 10;
const OUTPUT = process.argv[3] || ["json", "table", "log"][1];
const ONLINE_PROVIDER = ['NATIONAL_BANK', 'PAYPAL', 'GIFT_CARD_CODE_AMAZON', 'CASH_BY_MAIL', 'CASH_DEPOSIT'][0];

var fetch = require('node-fetch');
var _uniqWith = require('lodash.uniqwith');
var _isEqual = require('lodash.isequal');
var Table = require('cli-table');
var colors = require('colors');

const roundTo = (x, p) => {
  var factor = Math.pow(10, p)
  return Math.round(x * factor) / factor
}

const roundBTC = (x) => roundTo(x, 8);

var btc_amount = roundBTC(AMOUNT / BUY_IN_RATE);

var promise = fetch('https://localbitcoins.com/sell-bitcoins-online/GBP/.json')
  .then(res => res.json())
  .then(res => res.data)
  .then(data => data.ad_list.map(ad => ad.data))
  .then(sales => sales.filter(sale => sale.online_provider === ONLINE_PROVIDER))
  .then(sales => _uniqWith(sales.map(_parseSale), _isEqual))
  .then(analyseSales)
  .then(sales => sales.slice(0, NUMBER_OF_ROWS))
  .then(sales => sales.map((sale, i) => Object.assign({id: i + 1}, sale)))
  .then((sales) => {
    var show;
    switch(OUTPUT){
      case "json":
        show = showJson;
        break;
      case "log":
      case "logs":
        show = showLog;
        break;
      case "table":
      default:
        show = showTable;
        break;
    }
    show(sales);
  });

function analyseSales(sales){
  return sales.map(sale => {
    var gross = sale.price * btc_amount;
    return Object.assign(sale, {
      gross: roundBTC(sale.price * btc_amount),
      net: roundBTC(gross - AMOUNT),
    });
  });
}

function showTable(sales){
  var table = new Table({
    head: ['#', 'Name', 'Price (GBP/BTC)', 'How much you get (GBP)', 'How much you earn (GBP)'],
    style: {head: ['bold']}
  });
  sales.forEach((sale) => {
    var color = (x) => colors[(sale.net > 0)? 'green': 'red'](x);
    table.push([
      sale.id,
      sale.seller,
      sale.price,
      sale.gross,
      sale.net
    ].map(color));
  });
  console.log(table.toString());
}

function showJson(sales){
  console.log(JSON.stringify(sales, null, 4));
}

function showLog(sales){
  sales.forEach((sale) =>{
    console.log([
      sale.id,
      sale.timestamp.toJSON(),
      `'${sale.seller}'`,
      sale.price,
      sale.gross,
      sale.net
    ].join(':'));
  });
}

function _parseSale(sale){
  return {
    timestamp: new Date(),
    seller: sale.profile.name,
    price: sale.temp_price,
  };
}
