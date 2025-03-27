export interface ExecLogger {
    log: (fmt: string, arg?: string) => void;
    error: (fmt: string, arg?: string) => void;
}
export declare function exec(cmd: string, args: string[], logger: ExecLogger): Promise<number>;
export declare function execThrow(cmd: string, args: string[], logger: ExecLogger): Promise<void>;
