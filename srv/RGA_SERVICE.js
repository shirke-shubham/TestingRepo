var cds = require("@sap/cds");
var hdbext = require("@sap/hdbext");
var dbClass = require("sap-hdbext-promisfied");
var sHANDLER = require("./LIB/Handler");
// var error_log = require("./LIB/Error_Logs");
// var { error } = require("console");


module.exports = cds.service.impl(async function (req) {

    var client = await dbClass.createConnectionFromEnv();
    var dbconn = new dbClass(client);
    var connection = await cds.connect.to("db");
    var output;

    this.on('RGA_PROCESS', async (req) => {
        try {
            var { 
                action,
                appType,
                rgHeader,
                rgItems,
                rgEvent,
            } = req.data;
            var sAction = action || null;

            if (sAction === "CREATE") {

                var approvelLevel = rgHeader[0].APPROVER_LEVEL;
                var approverRole = rgHeader[0].APPROVER_ROLE;

                //To deduct return qty from particular stock qty.
                var invoiceNo,itemCode,returnQty, matCode, updatedStock;
                for (let i=0; i<rgItems.length; i++){
                    
                    itemCode = rgItems[i].ITEM_CODE;
                    returnQty = rgItems[i].RETURN_QUANTITY;
                    matCode = await SELECT `MATERIAL_STOCK`.from `DEALER_PORTAL_GRN_STOCK` .where `MATERIAL_CODE=${itemCode}`;
                    updatedStock = matCode[0].MATERIAL_STOCK - returnQty;

                    await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.where`MATERIAL_CODE=${itemCode}`;

                }
                
                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_CREATE');
                var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, approvelLevel, approverRole, rgHeader, rgItems, rgEvent]);
                var message = output.outputScalar.OUT_SUCCESS;

                if (message !== null) {
                    await sHANDLER.ResponseHandler(req, 200, "success", message);
                    // req.reply("SUCCESS");
                }

            } else if (sAction === "APPROVE") {

                var rgaNo = rgHeader[0].RGA_NO;
                var approverRole = rgHeader[0].APPROVER_ROLE;
                var approvelLevel = rgHeader[0].APPROVER_LEVEL;

                var max_Length = 3;
                if (approvelLevel < max_Length) {
                    sAction = 'APPROVE_PENDING';
                    var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_APPROVE_REJECT');
                    var rgaNo = rgHeader[0].RGA_NO;
                    var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, rgaNo, approvelLevel, approverRole, rgHeader, rgItems, rgEvent]);
  
                }
                else if (approvelLevel === max_Length) {
                    sAction = 'APPROVE';
                    var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_APPROVE_REJECT');
                    var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, rgaNo, approvelLevel, approverRole, rgHeader, rgItems, rgEvent]);
                }
                else {
                    req.reply("Invalid Approver");
                }
                var message = output.outputScalar.OUT_SUCCESS;

                if (message !== null) {
                    await sHANDLER.ResponseHandler(req, 200, "success", message);
                }

            }
            else if (sAction === "REJECT") {

                var rgaNo = rgHeader[0].RGA_NO;
                var approverRole = rgHeader[0].APPROVER_ROLE;
                var approvelLevel = rgHeader[0].APPROVER_LEVEL;

                //To add rejected qty to particular stock qty.
                var invoiceNo,itemCode,returnQty, matCode, updatedStock;
                for (let i=0; i<rgItems.length; i++){
                    
                    itemCode = rgItems[i].ITEM_CODE;
                    returnQty = rgItems[i].RETURN_QUANTITY;
                    matCode = await SELECT `MATERIAL_STOCK`.from `DEALER_PORTAL_GRN_STOCK` .where `MATERIAL_CODE=${itemCode}`;
                    updatedStock = matCode[0].MATERIAL_STOCK + returnQty;

                    await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.where`MATERIAL_CODE=${itemCode}`;
                }
                
                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_APPROVE_REJECT');
                var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, rgaNo, approvelLevel, approverRole, rgHeader, rgItems, rgEvent]);
                var message = output.outputScalar.OUT_SUCCESS;

                if (message !== null) {
                    await sHANDLER.ResponseHandler(req, 200, "success", message);
                }

            }
        }
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code || 500;
            var Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message || error
            };
            // await error_log.errorFetcher(req.event, sType, iErrorCode, Result.OUT_ERROR_MESSAGE);
            await sHANDLER.ResponseHandler(req, 404, "error", error.message);

        }

    })
})
    

