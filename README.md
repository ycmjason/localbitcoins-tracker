# localbitcoins tracker

This is a simple script that fetches information from [LocalBitCoins](https://localbitcoins.com) specifically from this [api](https://localbitcoins.com/sell-bitcoins-online/GBP/.json) and use the data to see how much money I would earn if I sell my bitcoins to each seller.

## Installation
```bash
> git clone https://github.com/ycmjason/localbitcoins-tracker.git
> npm install
```

## How to use

### Configure
First set at what exchange rate and for how much pounds have you bought your bit coins by setting the constants `BUY_IN_RATE` and `AMOUNT` respectively.

Example:

```javascript
// Config
const BUY_IN_RATE = 1883.33; // GBP/BTC
const AMOUNT = 50;  // GBP
```

### Run
Make sure again that you have run `npm install`. Then do the following:

```bash
> npm run
┌─────────────────────────────────────┬─────────────────┬────────────────────────┬─────────────────────────┐
│ Name                                │ Price (GBP/BTC) │ How much you get (GBP) │ How much you earn (GBP) │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
│ berner888 (100+; 98%)               │ 1763.61         │ 46.8215880792          │ -3.178411920800002      │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
│ KeithAB (100+; 100%)                │ 1751.41         │ 46.497693695200006     │ -3.502306304799994      │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
│ arachnid13 (100+; 100%)             │ 1745.87         │ 46.3506137864          │ -3.6493862136000033     │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
... 10 rows in total ...
```

You can also list more rows (max 30 rows) if you want.
```bash
> npm run 30
┌─────────────────────────────────────┬─────────────────┬────────────────────────┬─────────────────────────┐
│ Name                                │ Price (GBP/BTC) │ How much you get (GBP) │ How much you earn (GBP) │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
│ berner888 (100+; 98%)               │ 1763.61         │ 46.8215880792          │ -3.178411920800002      │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
│ KeithAB (100+; 100%)                │ 1751.41         │ 46.497693695200006     │ -3.502306304799994      │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
│ arachnid13 (100+; 100%)             │ 1745.87         │ 46.3506137864          │ -3.6493862136000033     │
├─────────────────────────────────────┼─────────────────┼────────────────────────┼─────────────────────────┤
... 30 rows in total ...
```

It might be useful tho if there is JSON format output for further analysis.
```bash
> npm run 10 json
[
    {
        "id": 1,
        "seller": "footnote (24; 100%)",
        "price": "1800.00",
        "gross": 47.787696000000004,
        "net": -2.212303999999996
    },
    {
        "id": 2,
        "seller": "rustyspatula (100+; 100%)",
        "price": "1785.87",
        "gross": 47.4125625864,
        "net": -2.5874374136
    },
    ... 10 records in total ...
```


### Run it every hour
You can configure a cron task to make the script run every hour.
For example:

```
> crontab -e
```

Then in the editor, add a line:

```
25 * * * * node $HOME/bitcoin-tracker/index.js 10 json>> $HOME/logs/`date +'\%Y-\%b-\%d'`.log 2>&1
```

The above script would create a file every day containing all the logs of the day.

## Author
Jason Yu
