import { CxInstaller } from "../main/osinstaller/CxInstaller";
import { anyString, mock, instance, when, verify } from "ts-mockito";
import { HttpClient } from "../main/client/HttpClient";

const clientMock = mock(HttpClient);
const clientMockInstance = instance(clientMock);

const cxInstallerLinux = new CxInstaller("linux", clientMockInstance);
const cxInstallerMac = new CxInstaller("darwin", clientMockInstance);
const cxInstallerWindows = new CxInstaller("win32", clientMockInstance);

describe("CxInstaller cases", () => {
    it('CxInstaller getDownloadURL Linux Successful case', async () => {
        const url = await cxInstallerLinux.getDownloadURL();
        const architecture = getArchitecture(cxInstallerLinux.getPlatform());
        expect(url).toBe(`https://download.checkmarx.com/CxOne/CLI/2.2.5/ast-cli_2.2.5_linux_${architecture}.tar.gz`);
    });

    it('CxInstaller getDownloadURL Mac Successful case', async () => {
        const url = await cxInstallerMac.getDownloadURL();
        const architecture = getArchitecture(cxInstallerMac.getPlatform());
        expect(url).toBe(`https://download.checkmarx.com/CxOne/CLI/2.2.5/ast-cli_2.2.5_darwin_${architecture}.tar.gz`);
    });

    it('CxInstaller getDownloadURL Windows Successful case', async () => {
        const url = await cxInstallerWindows.getDownloadURL();
        const architecture = getArchitecture(cxInstallerWindows.getPlatform());
        expect(url).toBe(`https://download.checkmarx.com/CxOne/CLI/2.2.5/ast-cli_2.2.5_windows_${architecture}.zip`);
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
        // Set up mock behavior
        when(clientMock.downloadFile(anyString(), anyString())).thenResolve();

        // Trigger the download
        await cxInstallerWindows.downloadIfNotInstalledCLI();
    });

    it('CxInstaller checkExecutableExists Windows Successful case', () => {
        const exists = cxInstallerWindows.checkExecutableExists();
        expect(exists).toBe(false);

        // Verify if downloadFile was called with the expected arguments
        verify(clientMock.downloadFile(anyString(), anyString())).called();
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
