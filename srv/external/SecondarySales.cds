/* checksum : e3f5f8b2032aa56716b5d88081e83394 */
@cds.external : true
action SecondarySales.registerRetailer(
  Action : LargeString,
  retailerDetails : many SecondarySales.RetailerDetails not null,
  retailerAddress : many SecondarySales.RetailerAddressDetail not null,
  retailerAttachments : many SecondarySales.RetailerAttachments not null
) returns LargeString;

@cds.external : true
action SecondarySales.pdcCreation(
  retailerPDC : many SecondarySales.RetailerPDC not null
) returns LargeString;

@cds.external : true
action SecondarySales.templateCreation(
  templateDetails : many SecondarySales.TemplateAttachments not null
) returns LargeString;

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.RetailerDetails {
  key DISTRIBUTOR_ID : String(10) not null;
  key RETAILER_ID : String(10) not null;
  RETAILER_NAME : String(50);
  NAME_OF_BANK : String(50);
  BANK_ACC_NO : String(20);
  IFSC_CODE : String(20);
  UPI_ID : String(30);
  REGISTERED_TAX_ID : String(15);
  PAN_NO : String(10);
  CREATION_DATE : Date;
  RETAILER_TYPE : Integer;
  BLOCKED : String(1);
  CHANGE_DATE : Date;
  RETAILER_CLASS : String(1);
  PAY_TERM : Integer;
  FIELD_1 : String(50);
  FIELD_2 : String(50);
  FIELD_3 : String(50);
  FIELD_4 : String(50);
  FIELD_5 : String(50);
  @cds.ambiguous : 'missing on condition?'
  TO_ADDRESS : Association to many SecondarySales.RetailerAddressDetail {  };
  @cds.ambiguous : 'missing on condition?'
  TO_RETAILER_TYPE : Association to one SecondarySales.RetailerTypeMaster on TO_RETAILER_TYPE.RETAILER_TYPE_ID = RETAILER_TYPE;
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.RetailerAttachments {
  key DISTRIBUTOR_ID : String(10) not null;
  key RETAILER_ID : String(10) not null;
  key FILE_ID : Integer not null;
  @Core.MediaType : FILE_MIMETYPE
  @odata.Type : 'Edm.Stream'
  @Core.ContentDisposition : {
    $Type: 'Core.ContentDispositionType',
    Filename: FILE_NAME
  }
  FILE_CONTENT : LargeBinary;
  @Core.IsMediaType : true
  FILE_MIMETYPE : String(100);
  FILE_TYPE : String(100);
  FILE_NAME : String(100);
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.RetailerPDC {
  key DISTRIBUTOR_ID : String(10) not null;
  key RETAILER_ID : String(10) not null;
  key PDC_ID : Integer64 not null;
  NAME_OF_BANK : String(20);
  CHEQUE_NUMBER : Integer;
  CREATION_DATE : Date;
  AMOUNT : Double;
  CURR_CODE : String(5);
  @cds.ambiguous : 'missing on condition?'
  TO_CURRENCY : Association to one SecondarySales.CountryMaster {  };
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.RetailerAddressDetail {
  key DISTRIBUTOR_ID : String(10) not null;
  key RETAILER_ID : String(10) not null;
  key SR_NO : Integer not null;
  ADDRESS_TYPE : String(15);
  MOBILE_NO : String(15);
  TELEPHONE_NO : String(15);
  EMAIL_ID : String(50);
  FAX_NO : String(15);
  CONTACT_PERSON : String(50);
  STREET_NO : String(100);
  ADDRESS_LINE_1 : String(200);
  ADDRESS_LINE_2 : String(200);
  ADDRESS_LINE_3 : String(200);
  COUNTRY : String(5);
  REGION : String(5);
  CITY : String(5);
  POSTAL_CODE : String(10);
  @cds.ambiguous : 'missing on condition?'
  TO_ADDRESS_TYPE : Association to one SecondarySales.AddressTypeMaster on TO_ADDRESS_TYPE.ADDRESS_TYPE = ADDRESS_TYPE;
  @cds.ambiguous : 'missing on condition?'
  TO_COUNTRY : Association to one SecondarySales.CountryMaster on TO_COUNTRY.COUNTRY_CODE = COUNTRY;
  @cds.ambiguous : 'missing on condition?'
  TO_REGION : Association to one SecondarySales.RegionMaster on TO_REGION.REGION_CODE = REGION;
  @cds.ambiguous : 'missing on condition?'
  TO_CITY : Association to one SecondarySales.CityMaster on TO_CITY.CITY_CODE = CITY;
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.CountryMaster {
  key COUNTRY_CODE : String(5) not null;
  COUNTRY_DESC : String(50);
  CURR_CODE : String(5);
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.CityMaster {
  key COUNTRY_CODE : String(5) not null;
  key REGION_CODE : String(5) not null;
  key CITY_CODE : String(5) not null;
  CITY_DESC : String(50);
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.RegionMaster {
  key COUNTRY_CODE : String(5) not null;
  key REGION_CODE : String(5) not null;
  REGION_DESC : String(50);
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.RetailerTypeMaster {
  key RETAILER_TYPE_ID : Integer not null;
  RETAILER_TYPE : String(100);
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.AddressTypeMaster {
  key ADDRESS_TYPE : String(15) not null;
  ADDRESS_DESC : String(30);
};

@cds.external : true
@cds.persistence.skip : true
entity SecondarySales.TemplateAttachments {
  key TEMPLATE_ID : Integer not null;
  TEMPLATE_NAME : String(100);
  @Core.MediaType : TEMPLATE_MIMETYPE
  @odata.Type : 'Edm.Stream'
  @Core.ContentDisposition : {
    $Type: 'Core.ContentDispositionType',
    Filename: TEMPLATE_NAME
  }
  TEMPLATE_CONTENT : LargeBinary;
  @Core.IsMediaType : true
  TEMPLATE_MIMETYPE : String(100);
  TEMPLATE_TYPE : String(100);
};

@cds.external : true
service SecondarySales {};

