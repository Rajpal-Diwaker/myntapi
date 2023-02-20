exports.statusCode = {
    "EVERYTHING_IS_OK": 200,
    "NOT_MODIFIED": 304,
    "BAD_REQUEST": 400,
    "PARAMETER_IS_MISSING": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "ALREADY_EXIST": 409,
    "INTERNAL_SERVER_ERROR": 500,
    "WENT_WRONG": 501,
    "SOMETHING_WENT_WRONG": 503,
    "SESSION_EXPIRED": 440,
    "REFUND": 301,
    "TIME_SLOT_NOT_AVAIL": 406
}

exports.statusMessage = {
    "ValidationError": "Validation Error.",
    "SOME-THING-WENT-WRONG": "Some went wrong",
    "NOT_EXIST": "THIS USER NOT EXIST",
    "ADMIN_NOT_EXIST": "Please enter the registered email id",
    "Login_sucess": "Login successfully",
    "NOT_IN_USE": "NOT IN USE",
    "phonenumber_already": 'phone number already exist',
    "Email_already": 'Email already exist',
    "success": 'Success',
    "SUCCESS_PRO_ACCOUNT":'You have successfully applied. Wait for admin approval',
    "BOOKED_SERVICES": 'Your service has been booked successfully',
    "WEDDIND_SUCCESS":'Your query has been submitted successfully',
    "FUNCTIONALITY_UNAVILABLE": "This functionality is currently unavilable.",
    "NOT_FOUND": "NOT FOUND",
    "PASSWORD_NOT_MATCHED": "Your passowrd not matched with password you were using to login",
    "TOKEN_NOT_FOUND": "Please provide acess token in headers",
    "INVALID_USER": "This user does't exist",
    "INVALID_ACESS_TOKEN": "Invalid acess token provided",
    "DB_ERROR": "Database related error",
    "INVALID_OTP": "Inavlid OTP",
    "INVALID_EMAIL": "This email is not registered with us.",
    "INVALID_USERNAME": "This Username is not registered with us.",
    "INVALID_LICENSE": "Invalid license number",
    "GROUP_ALLREADY_EXIST": "This group name already exist",
    "WRONG_PASSWORD": "Please enter correct password.",
    "WRONG_OLD_PASSWORD": "The old password you have entered is incorrect.",
    "MOBILE_ALREADY_REGISTERED": "This mobile number is already registered with us.",
    "EMAIL_ALREADY_REGISTERED": "This email is already registered with us.",
    "MOBILE_NOT_REGISTERED": "This mobile number is not registered with us.",
    "INCORRECT_OLD_PASSWORD": "The old password you have entered is incorrect.",
    "ADDED": "Added successfully.",
    "UPDATED": "Updated successfully.",
    "DELETED": "Deleted successfully.",
    "INACTIVE_USER": "Your account is either inactive , deleted or blocked . Please contact to customer service.",
    "TOKEN_EXPIRE": "Your token has been expire please login.",
    "ADDEDD":"Address added succesfully.",
    "THANKYOU":"Thanks for contacting us! We will be in touch with you shortly",
    "ENQUIRY":"your enquiry has been submitted successfully. Our Team will contact you soon for this",
    "BLOCKPRO":"Professional block for 5 minutes successfully.",
    "INVALID_ID":"Invaild Address Id",
    "CONPASSWORD":"Password and confirmPassword does not match",
    "UPLOAD":"Image deleted Successfully.",
    "REGISTER":"Registration Success",
    "USER_REFUND":"Your booking has been cancelled. Your Payment will be refund within 2-3 business days.",
    "USER_REFUND_NO_PAYMENT":"Your booking has been cancelled. You had booked this service without any payment.(Applied Gift Card). Your gift card is reverted.",
    "TIME_SLOT_NOT_AVAIL":"Time slot is not avaialbe.",
    "PAYMETN_CARD_ADDED":"Card Saved Successfully",
    "PAYMETN_CARD_REMOVED":"Card Removed Successfully",
    "CREDIT_POINT_MAX":"You don't have enough MYNT points",
    "BOOKING_COMPLETED":"You have successfully completed the service.",
    "USER_NO_REFUND":"Your appointment has been cancelled. Because of the same day cancellation, no refund will be provided.",
    "BOOKING_NOT_FOUND":"This booking is not exists in our record.",
    "CREDIT_GIFT_APPLIED_ERROR": "Credit Point and Gift Card can't applly at a time. Please select only one at a time",
    "GIFTAMOUNTEXCEED": "Wallet balance insufficient",
    "GIFTAMOUNTMAX": "Gift Card amount is more then booking amount. Please enter total gift card amount is equal to or less then booking amount.",
    "GIFTCARDSAMEEMAIL":"You can not send gift card to yourself.",
    "GIFTCARDSUCCESS":"You have successfully gifted the card to your loved ones",
    "REQUEST_TIMEOUT":"Request has expired"
}


