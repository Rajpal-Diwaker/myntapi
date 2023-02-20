let reciptHtml = 
(data)=>{
    let transactions = JSON.parse(data.transactions);
    console.log("-----------",transactions);
    
    let html = `<!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="assets/css/font-awesome.min.css" media="screen" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="assets">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,800;1,600;1,700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <div style="max-width:1000px; margin:auto; font-family: 'Montserrat', sans-serif;background-color: #fff;">
            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #c1c1c1;border-top: 1px solid #c1c1c1; padding: 10px 0px;">
                            <tr>
                                <td width="50%" align="left" valign="top">
                                    <table>
                                        <tr>
                                            <td  width="50%" align="left" valign="top" style="border-right: 1px solid #c1c1c1;padding: 0px 10px 0px 0px;">
                                                <img src="https://gyan-hd.s3-ap-south-1.amazonaws.com/1596712655674.png">
                                            </td>
                                            <td  width="50%" align="left" valign="top" >
                                                <p style="font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-heigteht: 1.2;">Transaction Statement</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td width="50%" align="right" valign="top">
                                    <table>
                                        <tr>
                                            <td  width="50%" align="left" valign="top">
                                                <p style="font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">${new Date().toDateString()}</p>
                                            </td>
                                            <td  width="50%" align="right" valign="top" >
                                                <p style="font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">Page 1 of 1</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0" style="padding: 20px 0px;border-bottom: 1px solid#c1c1c1;">
                            <tr>
                                <td width="20%" align="center" valign="top">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="40%" align="left" valign="top">
                                                <p style="margin: 0; font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">user ID :</p>
                                            </td>
                                            <td width="60%" align="left" valign="top">
                                                <span style="font-size:14px;color:#0a94d6;font-weight: bold;line-height: 1.2;">${data.user.uniqueId}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td width="30%" align="center" valign="top">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="50%" align="left" valign="top">
                                                <p style="margin: 0; font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">Customer Name :</p>
                                            </td>
                                            <td width="50%" align="left" valign="top">
                                                <span style="font-size: 14px;color:#0a94d6;font-weight: bold;line-height: 1.2;">${data.user.fullName}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td width="30%" align="center" valign="top">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="20%" align="left" valign="top">
                                                <p style="margin: 0; font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">Email :</p>
                                            </td>
                                            <td width="80%" align="left" valign="top">
                                                <span style="font-size: 14px;color:#0a94d6;font-weight: bold;line-height: 1.2;">${data.user.email}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td width="20%" align="center" valign="top">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="35%" align="left" valign="top">
                                                <p style="margin: 0; font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">Phone :</p>
                                            </td>
                                            <td width="65%" align="left" valign="top">
                                                <span style="font-size: 14px;color:#0a94d6;font-weight: bold;line-height: 1.2;">${data.user.phone}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <table width="100%" align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td  width="50%" align="left" valign="top">
                                <table width="100%" align="center" cellpadding="0" cellspacing="0" style="padding: 20px 0px 0px 0px">
                                    <tr>
                                        <td width="10%" align="left" valign="top">
                                            <p style="margin: 0; font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">Statement :</p>
                                        </td>
                                        <td width="90%" align="left" valign="top">
                                            <span style="font-size: 14px;color:#0a94d6;font-weight: bold;line-height: 1.2;">${new Date(data.fromDate).toDateString()} - ${new Date(data.toDate).toDateString()}</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </tr>
                <tr>
                    <td>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0" style="padding: 30px 0px 50px 0px;">
                            <tr>
                                <td>
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <thead style="background-color: #efefef;width: 100%;padding: 25px 0px;border-bottom: 1px solid#c1c1c1; ">
                                                <th style="padding: 20px 0px;border-right:1px solid#c1c1c1;">Date</th>
                                                <th style="padding: 20px 0px;border-right:1px solid#c1c1c1;">Description</th>
                                                <th style="padding: 20px 0px;border-right:1px solid#c1c1c1;">Debit</th>
                                                <th style="padding: 20px 0px;">Credit</th>
                                            </thead>
                                        </tr>`
                                       let row = '';
                                       let balance = 0;
                                        transactions.map(transaction=>{
                                            row +=  `<tr style="border-top: 1px solid#c1c1c1;">
                                            <td style="text-align: center;border-right:1px solid#c1c1c1;border-top: 1px solid#c1c1c1;padding: 15px 0px;font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">${new Date(transaction.createdAt).toDateString()}</td>
                                            <td style="text-align: center;border-right:1px solid#c1c1c1;border-top: 1px solid#c1c1c1;padding: 15px 0px;font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;">${transaction.des}</td>
                                            <td style="text-align: center;border-right:1px solid#c1c1c1;border-top: 1px solid#c1c1c1;padding: 15px 0px;font-size: 14px;color: #ff2222;font-weight: bold;line-height: 1.2;">${transaction.amountAdd < 0 ? "₹ "+ transaction.amountAdd : "" }</td>
                                            <td style="text-align: center;border-top: 1px solid#c1c1c1;padding: 15px 0px;font-size: 14px;color:#0e9f3b;font-weight: bold;line-height: 1.2;">${transaction.amountAdd > 0 ?"₹ "+  transaction.amountAdd : "" }</td>
                                        </tr>`
                                        balance += transaction.amountAdd;
                                        })
                                        html+=row
                                        html+=`<tr>
    
                                            <table width="100%" align="center" cellpadding="0" cellspacing="0" style="padding: 25px 0px;background-color:#efefef;">
                                                <tr>
                                                    <td width="90%">
                                                        <p style="margin: 0;padding-left: 20px;font-size: 14px;color: rgb(29, 29, 29);font-weight: bold;line-height: 1.2;"">Total Balance</p>
                                                    </td>
                                                    <td width="10%;">
                                                        <h4 style="margin: 0;">₹ ${balance}</h4>
                                                    </td>
                                                </tr>
                                            </table>		
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0" style="padding: 10px 0px 30px 0px;background-color:#f8f8f8;">
                            <tr>
                                <td width="50%" style="border-right:1px solid#c1c1c1; padding: 10px;">
                                    <h5 style="font-size: 20px;line-height: 1.6;">Download
                                        <br>
                                        Gyan Fresh App
                                    </h5>
                                    <span>
                                        <a href="javascript:void(0);" style="border: 1px solid#25aef0;padding: 20px;border-radius: 22px;color: #25aef0;margin: 0px 10px 0px 0px;">
                                         <i class="fa fa-apple" aria-hidden="true" style="font-size: 23px;"></i>
                                         <p style="margin:0;display: inline-block;padding: 20px 0px 0px 0px;line-height: 15px;">Get On the <BR> App Store</p>
                                        </a>
                                        <a href="javascript:void(0);" style="border: 1px solid#25aef0;padding: 20px;border-radius: 22px; color: #25aef0;margin: 0px 10px 0px 0px;">
                                         <i class="fa fa-play" aria-hidden="true" style="font-size: 23px;"></i>
                                         <p style="margin:0;display: inline-block;padding: 20px 0px 0px 0px;line-height: 15px;">Get it on <BR> Google play</p>
                                        </a>
                                    </span>
                                </td>
                                <td width="50%" style="padding: 10px;">
                                    <img src="https://gyan-hd.s3-ap-south-1.amazonaws.com/1596712655674.png">
                                    <span>
                                        <p style="margin: 0;">B-13, H Road Mahanagar Extension, Lucknow - 226 006</p>
                                        <p style="margin: 0;">Unit 1 - Village Gudamba kursi, Lucknow - 226 026</p>
                                        <p style="margin: 0;">Customer Care : +91 5225311 900 | care@gyandairy.com</p>
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" align="center" cellpadding="0" bgcolor="#333" cellspacing="0" style="padding: 20px;">
                            <tr>
                                <td>
                                    <p style="margin: 0;text-align: center;color: #fff; ">@ 2020 Gyanfreshmilk all right reserved</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`

        return html;
}

module.exports = reciptHtml;