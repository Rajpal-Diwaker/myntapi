/********************Gift Sender Email********
 *@data user data
 *@return html string;
*/

const senderEmail = (data, lang ='en') => {
  if(lang ==='el'){
    let html = `<!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="assets/css/font-awesome.min.css" media="screen" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="assets">
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
      </head>
      <body  bgcolor="#f6f9fa" style="margin:0; padding:0">
        <div style="max-width:1000px; min-width:800px; margin:15px auto; font-family:'Nunito Sans', sans-serif;background-color: #fff; border:1px solid #e0e0e0;color:#1d1d1d;">
          Αγαπητή/έ ${data.fullName},<br />
          Αυτή είναι η επιβεβαίωση πληρωμής σας για την MYNT Gift Card αξίας €${data.amount}<br />
          Μη ξεχάσετε να μοιραστείτε με το αγαπημένο σας πρόσωπο, πως το MYNT παρέχει κατά παραγγελία υπηρεσίες ομορφιάς και ευεξίας, από καταξιωμένους επαγγελματίες κομμωτές, make up artists, περιποίησης νυχιών, αποτρίχωσης, personal trainers, yoga και pilates.<br />
          Οδηγίες για την εξαργύρωση της δωροκάρτας: <br />
          1)  Κατεβάστε την εφαρμογή εδώ *(link to https://themyntapp.com)*  <br />
          2)  Επιλέξτε "Πορτοφόλι" από το πλευρικό μενού και εισάγατε τον κωδικό: *code* για να φορτίσετε το ποσό της δωροκάρτας <br />
          3)  Εξαργυρώστε την δωροκάρτα κατά την ολοκλήρωση της παραγγελίας σας <br />
          Ακολουθήστε μας<br />
          *www.instagram.com/myntapp* *www.facebook.com/myntappofficial* *www.themyntapp.com*
        </div>
      </body>
    </html>`;
    return html;
  }
  let html = `<!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="assets/css/font-awesome.min.css" media="screen" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="assets">
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
      </head>
      <body  bgcolor="#f6f9fa" style="margin:0; padding:0">
        <div style="max-width:1000px; min-width:800px; margin:15px auto; font-family:'Nunito Sans', sans-serif;background-color: #fff; border:1px solid #e0e0e0;color:#1d1d1d;">
          Dear ${data.fullName},<br />
          THIS IS YOUR PURCHASE CONFIRMATION FOR A €${data.amount} ΜΥΝΤ GIFT CARD.<br />
          Don't forget to let your giftee know that MYNT delivers on-demand beauty and wellness services by top-rated professionals for hair, make up, nails, hair removal, personal training, yoga and pilates!<br />
          Instructions For Giftee:<br />
          1) Simply download the app *(link to https://themyntapp.com)* <br />
          2) Click "Wallet" in the side menu and view your total gift amount <br />
          3) Apply the amount in your wallet upon checkout. <br />
          Follow Us<br />
          *www.instagram.com/myntapp* *www.facebook.com/myntappofficial* *www.themyntapp.com*
        </div>
      </body>
    </html>`;
    return html;
}
/*************************END************************/


/********************Gift Receiver Email********
 *@data user data
 *@return html string;
*/

const receiverEmail = (data, lang ='en') => {
  if(lang ==='el'){
    let html = `<!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="assets/css/font-awesome.min.css" media="screen" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="assets">
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
      </head>
      <body  bgcolor="#f6f9fa" style="margin:0; padding:0">
        <div style="max-width:1000px; min-width:800px; margin:15px auto; font-family:'Nunito Sans', sans-serif;background-color: #fff; border:1px solid #e0e0e0;color:#1d1d1d;">
        ${data.fullName} σας έχει στείλει ΜΥΝΤ Gift Card αξίας €${data.amount}<br />
        ΚΑΤΕΒΑΣΤΕ ΤΗΝ ΕΦΑΡΜΟΓΗ *(link to https://themyntapp.com)<br />
        Οι πιο εξιδεικεύμενοι επαγγελματίες στον χώρο της ομορφιάς και του wellness σας προσφέρουν την απόλυτη εμπειρία περιποίησης στον χώρο σας. Ανοίξτε την εφαρμογή και διαλέξτε μία ή και περισσότερες υπηρεσίες Μαλλιών και Άκρων, Make Up, Aποτρίχωση, Personal Training, Yoga και Pilates.<br />
        Use €${data.amount} towards any service.
        Οδηγίες για την εξαργύρωση της δωροκάρτας:<br />
        1)  Κατεβάστε την εφαρμογή εδώ *(link to https://themyntapp.com)* <br />
        2)  Επιλέξτε "Πορτοφόλι" από το πλευρικό μενού και εισάγατε τον κωδικό: *code* για να φορτίσετε το ποσό της δωροκάρτας <br />
        3)  Εξαργυρώστε την δωροκάρτα κατά την ολοκλήρωση της παραγγελίας σας <br />
        Ακολουθήστε μας<br />
        *www.instagram.com/myntapp* *www.facebook.com/myntappofficial* *www.themyntapp.com*
        </div>
      </body>
    </html>`;
    return html;
  }
  let html = `<!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="assets/css/font-awesome.min.css" media="screen" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="assets">
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
      </head>
      <body  bgcolor="#f6f9fa" style="margin:0; padding:0">
        <div style="max-width:1000px; min-width:800px; margin:15px auto; font-family:'Nunito Sans', sans-serif;background-color: #fff; border:1px solid #e0e0e0;color:#1d1d1d;">
          ${data.fullName} HAS SENT YOU A ΜΥΝΤ GIFT CARD FOR €${data.amount}<br />
          DOWNLOAD THE APP *(link to https://themyntapp.com)*<br />
          MYNT delivers on-demand beauty and wellness services by top-rated professionals to your home (or office) anytime, anywhere. Open the app and book your next appointment for hair, nails, makeup, hair removal, personal training, yoga, or pilates.With MYNT, looking and feeling great has never been easier, more convenient or affordable. Pick your next service by downloading the app from the App Store/Play Store, or by going to https://themyntapp.com. <br />
          Use €${data.amount} towards any service.
          Instructions:<br />
          1) Simply download the app *(link to https://themyntapp.com)* <br />
          2) Click "Wallet" in the side menu and view your total gift amount <br />
          3) Apply the amount in your wallet upon checkout. <br />
          DOWNLOAD THE APP <br />
          Follow Us<br />
          *www.instagram.com/myntapp* *www.facebook.com/myntappofficial* *www.themyntapp.com*
        </div>
      </body>
    </html>`;
    return html;
}

/*************************END************************/

module.exports = {
  senderEmail,
  receiverEmail
};