exports.statusMessageGr = {
    "Validation Error": "Σφάλμα επικύρωσης.",
    "SOME-THING-WENT-WRONG": "Κάποιοι πήγαν στραβά",
    "NOT_EXIST": "ΑΥΤΟΣ Ο ΧΡΗΣΤΗΣ ΔΕΝ ΥΠΑΡΧΕΙ",
    "ADMIN_NOT_EXIST": "ΔΕΝ ΥΠΑΡΧΕΙ",
    "Login_sucess": "Login successfully",
    "NOT_IN_USE": "Συνδεθείτε με επιτυχία",
    "phonenumber_already": 'υπάρχει ήδη αριθμός τηλεφώνου',
    "Email_already": 'Το email υπάρχει ήδη',
    "success": 'Επιτυχία',
    "SUCCESS_PRO_ACCOUNT":'Έχετε υποβάλει αίτηση με επιτυχία. Περιμένετε για έγκριση διαχειριστή',
    "BOOKED_SERVICES": 'Η υπηρεσία σας έχει κλείσει με επιτυχία',
    "WEDDIND_SUCCESS":'Το ερώτημά σας υποβλήθηκε με επιτυχία',
    "FUNCTIONALITY_UNAVILABLE": "Αυτή η λειτουργικότητα είναι επί του παρόντος αναπόφευκτη.",
    "NOT_FOUND": "ΔΕΝ ΒΡΕΘΗΚΕ",
    "PASSWORD_NOT_MATCHED": "Ο κωδικός πρόσβασης δεν ταιριάζει με τον κωδικό πρόσβασης που χρησιμοποιούσατε για να συνδεθείτε",
    "TOKEN_NOT_FOUND": "Καταχωρίστε το διακριτικό πρόσβασης στις κεφαλίδες",
    "INVALID_USER": "Αυτός ο χρήστης δεν υπάρχει",
    "INVALID_ACESS_TOKEN": "Παρέχεται μη έγκυρο διακριτικό πρόσβασης",
    "DB_ERROR": "Σφάλμα σχετικά με τη βάση δεδομένων",
    "INVALID_OTP": "Μη έγκυρο OTP",
    "INVALID_EMAIL": "Αυτό το email δεν είναι εγγεγραμμένο σε εμάς.",
    "INVALID_USERNAME": "Αυτό το όνομα χρήστη δεν είναι εγγεγραμμένο σε εμάς.",
    "INVALID_LICENSE": "Μη έγκυρος αριθμός άδειας",
    "GROUP_ALLREADY_EXIST": "Αυτό το όνομα ομάδας υπάρχει ήδη",
    "WRONG_PASSWORD": "Εισαγάγετε τον σωστό κωδικό πρόσβασης.",
    "WRONG_OLD_PASSWORD": "Ο παλιός κωδικός πρόσβασης που έχετε εισαγάγει είναι λανθασμένος",
    "MOBILE_ALREADY_REGISTERED": "Αυτός ο αριθμός κινητού έχει ήδη εγγραφεί σε εμάς.",
    "EMAIL_ALREADY_REGISTERED": "Αυτό το email έχει ήδη εγγραφεί σε εμάς.",
    "MOBILE_NOT_REGISTERED": "Αυτός ο αριθμός κινητού δεν έχει εγγραφεί σε εμάς.",
    "INCORRECT_OLD_PASSWORD": "Ο παλιός κωδικός πρόσβασης που έχετε εισαγάγει είναι λανθασμένος.",
    "ADDED": "Προστέθηκε με επιτυχία.",
    "UPDATED": "Ενημερώθηκε με επιτυχία.",
    "DELETED": "Διαγράφηκε με επιτυχία.",
    "INACTIVE_USER": "Ο λογαριασμός σας είναι είτε ανενεργός, διαγραμμένος είτε αποκλεισμένος. Επικοινωνήστε με την εξυπηρέτηση πελατών.",
    "TOKEN_EXPIRE": "Το διακριτικό σας έχει λήξει, συνδεθείτε.",
    "ADDEDD":"Η διεύθυνση προστέθηκε με επιτυχία.",
    "THANKYOU":"Ευχαριστούμε που επικοινωνήσατε μαζί μας! Θα επικοινωνήσουμε μαζί σας σύντομα",
    "ENQUIRY":"το ερώτημά σας υποβλήθηκε με επιτυχία. Η ομάδα μας θα επικοινωνήσει μαζί σας σύντομα για αυτό",
    "BLOCKPRO":"Επαγγελματικό μπλοκ για 5 λεπτά με επιτυχία.",
    "INVALID_ID":"Αναγνωριστικό διεύθυνσης Invaild",
    "CONPASSWORD":"Κωδικός πρόσβασης και επιβεβαίωσηΟ κωδικός δεν ταιριάζει",
    "UPLOAD":"Η εικόνα διαγράφηκε με επιτυχία.",
    "REGISTER":"Επιτυχία εγγραφής",
    "USER_REFUND":"Η κράτησή σας ακυρώθηκε. Η πληρωμή σας θα επιστραφεί εντός 2-3 εργάσιμων ημερών.",
    "USER_REFUND_NO_PAYMENT": "Η κράτησή σας ακυρώθηκε. Είχατε κάνει κράτηση για αυτήν την υπηρεσία χωρίς καμία πληρωμή. (Εφαρμοσμένη δωροκάρτα). Η δωροκάρτα σας έχει αντιστραφεί.",
    "TIME_SLOT_NOT_AVAIL":"Η χρονοθυρίδα δεν είναι διαθέσιμη.",
    "PAYMETN_CARD_ADDED":"Η κάρτα αποθηκεύτηκε με επιτυχία",
    "PAYMETN_CARD_REMOVED":"Η κάρτα αφαιρέθηκε με επιτυχία",
    "CREDIT_POINT_MAX":"Δεν έχετε αρκετά ΜΥΝΤ points",
    "BOOKING_COMPLETED":"Ολοκληρώσατε με επιτυχία την υπηρεσία.",
    "USER_NO_REFUND":"Το ραντεβού σας ακυρώθηκε. Λόγω της ακύρωσης της ίδιας ημέρας, δεν θα υπάρξει επιστροφή χρημάτων.",
    "BOOKING_NOT_FOUND":"Αυτή η κράτηση δεν υπάρχει στο αρχείο μας.",
    "CREDIT_GIFT_APPLIED_ERROR": "Τα πιστωτικά σημεία και η δωροκάρτα δεν μπορούν να εφαρμοστούν ταυτόχρονα. Επιλέξτε μόνο ένα κάθε φορά",
    "GIFTAMOUNTEXCEED":"Το υπόλοιπο στο Πορτοφόλι σας δεν επαρκεί για την ολοκλήρωση της καταχώρησης",
    "GIFTAMOUNTMAX": "Το ποσό της δωροκάρτας είναι περισσότερο από το ποσό κράτησης. Εισαγάγετε το συνολικό ποσό της δωροκάρτας είναι ίσο ή μικρότερο από το ποσό κράτησης",
    "GIFTCARDSAMEEMAIL":"Δεν μπορείτε να στείλετε δωροκάρτα στον εαυτό σας.",
    "GIFTCARDSUCCESS":"δώσατε με επιτυχία την κάρτα στα αγαπημένα σας πρόσωπα",
    "REQUEST_TIMEOUT":"Ο χρόνος αποδοχής έληξε"

    
}