//         getEmailContent: async function (connection, sAction, sAppType, oEmailData, iStatus) {

//             var mailid, Emailbody, Emailbody1, subject, msg;

//             var oEmailContent = {
//                 "subject": null,
//                 "emailBody": null
//             };

//             var sDetails = await lib_email.getSubaccountDetais(connection);
//             if (sDetails === null) {
//                 throw "Subaccount & Portal details missing for email"
//             }

//             var aEmailIds = await lib_email.getEmailContactId(connection);
//             if (aEmailIds === null) {
//                 throw "Contact email id is missing in master"
//             }
//             var sClientContactEmail = aEmailIds.CONTACT_ID_1;

//             var sClientName = aEmailIds.CLIENT_FULL_NAME;
//             var sClientShortName = aEmailIds.CLIENT_SHORT_NAME;

//             var sLink_Portal_GuestAccess = sDetails.PORTAL_LINK;
//             var sLink_Portal_LoginAccess = sDetails.PORTAL_LINK;

//             var sLink_Registation_Form = sLink_Portal_GuestAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_registration_form-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealregistrationform&/Login";

//             var greetingsTo;
//             var linkcontent;
//             var sRows = "";
//             if (sAppType === "RGA_REQUEST") {

//                 if (sAction === "CREATE") {

//                     Emailbody = "Dear Approver," + "<br><br>";
//                     var link = sLink_Portal_LoginAccess;
//                     // + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);
//                     oEmailContent.emailBody = "RGA request no. " + oEmailData.RgaReqNo +
//                         " has been created and currently pending for your approval." + "<br>" + "<br>" +
//                         "Please click " + "<a href=" + link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
//                         "<br>" + "<br>" +
//                         "Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
//                         sClientContactEmail +
//                         "</a>" + "<br>" +
//                         "<br>" +
//                         "Regards," + "<br>" +
//                         "Distributor Management Team" +
//                         "<br><br>";

//                     oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
//                     oEmailContent.subject = "Payment Request Created";
//                 }

//             }
//             if (sAppType === "PAYMENT_REQUEST") {
//                 if (sAction === "CREATE") {

//                     Emailbody = "Dear Approver," + "<br><br>";
//                     var link = sLink_Portal_LoginAccess;
//                     // + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);
//                     oEmailContent.emailBody = "Payment request no. " + oEmailData.PayReqNo +
//                         " has been created and currently pending for your approval." + "<br>" + "<br>" +
//                         "Please click " + "<a href=" + link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
//                         "<br>" + "<br>" +
//                         "Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
//                         sClientContactEmail +
//                         "</a>" + "<br>" +
//                         "<br>" +
//                         "Regards," + "<br>" +
//                         "Distributor Management Team" +
//                         "<br><br>";

//                     oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
//                     oEmailContent.subject = "Payment Request Created";
//                 }
//                 else if (sAction === "APPROVE_PENDING") {

//                     var link = sLink_Portal_LoginAccess;
//                     // + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);

//                     oEmailContent.subject = "Payment Request Approved";
//                     oEmailContent.emailBody = "Payment Request No " + oEmailData.PayReqNo +
//                         " has been approved by " + oEmailData.Approve_Role + " " + oEmailData.Approver + " and is currently pending for your approval." + "<br>" + "<br>" +
//                         "Please click " + "<a href=" + link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
//                         "<br>" + "<br>" +
//                         "Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
//                         sClientContactEmail +
//                         "</a>" + "<br>" +
//                         "<br>" +
//                         "Regards," + "<br>" +
//                         "Distributor Management Team" +
//                         "<br><br>";

//                     Emailbody = "Dear Approver," + "<br><br>";
//                     oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
//                         oEmailContent.emailBody + "</p>";
//                 }
//                 else if (sAction === "APPROVE") {
//                     oEmailContent.subject = "Payment Request Approved";
//                     oEmailContent.emailBody = "Payment Request No " + oEmailData.PayReqNo +
//                         " has been approved by " + oEmailData.Approve_Role + " " + oEmailData.Approver + "<br>" + "<br>" +
//                         "Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
//                         sClientContactEmail +
//                         "</a>" + "<br>" +
//                         "<br>" +
//                         "Regards," + "<br>" +
//                         "Distributor Management Team" +
//                         "<br><br>";

//                     Emailbody = "Dear Approver," + "<br><br>";
//                     oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
//                         oEmailContent.emailBody + "</p>";
//                 }

//             }

//         }
// })