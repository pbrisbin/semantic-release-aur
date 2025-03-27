export interface RawPluginConfig {
    tempDirectory?: string;
    packageName?: string;
    pushPrerelease?: boolean;
}
export type PluginConfig = {
    tempDirectory: string;
    packageName: string;
    pushPrerelease: boolean;
};
export declare function defaultConfig(raw: RawPluginConfig): PluginConfig;
