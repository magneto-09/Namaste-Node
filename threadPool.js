const crypto = require('crypto')

crypto.pbkdf2('secret', 'salt', 1000000, 64, 'sha512', () => console.log("Call-1")) 

crypto.pbkdf2('secret', 'salt', 1000000, 64, 'sha512', () => console.log("Call-2")) 

crypto.pbkdf2('secret', 'salt', 1000000, 64, 'sha512', () => console.log("Call-3")) 

crypto.pbkdf2('secret', 'salt', 1000000, 64, 'sha512', () => console.log("Call-4")) 

crypto.pbkdf2('secret', 'salt', 1000000, 64, 'sha512', () => console.log("Call-5")) 



