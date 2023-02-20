let sucessHtml = (data)=>{
    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>PAYMENT SUCESSFULL</h1> <br><br>
        <p>${data}</p>
    </body>
    </html>`
    return html;
}

let failHtml = (data)=>{
    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>PAYMENT FAILED</h1> <br><br>
        <p>${data}</p>
    </body>
    </html>`
    return html;
}

module.exports = {
    sucessHtml,
    failHtml
}
 