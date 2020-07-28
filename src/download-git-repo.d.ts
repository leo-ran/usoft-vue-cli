declare module "download-git-repo" {
    export default function download(
        repoPath: string,
        localPath: string,
        callback?: (e: Error) => void
    ): void;
}

declare module "port-used" {
    export function check(port: number, host?: string): Promise<boolean>;
    export function waitUntilFree(options: {
        //  port a valid TCP port number.
        port: number;
        //  The host name or IP address of the host. Default, if not defined: '127.0.0.1'
        host?: string;
        // [retryTime] the retry interval in ms. Default is 250ms.
        retryTime?: number;
        //  [timeout] the amount of time to wait until port is free. Default is 2000ms.
        timeout?: number;
   }): Promise<any>;
    export function waitUntilUsed(options: {
        //  port a valid TCP port number.
        port: number;
        //  The host name or IP address of the host. Default, if not defined: '127.0.0.1'
        host?: string;
        // [retryTime] the retry interval in ms. Default is 250ms.
        retryTime?: number;
        //  [timeout] the amount of time to wait until port is free. Default is 2000ms.
        timeout?: number;
    }): Promise<boolean>;
    export function waitForStatus(options: {
        //  port a valid TCP port number.
        port: number;
        //  The host name or IP address of the host. Default, if not defined: '127.0.0.1'
        host?: string;
        // A boolean describing the condition to wait for in terms of "in use."
        // True indicates wait until the port is in use. False indicates wait until the port is free.
        inUse?: boolean;
        // [retryTime] the retry interval in ms. Default is 250ms.
        retryTime?: number;
        //  [timeout] the amount of time to wait until port is free. Default is 2000ms.
        timeout?: number;
    }): Promise<boolean>;
}