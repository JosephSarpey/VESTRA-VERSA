const paypal = require("paypal-rest-sdk")

paypal.configure({
  mode: "sandbox",
  client_id:
    "AcFQhr1LzWpHUZuo2DtMfouP8b90hFybX15SH7bK7k77B4Tt4PPdniOYyYHNlbjZ-dbL3K95BAhilGLj",
  client_secret:
    "EOjvCB9MVFu7mCV9vJfm7LdJUpWWTcf7ljWyY2U3f8MXwUBzeZUxhvrZeWT9DLtZfv2z1PTQn14dhb47",
});

module.exports = paypal;
