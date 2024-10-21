import { Client } from "@concurrent-world/client";
import { Schemas } from "@concurrent-world/client";
import { lookupEnvVar } from "./utils.ts";

const subkey = lookupEnvVar("CONCRNT_SUBKEY_MAIN");
const client = await Client.createFromSubkey(subkey);

// 適当な自分の投稿のMessage IDを調べて、ここにペースト
const TARGET_MESSAGE_ID = "m...";

/* c3-3a: 「ふぁぼを送るユーザの`associationTimeline`」を除外 */
export async function c3_3a_favoriteWithExcludingAssocTL() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, client.ccid!);
  if (target == null) {
    throw new Error("投稿が見つかりませんでした");
  }

  await client.api.createAssociation(
    Schemas.likeAssociation,
    {},
    target.id,
    client.ccid!, // 自分の投稿が対象なので、Associationのownerにも自分のCCIDを指定
    [client.user!.notificationTimeline],
  );
}

/* c3-3b: 「ふぁぼ対象の投稿者の`notificationTimeline`」を除外 */
export async function c3_3b_favoriteWithExcludingNotifyTL() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, client.ccid!);
  if (target == null) {
    throw new Error("投稿が見つかりませんでした");
  }

  await client.api.createAssociation(
    Schemas.likeAssociation,
    {},
    target.id,
    client.ccid!,
    [client.user!.associationTimeline],
  );
}
