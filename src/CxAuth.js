let spawn = require('child_process').spawn;
let CxScanConfig = require('./CxScanConfig.js');
let loc = "cx.exe ";
let prc = null;
let scanCreate = function(cxScanConfig) {

    if(cxScanConfig != null) {
        var params = ['scan','create','-v','--format','json'];
        if(cxScanConfig.baseuri != null) {
            params.push('--base-uri');
            params.push(cxScanConfig.baseuri)
        }
        if(cxScanConfig.token != null) {
            params.push('--token');
            params.push(cxScanConfig.token);
        }
        else if(cxScanConfig.key != null && cxScanConfig.secret != null) {
            params.push('--client-id');
            params.push(cxScanConfig.key);
            params.push('--secret');
            params.push(cxScanConfig.secret);
        }
        else {
            console.log("Did not receive KEY/SECRET/TOKEN");
        }

        if(cxScanConfig.paramMap != null) {
            for(let indKey of cxScanConfig.paramMap.keys()) {
                params.push(indKey);
                params.push(cxScanConfig.paramMap.get(indKey));
            }
        }

        prc = spawn(loc,params)
        //prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.log(lines.join(""));
        });

        prc.on('close', function (code) {
            console.log('process exit code ' + code);
        });
    }
    else {
        console.log("Pass the Cx Scan Config object");
    }

}

// let paramMap = new Map();
// paramMap.set("--project-name","JSScanTest");
// paramMap.set("--project-type","sast");
// paramMap.set("--preset-name","Checkmarx Default");
// paramMap.set("-d",".");
// scanCreate(scanConfig);