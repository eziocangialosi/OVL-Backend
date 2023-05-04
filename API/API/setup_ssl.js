const debug = require('./debug') // Debug function.
const express = require('express');
const app = express();
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.listen(80, () => {
  debug.Print('Node.JS SSL Setup server now listening on port 80, please follow the cerbot instructions and make sure you can access the server outside your network.');
  debug.Print("For more information please visit https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca");
});