exports.CommonEnum = {
    "ORDER_STATUS": ['RETURN', 'DELIVERED', 'PLACED', 'INITIATED', 'CANCELED', 'PAUSED', 'SEMI_DELIVERED', "NOT_DELIVERED", "SUCCESS", "REFUNDED"],
    "ACTIVE_ORDERS_STATUS": ['PLACED', 'INITIATED'],
    "PAST_ORDER_STATUS": ["CANCELED", 'DELIVERED', 'SEMI_DELIVERED', 'NOT_DELIVERED', "SUCCESS", "REFUNDED"],
    "NON_REFUNDED_ORDER_STATUS": ["CANCELED", 'DELIVERED', 'SEMI_DELIVERED', 'NOT_DELIVERED', "SUCCESS"],
    "PAST_ORDER_SUCESSFULL": ['DELIVERED', 'SEMI_DELIVERED', 'NOT_DELIVERED', "SUCCESS"],
    "ORDER_STATUS_PENDING": ['PLACED', 'INITIATED'],
    "ORDER_STATUS_NOT_DELIVERED": ["NOT_DELIVERED"],
    "ORDER_STATUS_SEMI_DELIVERED": ["SEMI_DELIVERED"],
    "ORDER_STATUS_DELIVERED": ['DELIVERED', 'SEMI_DELIVERED'],
    "ORDER_STATUS_SUCCESS": ["SUCCESS"],
    "ORDER_STATUS_RETURN": ['NOT_DELIVERED', 'SEMI_DELIVERED'],
    "ORDER_STATUS_SEMIDELIVERED_RETURN": ['SEMI_DELIVERED'],
    "ORDER_STATUS_NOTDELIVERED_RETURN": ['NOT_DELIVERED'],
    "DELIVERY_CHAMPION_STATUS": ["STARTED", "END", "NOT_STARTED"],
    "ORDER_TYPE_DELIVERY": ['ONCE', 'SUBSCRIBE'],
    "ORDER_TYPE_ONHUB": ['ONHUB'],
    "ORDER_INITIATED": ['INITIATED'],
    "ORDER_PLACED": ['PLACED'],
    "CART_WALLET_PRODUCTS": ["OFFER", "REGULAR"],
    "CART_GYAN_STAR_PRODUCTS": ["GYANSTAR"],
    "SUBSCRRIPTION_ACTIVE": ["INITIATED"],
    "DEMAND_STATUS": ["ACCEPTED", "REJECTED", 'INITIATED', "RECIVED"],
    "DEMAND_STATUS_ACTIVE": ["INITIATED", "ACCEPTED"],
    "DEMAND_STATUS_PAST": ["RECIVED", "REJECTED"],
    "DEMAND_STATUS_SUCESSFULL": ["RECIVED"],
    "DEMAND_TYPE": ["HUB_DEMAND", "DEMAND_BY_ORDER"],
    "DEMAND_TYPE_HUB": ["HUB_DEMAND"],
    "DEMAND_TYPE_ORDER": ["DEMAND_BY_ORDER"],
    "RETURN_STATUS": ["SUCCESS", "CANCELED"],
    "RETURN_STATUS_SUCCESS": ["SUCCESS"],
    "RETURN_STATUS_CANCELED": ["CANCELED"],
    "CASH_COLLECTION_STATUS": ["INITIATED", "RECEIVED", "NOT_RECIVED", "SUBMITED", "SUCCESS", "REJECTED"],
    "CASH_COLLECTION_ACTIVE_STATUS": ["INITIATED"],
    "CASH_COLLECTION_PAST_STATUS": ["RECEIVED", "NOT_RECIVED", "SUBMITED", "SUCCESS", "REJECTED"],
    "CASH_COLLECTION_COLLECTED_STATUS": ["RECEIVED", "SUBMITED", "SUCCESS"],
    "CASH_COLLECTION_PENDING_STATUS": ["INITIATED"]
}

