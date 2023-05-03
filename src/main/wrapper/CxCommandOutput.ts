export class CxCommandOutput {
    exitCode: number;
    payload: any[];
    status: string;

    public buildOutputForProcess(code:number,stderr:string){
        this.exitCode=code;
        if(stderr){
            this.status = stderr;
        }
    }
}