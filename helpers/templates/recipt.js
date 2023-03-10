let reciptHtml = (order)=>{
    // console.log("from invoice HTML ---------->>>>", order);
    
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
    <div style="max-width:840px;  margin:15px auto; font-family:'Nunito Sans', sans-serif;background-color: #fff; border:1px solid #e0e0e0;color:#1d1d1d;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="left" valign="middle" style="padding:20px 20px 0 20px;">
          <table border="0" align="left" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" align="left" valign="top" style="border-right: 1px solid #c1c1c1;padding: 0px 10px 0px 0px;"><img src="https://gyan-hd.s3-ap-south-1.amazonaws.com/1596712655674.png" style="width:130px;"></td>
                <td width="50%" align="left" valign="middle" style="font-size: 18px;font-weight: bold; padding-left:15px">Invoice</td>
              </tr>
          </table></td>
        </tr>
        <tr>
          <td height="15"></td>
        </tr>
        <tr>
          <td style="border-top:1px solid #c1c1c1"></td>
        </tr>
        <tr>
          <td align="left" valign="top">&nbsp;</td>
        </tr>
        <tr>
          <td align="left" valign="top" style="padding:0 20px"><table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="23%">
             <span style="font-size: 13px;"><strong>Order ID :</strong></span>
         <span style="font-size: 13px; color:#0a94d6;"><strong>${order.uniqueId}</strong></span>
              </td>
              <td width="23%">
             <span style="font-size: 13px;"><strong>NO. of Items:</strong></span>
         <span style="font-size: 13px;; color:#0a94d6;"><strong>${order.allProductCount}</strong></span>
              </td>
              <td width="23%">
             <span style="font-size: 13px;;"><strong>Total Items:</strong></span>
         <span style="font-size: 13px; color:#0a94d6;"><strong>${order.allProductCount}</strong></span>
              </td>
               <td width="31%">
             <span style="font-size: 13px;"><strong>Date & Time:</strong></span>
         <span style="font-size: 13px; color:#0a94d6;"><strong>${new Date(order.createdAt).toLocaleString()}</strong></span>
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td><span style="font-size: 13px;"><strong>Order Type :</strong></span> <span style="font-size: 13px; color:#0a94d6;"><strong>${order.orderType}</strong></span></td>
              <td colspan="3"><span style="font-size: 13px;"><strong> Delivery Type:</strong></span> <span style="font-size: 13px; color:#0a94d6;"><strong>${order.deliveryType}</strong></span></td>
              </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="4"><span style="font-size: 13px;"><strong>Customer Name :</strong></span> <span style="font-size: 13px; color:#0a94d6;"><strong>${order.userId.fullName}</strong></span></td>
              </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="4"><span style="font-size: 13px;"><strong>Mobile Number :</strong></span> <span style="font-size: 13px; color:#0a94d6;"><strong>${order.userId.phone}</strong></span></td>
              </tr>
            <tr>
              <td colspan="4">&nbsp;</td>
              </tr>
            <tr>
              <td colspan="4"><span style="font-size: 13px;"><strong>Delivery Address :</strong></span></td>
              </tr>
            <tr>
              <td colspan="4"><p style="font-size: 13px;">${order.deliveryAdress.flatNo}, ${order.deliveryAdress.landMark}</p></td>
              </tr>
          </table></td>
        </tr>
        <tr>
          <td height="15"></td>
        </tr>
        <tr>
          <td align="left" valign="top" style="padding:0 20px"><table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="20%" align="center" style="padding:5px 0"><span style="font-size: 13px;"><strong>Category </strong></span></td>
              <td width="38%" align="center" style="padding:5px 0"><span style="font-size: 13px;"><strong>Item Name </strong></span></td>
              <td width="14%" align="center" style="padding:5px 0"><span style="font-size: 13px;"><strong>QTY</strong></span></td>
              <td width="14%" align="center" style="padding:5px 0"><span style="font-size: 13px;"><strong>Price</strong></span></td>
              <td width="14%" align="center" style="padding:5px 0"><span style="font-size: 13px;"><strong>Total</strong></span></td>
            </tr>
            <tr>
              <td height="10" colspan="5"></td>
            </tr>`
            order.allproduct.map(product =>{
              html+= `<tr>
              <td align="center" valign="middle" style="padding:10px; border-radius:4px 0 0 4px; background-color:#f6f6f6;"><span style="font-size: 14px;"><strong>${product.productId.categoryId.categoryName} </strong></span></td>
              <td align="center" valign="middle" style="padding:10px; background-color:#f6f6f6;"><span style="font-size: 14px;"><strong>${product.productId.itemName} </strong></span></td>
              <td align="center" valign="middle" style="padding:10px; background-color:#f6f6f6;"><span style="font-size: 14px;"><strong>${product.qty} </strong></span></td>
              <td align="center" valign="middle" style="padding:10px; background-color:#f6f6f6;"><span style="font-size: 14px;"><strong>${product.productPrice} </strong></span></td>
              <td align="center" valign="middle" style="padding:10px; border-radius:0 4px 4px 0; background-color:#f6f6f6;"><span style="font-size: 14px;"><strong>${product.productPrice * product.qty} </strong></span></td>
            </tr>`
            })
            

           html+= `<tr>
              <td height="10" colspan="5"></td>
            </tr>
           
            <tr>
              <td height="15" colspan="5"></td>
            </tr>
            <tr>
              <td align="center" valign="middle" style="padding:10px;">&nbsp;</td>
              <td colspan="3" align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>Total Amount </strong></span></td>
              <td align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>${order.subtotal} </strong></span></td>
            </tr>
           
            <tr>
              <td align="center" valign="middle" style="padding:10px;">&nbsp;</td>
              <td colspan="3" align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>Delivery Charge</strong></span></td>
              <td align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>${order.deliveryCharges} </strong></span></td>
              </tr>
            <tr>
              <td align="center" valign="middle" style="padding:10px;">&nbsp;</td>
              <td colspan="3" align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>Discount</strong></span></td>
              <td align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px; color:#6bb97d"><strong>-${order.discount}</strong></span></td>
              </tr>
            <tr>
              <td height="10" colspan="5" align="center" valign="middle"></td>
              </tr>
            <tr>
              <td align="center" valign="middle" style="padding:10px; border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1;">&nbsp;</td>
              <td colspan="3" align="center" valign="middle" style="padding:10px; border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1;"><span style="font-size: 13px;"><strong>Grand Total</strong></span></td>
              <td align="center" valign="middle" style="padding:10px; border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1;"><span style="font-size: 13px;"><strong>${order.GrandTotal} </strong></span></td>
            </tr>
          </table></td>
        </tr>`
           
           order.transactions.map((transaction)=>{
            html+=` <tr>
            <td align="left" valign="top" style="padding:0 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #f1f1f1; border-bottom:1px solid #f1f1f1;">
              <tr>
                <td width="25%" align="center" valign="middle" style="padding:15px 0">
                 <span style="font-size: 13px;"><strong>Total Amount :</strong></span>
             <span style="font-size: 13px; color:#0a94d6;"><strong> ${transaction.transactionId.amountAdd}</strong></span>
                </td>
                <td width="30%" align="center" valign="middle" style="padding:15px 0">
                 <span style="font-size: 13px;"><strong>Payment Method :</strong></span>
             <span style="font-size: 13px; color:#0a94d6;"><strong>${transaction.transactionId.paymentMode}</strong></span>
                </td>
                <td width="25%" align="center" valign="middle" style="padding:15px 0">
                <span style="font-size: 13px;"><strong>Transaction ID :</strong></span>
             <span style="font-size: 13px; color:#0a94d6;"><strong>${transaction.transactionId._id}</strong></span>
                </td>
                <td width="20%" align="center" valign="middle" style="padding:15px 0">
                 <span style="font-size: 13px;"><strong>Status :</strong></span>
             <span style="font-size: 13px; color:#0a94d6;"><strong>${transaction.transactionId.status}</strong></span>
                </td>
              </tr>
            </table></td>
          </tr>`
           })
          

       html+=` <tr>
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
                  <td><h3 style="font-size:24px">Download<br> Gyan Fresh App</h3></td>
                </tr>
                <tr>
                  <td align="left" valign="top"><img src="images/app_store.png" width="140" height="57" style="margin-right:10px;"><img src="images/google_play.png" width="140" height="56" ></td>
                </tr>
              </table>
              
              </td>
              <td width="50%" align="left" valign="top" style="padding:20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-left:2px solid #c7c7c7; padding-left:20px;padding-top:10px;"><img src="https://gyan-hd.s3-ap-south-1.amazonaws.com/1596712655674.png" style="width:120px;"></td>
                </tr>
                <tr>
                  <td style="border-left:2px solid #c7c7c7; padding-left:20px; padding-top:10px; font-size:13px; line-height:24px; padding-bottom:10px;">B -13, H-Road, Mahanagar Extension, Lucknow - 226 006<br>
    Unit 1 -  Village Gudamba, Kursi Road, Lucknow - 226 026<br>
    Unit 2 - Plot No. A-5, UPSIDC Agropark, Distt Barabanki<br>
    Customer Care : +91 522 3511 900 | care@gyandairy.com</td>
                </tr>
              </table></td>
            </tr>
          </table></td>
        </tr>
        <tr>
          <td bgcolor="#2f2f2f" style="padding:15px; text-align:center; color:#fff;">&copy; 2020  Gyanfreshmilk all right reserved</td>
        </tr>
      </table>
    </div>
    </body>
    </html>`

        return html;
}

{/* <tr>
<td align="center" valign="middle" style="padding:10px;">&nbsp;</td>
<td colspan="3" align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>GST (12%) </strong></span></td>
<td align="center" valign="middle" style="padding:10px;"><span style="font-size: 14px;"><strong>299.88 </strong></span></td>
</tr> */}

{/* <tr>
<td align="left" valign="top" style="padding:0 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #f1f1f1; border-bottom:1px solid #f1f1f1;">
  <tr>
    <td width="25%" align="center" valign="middle" style="padding:15px 0">
     <span style="font-size: 13px;"><strong>Total Amount :</strong></span>
 <span style="font-size: 13px; color:#0a94d6;"><strong>??? 423</strong></span>
    </td>
    <td width="30%" align="center" valign="middle" style="padding:15px 0">
     <span style="font-size: 13px;"><strong>Payment Method :</strong></span>
 <span style="font-size: 13px; color:#0a94d6;"><strong>Credit Card</strong></span>
    </td>
    <td width="25%" align="center" valign="middle" style="padding:15px 0">
    <span style="font-size: 13px;"><strong>Transaction ID :</strong></span>
 <span style="font-size: 13px; color:#0a94d6;"><strong>036344553</strong></span>
    </td>
    <td width="20%" align="center" valign="middle" style="padding:15px 0">
     <span style="font-size: 13px;"><strong>Status :</strong></span>
 <span style="font-size: 13px; color:#0a94d6;"><strong>Success</strong></span>
    </td>
  </tr>
</table></td>
</tr> */}
module.exports = reciptHtml;