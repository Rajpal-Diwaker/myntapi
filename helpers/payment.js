const request               =   require('request');
var   secretKey             =   process.env.PAYMENT_SECRET_KEY   || 'sk_H036mvkyXav5A43W1FSRxj67qtrsddj6';
const apiEndPoint           =   process.env.PAYMENT_ENDPOINT   || 'https://sandbox-api.everypay.gr';
secretKey                   =   Buffer.from(secretKey).toString('base64');

/*******************Add customer to Payment Provider (payment Gatway) 
 * @formData request data;
 * @cb callback
*/
 
exports.addCustomer = (formData,cb)=>{
    var options = {
        'method': 'POST',
        'url': `${apiEndPoint}/customers`,
        'headers': {
          'Authorization': `Basic ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: formData
    };
    request(options,(error, response) =>{
    if (error) return cb(error,null);
    response.body = response.body?JSON.parse(response.body):response.body;
    if (response && response.statusCode != 200) return cb(response.body.error.message,null);
    return cb(false, response.body)
    });
}
/*******************End ************************************************/


/*******************Save card to Existing Customer (payment Gatway) 
 * @token customer Token;
 * @formData request data;
 * @cb callback
*/ 
exports.saveCard = (token, formData, cb)=>{
  var options = {
      'method': 'POST',
      'url': `${apiEndPoint}/customers/${token}/cards`,
      'headers': {
        'Authorization': `Basic ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: formData
  };
  request(options,(error, response) =>{
  if (error) return cb(error,null);
  response.body = response.body?JSON.parse(response.body):response.body;
  if (response && response.statusCode != 200) return cb(response.body.error.message,null);
  return cb(false, response.body)
  });
}
/*******************End ************************************************/


/*******************Remove card to Customer (payment Gatway) 
 * @token customer Token;
 * @cardId card to Remove;
 * @cb callback
*/ 
exports.removeCard = (token, cardId, cb)=>{
  var options = {
      'method': 'DELETE',
      'url': `${apiEndPoint}/customers/${token}/cards/${cardId}`,
      'headers': {
        'Authorization': `Basic ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
  };
  request(options,(error, response) =>{
  if (error) return cb(error,null);
  response.body = response.body?JSON.parse(response.body):response.body;
  if (response && response.statusCode != 200) return cb(response.body.error.message,null);
  return cb(false, response.body)
  });
}
/*******************End ************************************************/


/*******************Get customer as well as his card List (payment Gatway) 
 * @token customer Token;
 * @cb callback;
*/ 
exports.getCustomer = (token, cb)=>{
  var options = {
      'method': 'GET',
      'url': `${apiEndPoint}/customers/${token}`,
      'headers': {
        'Authorization': `Basic ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
  };
  request(options,(error, response) =>{
  if (error) return cb(error,null);
  response.body = response.body?JSON.parse(response.body):response.body;
  if (response && response.statusCode != 200) return cb(response.body.error.message,null);
  return cb(false, response.body)
  });
}
/*******************End ************************************************/





/*******************Make a Payment to Payment Provider (payment Gatway) 
 * @formData form data;
 * @cb callback
*/
 
exports.doPayment = (formData, cb)=>{
  var options = {
    'method': 'POST',
    'url': `${apiEndPoint}/payments`,
    'headers': {
      'Authorization': `Basic ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: formData
  };
  request(options,(error, response) =>{
  if (error) return cb(error,null);
  response.body = response.body?JSON.parse(response.body):response.body;
  if (response && response.statusCode != 200) return cb(response.body.error.message,null);
  return cb(false, response.body)
  });
}
/*******************End ************************************************/



/*******************Refund Payment to Payment Provider (payment Gatway) 
 * @formData form data;
 * @cb callback
*/
 
exports.refundPayment = (formData, cb)=>{
  var options = {
    'method': 'POST',
    'url': `${apiEndPoint}/refunds`,
    'headers': {
      'Authorization': `Basic ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: formData
  };
  request(options,(error, response) =>{
  if (error) return cb(error,null);
  response.body = response.body?JSON.parse(response.body):response.body;
  if (response && response.statusCode != 200) return cb(response.body.error.message,null);
  return cb(false, response.body)
  });
}
/*******************End ************************************************/