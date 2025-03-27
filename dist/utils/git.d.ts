import { ExecLogger } from "./exec";
export interface CloneOptions {
    domain: string;
    user: string;
    keyContents: string;
    repo: string;
}
export interface CommitOptions {
    message: string;
    paths: string[];
}
export declare class Git {
    private tmp;
    private logger;
    constructor(tmp: string, logger: ExecLogger);
    getCloneDirectory(repo: string): string;
    clone(options: CloneOptions): Promise<string>;
    diff(): Promise<void>;
    commit(options: CommitOptions): Promise<void>;
    push(): Promise<void>;
    private mkdir_p;
}
