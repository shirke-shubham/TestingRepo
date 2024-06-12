var cds = require("@sap/cds");
var hdbext = require("@sap/hdbext");
var dbClass = require("sap-hdbext-promisfied");

module.exports = cds.service.impl(async function (req) {

    var client = await dbClass.createConnectionFromEnv();
    var dbconn = new dbClass(client);
    var connection = await cds.connect.to("db");
    var output;
    // BY SHUBHAM
    this.on('grnAccept', async (req) => {
        try {

            var {
                action,
                appType,
                grnHeader,
                grnItems,
                grnEvent,
            } = req.data;

            if (action === "ACCEPT") {

                if (grnHeader === null || grnHeader[0].DISTRIBUTOR_ID === null) {
                    throw "Invalid Payload";
                }

                for (var i = 0; i < grnItems.length; i++) {
                    grnItems[i].ITEM_NO = i + 1;
                }

                var price = 0;

                for (var i = 0; i < grnItems.length; i++) {
                    const MatDetails = await SELECT`MATERIAL_GROUP, MATERIAL_CODE, MATERIAL_STOCK, UNIT_PRICE`.from`DEALER_PORTAL_GRN_STOCK`.where`MATERIAL_GROUP=${grnItems[i].MATERIAL_GROUP} AND MATERIAL_CODE=${grnItems[i].MATERIAL_CODE} AND DISTRIBUTOR_ID=${grnHeader[i].DISTRIBUTOR_ID}`;  
                    if (MatDetails.length > 0) {
                        var existStock = MatDetails[0].MATERIAL_STOCK;
                        var invoiceStock = grnItems[i].ACCEPTED_QUANTITY;
                        var updatedStock = existStock + invoiceStock;
                        var unit_Price = grnItems[i].UNIT_PRICE;
                        
                        if(MatDetails[0].UNIT_PRICE < unit_Price){
                            price = grnItems[i].UNIT_PRICE;
                        }
                        else{
                            price = MatDetails[0].UNIT_PRICE;
                        }
                        await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.set`UNIT_PRICE=${price}`.where`MATERIAL_GROUP=${grnItems[i].MATERIAL_GROUP} AND MATERIAL_CODE=${grnItems[i].MATERIAL_CODE} AND DISTRIBUTOR_ID=${grnHeader[i].DISTRIBUTOR_ID}`;  
                    }
                    else {

                        await INSERT.into('DEALER_PORTAL_GRN_STOCK').entries({
                            MATERIAL_GROUP: grnItems[i].MATERIAL_GROUP,
                            MATERIAL_GROUP_DESC: grnItems[i].MATERIAL_GROUP_DESC, MATERIAL_CODE: grnItems[i].MATERIAL_CODE,
                            MATERIAL_DESC: grnItems[i].MATERIAL_DESC, UNIT_PRICE : grnItems[i].UNIT_PRICE, UPDATED_PRICE : null,
                            MATERIAL_STOCK: grnItems[i].ACCEPTED_QUANTITY, UPDATED_DATE: null, STATUS: 3 
                        })
                    }  
                }

                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'GRN_ACCEPTANCE');
                var output = await dbconn.callProcedurePromisified(sp, [action, appType, grnItems[0].INVOICE_NO, grnHeader, grnItems, grnEvent]);
                var Result = output.outputScalar;

                Result = {
                    OUT_SUCCESS: output.outputScalar.OUT_SUCCESS
                }
                return Result;

            } 
            
        }
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });


    this.on('updateGrnPrice', async (req) => {
        try {
                var {
                    action,
                    appType,
                    updPriceDetails 
                } = req.data;

                var ErrMaterialCode = updPriceDetails[0].MATERIAL_CODE;
                var ErrLogsUserId = Event[0].USER_ID;
                var ErrLogsUserRole = Event[0].USER_ROLE;
                var ErrLogsAppName = "UPDATE STOCK_PRICE";
    
                var curTime = await SELECT`CURRENT_TIMESTAMP`.from`DUMMY`;
                var currentTime = curTime[0].CURRENT_TIMESTAMP;
    
                await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`UPDATED_PRICE=${updPriceDetails[0].UPDATED_PRICE}`.set`UPDATED_DATE=${currentTime}`.set`STATUS=${4}`.where`MATERIAL_GROUP=${updPriceDetails[0].MATERIAL_GROUP} AND MATERIAL_CODE=${updPriceDetails[0].MATERIAL_CODE}`;
                return "Success";
            }

        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });
           
})