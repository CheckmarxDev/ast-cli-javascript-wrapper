export interface Client {
    /**
     * Downloads a file from the given URL and saves it to the specified output path.
     *
     * @param url - The URL to download the file from.
     * @param outputPath - The path where the downloaded file will be saved.
     * @throws An error if the download fails.
     */
    downloadFile(url: string, outputPath: string): Promise<void>;
    getProxyConfig(): any;
}
