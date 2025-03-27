import { BaseContext } from "semantic-release";
import { RawPluginConfig } from "./types/pluginConfig";
export declare function verifyConditions(_config: RawPluginConfig, { logger }: BaseContext): Promise<void>;
