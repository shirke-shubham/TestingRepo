
const cds = require("@sap/cds");

exports.ResponseHandler = async function (req, code, status, oResponse) {

            switch (status) {

                case 'success':
                    req.reply({code, oResponse});
                    break;

                case 'error':
                    req.error(code, oResponse);
                    break;
            }
}