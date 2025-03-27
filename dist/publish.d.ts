import { PublishContext } from "semantic-release";
import { RawPluginConfig } from "./types/pluginConfig";
export declare const publish: (rawConfig: RawPluginConfig, context: PublishContext) => Promise<void>;
