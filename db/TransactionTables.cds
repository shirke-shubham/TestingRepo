using {DEALER_PORTAL_MASTER as DPMaster, MASTER_PAYMENT_STATUS} from '../db/MasterTables';

context DEALER_PORTAL{

   entity RGA_HEADER {

     key RGA_NO          :Integer64;
      DISTRIBUTOR_ID      :String(100);
      DISTRIBUTOR_NAME    :String(100);
      DISTRIBUTOR_REASON  :String(100);
      STATUS              :Integer;
      APPROVER_LEVEL      :Integer;
      APPROVER_ROLE       :String(50); 
      BU_CODE             :String(50);
      SAP_RETURN_CODE     :String(10);
      COMMENT             :String(200);
      CREATED_ON          :Timestamp;
      STATUS_REF          :Association to one DPMaster.STATUS_MASTER
                          on STATUS_REF.STATUS = STATUS;
      RGA_ITEMS_REF       :Association to many DEALER_PORTAL.RGA_ITEMS
                          on RGA_ITEMS_REF.RGA_NO = RGA_NO;   
      APPR_ROLE_REF       :Association to one DPMaster.APPROVER_ROLE_MASTER
                          on APPR_ROLE_REF.APPROVER_ROLE = APPROVER_ROLE;                 
   }

   entity RGA_ITEMS {

      key RGA_NO          :Integer64;
      key RGA_ITEM_NO     :Integer64;
      ITEM_CODE           :String(15);
      ITEM_DESCRIPTION    :String(1000);
      UNIT_OF_MEASURE     :String(3);
      BATCH               :String(15);
      EXPIRY_DATE         :Date; 
      SALEABLE            :String(1) ;
      INVOICE_NO          :String(15);
      INVOICE_DATE        :Date;
      INVOICE_QUANTITY    :Integer;
      PRICE               :Double;
      EXTENDED            :Double;
      RETURN_QUANTITY     :Integer;
      ACCEPTED_QUANTITY   :Integer;
      ACCEPTED_PRICE      :Double
   } 

   entity RGA_EVENT_LOGS {

      key RGA_NO         :Integer64;
      key EVENT_NO       :Integer;
      EVENT_CODE         :Integer;
      USER_ID            :String(100);
      USER_NAME          :String(50);
      USER_ROLE          :String(50) ;
      REMARK             :String(100);
      COMMENT            :String(100);
      CREATION_DATE      :Timestamp;
     
   }

   entity GRN_HEADER {
 
        DISTRIBUTOR_ID   : String(100);
        DISTRIBUTOR_NAME : String(100);
        DELIVERY_NO      : String(15);
    key INVOICE_NO       : String(15);
        INVOICE_DATE     : Date;
        DELIVERY_DATE    : Date;
        ACCEPTED_DATE    : Date;
        INVOICE_AMOUNT   : Double;
        STATUS           : Integer;
        SAP_ORDER_NO     : String(10);
        TO_ITEMS_REF     : Association to one DEALER_PORTAL.GRN_ITEMS
                               on TO_ITEMS_REF.INVOICE_NO = INVOICE_NO;
        TO_STATUS_REF    : Association to one DPMaster.GRN_STATUS_MASTER
                               on TO_STATUS_REF.STATUS = STATUS;
         
   }  

   entity GRN_ITEMS {

   key  INVOICE_NO          : String(15);
   key  ITEM_NO             : Integer;
        MATERIAL_GROUP      : String(50);
        MATERIAL_GROUP_DESC : String(100);
        MATERIAL_CODE       : String(50);
        MATERIAL_DESC       : String(100);
        HSN_CODE            : String(10);
        UNIT_OF_MEASURE     : String(3);
        UNIT_PRICE          : String(17);
        OPENING_STOCK       : String(10);
        QUANTITY            : Integer;
        ACCEPTED_QUANTITY   : Integer;
        REJECTED_QUANTITY   : Integer;
        CGST_PERC           : String(10);
        CGST_AMOUNT         : String(10);
        SGST_PERC           : String(10);
        SGST_AMOUNT         : String(10);
        IGST_PERC           : String(10);
        IGST_AMOUNT         : String(10);
        TAX_AMOUNT          : String(17);
        TOTAL_AMOUNT        : String(17);
      
   }   
 
  entity GRN_STOCK {
       
   key  MATERIAL_GROUP      : String(50);
        MATERIAL_GROUP_DESC : String(100);
   key  MATERIAL_CODE       : String(50);
        MATERIAL_DESC       : String(100); 
        UNIT_PRICE          : String(17);
        UPDATED_PRICE        : String(17);
      //   MARGIN_PERC         : Integer;
        MATERIAL_STOCK      : Integer;
        UPDATED_DATE        : Timestamp;
        STATUS              : Integer;
        TO_STATUS_REF       : Association to one DPMaster.GRN_STATUS_MASTER
                               on TO_STATUS_REF.STATUS = STATUS;

  }

//if the total quantity is 5, accepted quantity 3, rejected quantity should be 2 and opening stock is 3
   entity GRN_EVENT_LOGS {

    key INVOICE_NO : String(15);
    key EVENT_NO   : Integer;
        USER_ID    : String(100);
        USER_NAME  : String(50);
        USER_ROLE  : String(50);
        COMMENT    : String(200);
        CREATED_ON : Timestamp;

   }



   



}