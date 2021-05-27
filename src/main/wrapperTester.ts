import {CxScanConfigCall} from './CxScanConfigCall';
import {CxAuthCall} from './CxAuthCall';
import {CxParamType} from './CxParamType';

let cxScanConfig = new CxScanConfigCall();
cxScanConfig.baseUri = "https://eu.ast.checkmarx.net";
cxScanConfig.clientId = "ast-github-action";
let params: Map<CxParamType,string> = new Map<CxParamType,string>();
params.set(CxParamType.PROJECT_NAME,"JayWrapperTest");
params.set(CxParamType.SCAN_TYPES,"sast");
params.set(CxParamType.ADDITIONAL_PARAMETERS,"--nowait");
params.set(CxParamType.SAST_PRESET_NAME,"Checkmarx Default");
params.set(CxParamType.S,".");
const auth = new CxAuthCall(cxScanConfig);
//const result = auth.scanCreate(params).then(value => {console.log("Resolved value*****: " + value + " **********")});
//const result = auth.scanShow("8f777b95-18a9-408b-81f1-623e647527df").then( value => { console.log("Resolved value*****: " + value + " **********")});
const result = auth.scanList().then( value => { console.log("Resolved value*****: " + value + " **********")});