exports.StringMessages = {
    "THANKS_FOR_FEEDBACK": " Thanks for your feedBack, we are looking forword on it. ",
    "THANKS_FOR_CONTACTING": "Thankyou for contacting us, we will get back to you soon.",
    "THANK_FOR_SUGGESTION": "Thanks for your suggestion, we will surely work on it."
}
exports.MAIL_SUBJECT = {
    "REGISTRATION_DONE": "Your MYNT Professional Credentails"
}
exports.bookingConfirmUserNotification = (data, lang ='en') =>{
    if(lang === 'el'){
        return `Το ραντεβού σας επιβεβαιώθηκε! ${data.name} ${data.location} ${data.date} ${data.time} Συνολικό ποσό: €${data.totalPrice} Υπόλοιπο εξόφλησης: €${data.duePrice}`;
    }
    return `Your appointment has been confirmed! ${data.name} ${data.location} ${data.date} ${data.time} Total Price: €${data.totalPrice} Amount Due (Appointment Fee): €${data.duePrice}`;
}
exports.bookingConfirmUserNotificationDb = (data, lang ='en') =>{
    if(lang === 'el'){
        return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">Το ραντεβού σας επιβεβαιώθηκε!</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Συνολικό ποσό: <b> €${data.totalPrice} </b></p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Υπόλοιπο εξόφλησης:<b> €${data.duePrice}</b></p> </div> </div> </body> </html>`;
    }
    return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">Your appointment has been confirmed!</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Total Price :<b> €${data.totalPrice} </b></p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Amount Due (Appointment Fee):<b> €${data.duePrice}</b></p> </div> </div> </body> </html>`;
}
exports.bookingConfirmProNotification = (data, lang ='en', isAdminDue = false) =>{
    if(lang === 'el'){
        return `Το ραντεβού σας επιβεβαιώθηκε! ${data.name} ${data.location} ${data.date} ${data.time} Ποσό εξόφλησης από τον πελάτη: €${data.price}, Admin Due: €${data.giftAmount || 0}`;
    }
    return `Your appointment has been confirmed! ${data.name} ${data.location} ${data.date} ${data.time} Price: €${data.price}, Admin Due: €${data.giftAmount || 0}`;
}
exports.bookingConfirmProNotificationDb = (data, lang ='en', isAdminDue = false) =>{
    if(lang === 'el'){
        return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">Το ραντεβού σας επιβεβαιώθηκε!</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Ποσό εξόφλησης από τον πελάτη : <b> €${data.price} </b></p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Προθεσμία διαχειριστή:<b> €${data.giftAmount || 0}</b></p> </div> </div> </body> </html>`;   
    }
    return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">Your appointment has been confirmed!</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Price :<b> €${data.price} </b></p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Admin Due:<b> €${data.giftAmount || 0}</b></p> </div> </div> </body> </html>`;
}
exports.notificationContentEn = {
    "giftCardTransactionTitleIn":"Gift Received",
    "giftCardTransactionTitleReturn":"Booking Cancelled",
    "giftCardTransactionTitleOut":"Purchase Details",
    "proPendingPaymentTitle":"Professional Pending Payment",
    "proPendingPayment":"Professional Pending Payment. Please pay his payment.",
    "refundTitle":"New Refund Request",
    "refundCancelUser":"User does not want any other professional, please refund his amount.",
    "refundCancelBookingUser":"User has canalled the request, please refund his amount",
    "refundCancelBookingUserRetry":"User has tried to find professional. No professional was found, please refund his amount",
    "bookingConfirm":"Booking Confirm",
    "bookingComplete":"Appointment Completed",
    "bookingCancelTitle":"Appointment Cancelled",
    "bookingCancel":"Unfortunately your client has cancelled the appointment.",
    "broadcastBookingTitle":"New Booking Request",
    "bookingCancelPro":"Unfortunately your MYNT Professional had to cancel. We will find you a replacement shortly!"
}
exports.notificationContentEl = {
    "giftCardTransactionTitleIn":"Gift Received",
    "giftCardTransactionTitleReturn":"Booking Cancelled",
    "giftCardTransactionTitleOut":"Purchase Details",
    "proPendingPaymentTitle":"Επαγγελματική πληρωμή σε εκκρεμότητα",
    "proPendingPayment":"Professional Pending Payment. Please pay his payment.",
    "refundTitle": "Νέο αίτημα επιστροφής χρημάτων",
    "refundCancelUser":"Ο χρήστης δεν θέλει άλλο επαγγελματία, επιστρέψτε το ποσό του.",
    "refundCancelBookingUser":"Ο χρήστης έχει ολοκληρώσει το αίτημα, επιστρέψτε το ποσό του",
    "refundCancelBookingUserRetry":"Ο χρήστης προσπάθησε να βρει επαγγελματία. Δεν βρέθηκε επαγγελματίας, επιστρέψτε το ποσό του",

    "bookingConfirm":"Επιβεβαίωση κράτησης",
    "bookingComplete":"Ο ραντεβού ολοκληρώθηκε",
    "bookingCancelTitle":"το ραντεβού ακυρώθηκε",
    "bookingCancel":"Δυστυχώς ο πελάτης ακύρωσε το ραντέβου.",
    "broadcastBookingTitle":"Νέο αίτημα κράτησης",
    "bookingCancelPro":"Δυστυχώς ο ΜΥΝΤ Professional ακύρωσε το ραντέβου. Θα κάνουμε το καλύτερο για να σας βρούμε νέο επαγγελματία."
}
exports.broadcastProNotification = (data, lang ='en') =>{
    if(lang === 'el'){
        return `ΝΕΟ ΑΙΤΗΜΑ: ${data.name} ${data.location} ${data.date} ${data.time} ${data.service} ΑΠΟΔΕΧΤΕ ή ΑΝΑΓΝΩΣΤΕ το αίτημα`;
    }
    return `NEW REQUEST: ${data.name} ${data.location} ${data.date} ${data.time} ${data.service} Please ACCEPT or IGNORE the request.`;
}
exports.broadcastProNotificationDb = (data, lang ='en') =>{
    if(lang === 'el'){
        return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">ΝΕΟ ΑΙΤΗΜΑ</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.service}</p></div> </div> </body> </html>`;
    }
    return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">NEW REQUEST</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.service}</p></div> </div> </body> </html>`;
}
exports.completedUserNotification = (data, lang ='en') =>{
    if(lang === 'el'){
        return `Το ραντεβού σας ολοκληρώθηκε! ${data.name} ${data.location} ${data.date} ${data.time} Συνολικό ποσό: €${data.price}`;
    }
    return `Your appointment is completed! ${data.name} ${data.location} ${data.date} ${data.time} Total Price: €${data.price}`;
}
exports.completedUserNotificationDb = (data, lang ='en') =>{
    if(lang === 'el'){
        return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">Το ραντεβού σας ολοκληρώθηκε!</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Συνολικό ποσό:<b> €${data.price}<b></p></div> </div> </body> </html>`;
    }
    return `<!DOCTYPE html><html><head><title></title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></head> <body style="font-family: 'Roboto', sans-serif;"> <div class="wrapper"> <div class="app-content" style="padding: 0px 1rem;"> <p style="font-size: 14px;font-weight: 500;margin-bottom: 0;">Your appointment is completed!</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.name}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.location}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.date}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">${data.time}</p> <p style="font-size: 12px;font-weight: 400;margin-bottom: 0;">Total Price:<b> €${data.price}<b/></p></div> </div> </body> </html>`;
}
exports.giftReceiverNotificationContent = (data, lang ='en') =>{
    if(lang ==='el'){
        return `Η/Ο ${data.fullName} σας έχει στείλει μια δωροκάρτα MYNT με ένα ποσό των  €${data.amount}! Εξαργύρωσετε το δώρο σας και κλείστε μία υπηρεσία ΜΥΝΤ!`;
    }
    return `${data.fullName} has sent you a MYNT Gift Card for €${data.amount}. You can now reedem your gift and book a MYNT service!`;
}