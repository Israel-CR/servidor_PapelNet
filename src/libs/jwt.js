const jwt = require('jsonwebtoken')

function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            'codigo secreto',
            {
                expiresIn: '1d',
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            })
    });

}


module.exports = createAccessToken