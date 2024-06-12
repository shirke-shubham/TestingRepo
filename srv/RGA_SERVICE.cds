using {DEALER_PORTAL as DPPortal} from '../db/TransactionTables';
using {DEALER_PORTAL_MASTER as DPMaster} from '../db/MasterTables';


service IDEAL_RGA_PROCESS {

  entity Rga_Header           as projection on DPPortal.RGA_HEADER;
  entity Rga_Items            as projection on DPPortal.RGA_ITEMS;
  entity Rga_Event_Logs       as projection on DPPortal.RGA_EVENT_LOGS;
  entity Status_Master        as projection on DPMaster.STATUS_MASTER;
  entity Approver_Role_Master as projection on DPMaster.APPROVER_ROLE_MASTER;
  
  action RGA_PROCESS(action : String, appType : String, rgHeader : many Rga_Header, rgItems : many Rga_Items, rgEvent : many Rga_Event_Logs) returns String;


}
