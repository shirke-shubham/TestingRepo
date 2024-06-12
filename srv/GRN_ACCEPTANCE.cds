using {DEALER_PORTAL as DPPortal} from '../db/TransactionTables';
using {DEALER_PORTAL_MASTER as DPMaster} from '../db/MasterTables';

 
service IDEAL_GRN_ACCEPTANCE {
 
  // Header Table..  ...
       
    entity Grn_Header        as projection on DPPortal.GRN_HEADER;
    entity Grn_Items         as projection on DPPortal.GRN_ITEMS;
    entity Grn_Event_Logs    as projection on DPPortal.GRN_EVENT_LOGS;
    entity Grn_Status_Master as projection on DPMaster.GRN_STATUS_MASTER;
    entity Grn_Stock         as projection on DPPortal.GRN_STOCK;

    //when distributor accepts grn from vendor into his sytem
    action grnAccept( action : String, appType : String, grnHeader : many Grn_Header, grnItems :many Grn_Items, grnEvent : many Grn_Event_Logs ) returns String;
    // When distributor wants to update the price of the materials 
    action updateGrnPrice( appType : String, updPriceDetails : many Grn_Stock) returns String; 
}
    