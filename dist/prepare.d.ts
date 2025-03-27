import { PrepareContext } from "semantic-release";
import { RawPluginConfig } from "./types/pluginConfig";
export declare function prepare(rawConfig: RawPluginConfig, context: PrepareContext): Promise<void>;
