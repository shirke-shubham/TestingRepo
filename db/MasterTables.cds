namespace DEALER_PORTAL_MASTER;

entity STATUS_MASTER {
    key STATUS         : Integer;
    STATUS_DESCRIPTION : String(30);
 
}

entity APPROVER_ROLE_MASTER {
    key APPROVER_ROLE : String(50);
    ROLE_DESCRIPTION  : String(100);
}

entity GRN_STATUS_MASTER {
    key STATUS         : Integer;
    STATUS_DESCRIPTION : String(20);
}

