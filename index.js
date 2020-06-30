const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/cool', (req, res) => res.send(cool()))
  .get('/postal', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/postalForm.html'));
  })
  .get('/getForm', function(req, res) {
    var requestUrl = url.parse(req.url, true);

    console.log("Query parameters: " + JSON.stringify(requestUrl.query));
  
    var weight = Number(requestUrl.query.weight);
    var type = requestUrl.query.type;

    calculateRate(response, type, weight);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function getRate(response, type, weight)
  {
    var result = 0;

    if (type == "stamped") {
      if(weight <= 1){
        result = "0.55";
      }else if(weight <= 2){
        result = "0.70";
      }else if(weight <= 3){
        result = "0.85";
      }else{
        result = "1.00";
      }
    }
    else if (type == "metered") {
      if(weight <= 1){
        result = "0.50";
      }else if(weight <= 2){
        result = "0.65";
      }else if(weight <= 3){
        result = "0.80";
      }else{
        result = "0.95";
      }
    }
    else if (type == "flat") {
      if(weight <= 1){
        result = "1.00";
      }else if(weight <= 2){
        result = "1.20";
      }else if(weight <= 3){
        result = "1.40";
      }else if(weight <= 4){
        result = "1.60";
      }else if(weight <= 5){
        result = "1.80";
      }else if(weight <= 6){
        result = "2.00";
      }else if(weight <= 7){
        result = "2.20";
      }else if(weight <= 8){
        result = "2.40";
      }else if(weight <= 9){
        result = "2.60";
      }else if(weight <= 10){
        result = "2.80";
      }else if(weight <= 11){
        result = "3.00";
      }else if(weight <= 12){
        result = "3.20";
      }else{
        result = "3.40";
      }
    }
    else if (type == "retail"){
      if(weight <= 4){
        result = "3.80";
      }else if(weight > 4 && weight <= 8){
        result = "4.60";
      }else if(weight > 8 && weight <= 12){
        result = "5.30";
      }else{
        result = "5.90";
      }
    }

    if(type == "stamped"){
      type = "Letter (stamped)";
    }else if(type == "metered"){
      type = "Letter (metered)";
    }else if(type == "flat"){
      type = "Large Envelope";
    }else if(type == "retail"){
      type = "Retail";
  
    var params = {type: type, weight: weight, result: result};
  
    response.render('pages/getRate', params);
  }
}