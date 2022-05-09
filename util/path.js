<<<<<<< HEAD
const path = require('path');

module.exports = path.dirname(process.mainModule.filename);
=======
const path= require('path');
module.exports = path.dirname(require.main.filename);
>>>>>>> 15adfbc6063721a2d5c5f399e90d42c2f1883228
