import type { CoreAssociation, CoreMessage } from "@concurrent-world/client";
import { Schemas } from "@concurrent-world/client";

export const FOX_FACE_EMOJI_IMG_URL =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98a.svg";

export function lookupEnvVar(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`環境変数 '${key}' が設定されていません`);
  }
  return value;
}

export async function fetchRandomFoxImgURL(): Promise<string> {
  const resp = await fetch("https://randomfox.ca/floof/");
  if (!resp.ok) {
    throw new Error("Random fox API request failed");
  }
  const { image } = await resp.json() as { image: string };
  return image;
}

export function isMessage(
  resource: CoreMessage<any> | CoreAssociation<any>,
): resource is CoreMessage<any> {
  return resource.id.startsWith("m");
}

export function isReplyMessage(
  message: CoreMessage<any>,
): message is CoreMessage<ReplyMessageSchema> {
  return message.schema === Schemas.replyMessage;
}

export function isAssociation(
  resource: CoreMessage<any> | CoreAssociation<any>,
): resource is CoreAssociation<any> {
  return resource.id.startsWith("a");
}

/* type shims */
interface ReplyMessageSchema {
  replyToMessageId: string;
  replyToMessageAuthor: string;
  body: string;
  emojis?: {
    [k: string]: {
      imageURL?: string;
      animURL?: string;
    };
  };
  profileOverride?: {
    username?: string;
    avatar?: string;
    description?: string;
    link?: string;
    profileID?: string;
  };
}
