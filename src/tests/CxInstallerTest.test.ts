import { CxInstaller } from "../main/osinstaller/CxInstaller";
import { anyString, mock, instance, when, verify } from "ts-mockito";
import { AstClient } from "../main/client/AstClient";

// Mock AstClient and set up an instance from it
const astClientMock = mock(AstClient);
const astClientInstance = instance(astClientMock);

// Create CxInstaller instances with the mocked AstClient
const cxInstallerLinux = new CxInstaller("linux", astClientInstance);
const cxInstallerMac = new CxInstaller("darwin", astClientInstance);
const cxInstallerWindows = new CxInstaller("win32", astClientInstance);

describe("CxInstaller cases", () => {
    it('CxInstaller getDownloadURL Linux Successful case', async () => {
        const url = await cxInstallerLinux.getDownloadURL();
        const version = await cxInstallerLinux.readASTCLIVersion();
        const architecture = getArchitecture(cxInstallerLinux.getPlatform());
        expect(url).toBe(`https://download.checkmarx.com/CxOne/CLI/${version}/ast-cli_${version}_linux_${architecture}.tar.gz`);
    });

    it('CxInstaller getDownloadURL Mac Successful case', async () => {
        const url = await cxInstallerMac.getDownloadURL();
        const version = await cxInstallerLinux.readASTCLIVersion();
        const architecture = getArchitecture(cxInstallerMac.getPlatform());
        expect(url).toBe(`https://download.checkmarx.com/CxOne/CLI/${version}/ast-cli_${version}_darwin_${architecture}.tar.gz`);
    });

    it('CxInstaller getDownloadURL Windows Successful case', async () => {
        const url = await cxInstallerWindows.getDownloadURL();
        const version = await cxInstallerLinux.readASTCLIVersion();
        const architecture = getArchitecture(cxInstallerWindows.getPlatform());
        expect(url).toBe(`https://download.checkmarx.com/CxOne/CLI/${version}/ast-cli_${version}_windows_${architecture}.zip`);
    });
});

describe("CxInstaller getExecutablePath cases", () => {
    it('CxInstaller getExecutablePath Linux Successful case', () => {
        const executablePath = cxInstallerLinux.getExecutablePath();
        expect(executablePath).toContain(`src/main/wrapper/resources/cx`);
    });

    it('CxInstaller getExecutablePath Mac Successful case', () => {
        const executablePath = cxInstallerMac.getExecutablePath();
        expect(executablePath).toContain(`src/main/wrapper/resources/cx`);
    });

    it('CxInstaller getExecutablePath Windows Successful case', () => {
        const executablePath = cxInstallerWindows.getExecutablePath();
        expect(executablePath).toContain(`src/main/wrapper/resources/cx.exe`);
    });
});

describe("CxInstaller checkExecutableExists cases", () => {
    beforeAll(async () => {
        when(astClientMock.downloadFile(anyString(), anyString())).thenResolve(); // Set up mock behavior here
        await cxInstallerWindows.downloadIfNotInstalledCLI();
    });

    it('CxInstaller checkExecutableExists Windows Successful case', () => {
        verify(astClientMock.downloadFile(anyString(), anyString())).called();
    });
});

function getArchitecture(platform: string): string {
    if (platform !== 'linux') {
        return 'x64';
    }

    const archMap: Record<string, string> = {
        'arm64': 'arm64',
        'arm': 'armv6'
    };

    return archMap[process.arch] || 'x64';
}