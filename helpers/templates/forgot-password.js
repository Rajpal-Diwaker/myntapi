let forgotPassword = (data) => {
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
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
      
            <tr>
              <td width="100%" align="center" valign="top" style="margin: 0 auto; text-align: center; padding: 20px 0px 20px 0px;"><img src="https://res.cloudinary.com/ddbjnqpbw/image/upload/v1614012794/gfvbvbhponpsbqpmimvd.png" style="width:130px;margin: 0 auto;display: block;"></td>
            </tr>
            <tr>
              <td style="border-top:1px solid #c1c1c1"></td>
            </tr>
            <tr>
              <td align="left" valign="top" style="padding:30px 20px">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="100%">
                      <span style="font-size: 17px;font-weight: 600;"><strong>Hi ${data.name }</strong></span>
                    </td>
                  </tr>
                  <tr><td height="20"></td></tr>
                  <tr>
                    <td width="100%">
                      <span style="font-size: 17px;font-weight: 600;"><strong>We have received the request to reset your password for MYNT account</strong></span>
                    </td>
                  </tr>
                  <tr>
                   <td width="100%">
                     <p style="font-size: 14px;font-weight: 400;">
                       ${data.url || '123456'}
                     </p>
                   </td>
                 </tr>
                 <tr>
                   <td width="100%">
                   <span style="font-size: 17px;font-weight: 600;">If you did not initiate this request, please contact us at themynt@gmail.com</span>
                   </td>
                 </tr>
                 <tr>
                   <td width="100%">
                   <span style="font-size: 17px;font-weight: 600;">Thank you.</span>
                   </td>
                 </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td height="15"></td>
        </tr>
        <tr>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td align="left" valign="top" bgcolor="#f8f8f8"><table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" align="left" valign="top" style="padding:20px"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td><h3 style="font-size:24px">Download<br> MYNT App</h3></td>
                </tr>
                <tr>
                  <td align="left" valign="top"><img src="https://i.pinimg.com/originals/8e/14/6e/8e146e9e28baeb9b59c6004ed7b1343b.png" width="140" height="57" style="margin-right:10px;"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" width="140" height="56" ></td>
                </tr>
              </table>
      
            </td>
            <td width="50%" align="left" valign="top" style="padding:20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="border-left:2px solid #c7c7c7; padding-left:20px;padding-top:10px;"><img src="https://res.cloudinary.com/ddbjnqpbw/image/upload/v1614012794/gfvbvbhponpsbqpmimvd.png" style="width:120px;"></td>
              </tr>
              <tr>
                <td style="border-left:2px solid #c7c7c7; padding-left:20px; padding-top:10px; font-size:13px; line-height:24px; padding-bottom:10px;">
                Phone: +30 2106034818 
                Address: Entison, Pallini, 15351, Attiki
              </tr>
            </table></td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td bgcolor="#2f2f2f" style="padding:15px; text-align:center; color:#fff;">&copy; ${new Date().getFullYear()}  MYNT all right reserved</td>
      </tr>
      </table>
      </div>
      </body>
      </html>`;
  
    return html;
  }
  
  module.exports = forgotPassword;