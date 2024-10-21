import { Client } from "@concurrent-world/client";
import { lookupEnvVar } from "./utils.ts";
import { Timelines } from "./consts.ts";

/* c1-1: サブキーからClientインスタンスを作成し、自分のユーザデータを表示 */
const subkey = lookupEnvVar("CONCRNT_SUBKEY_MAIN");
const client = await Client.createFromSubkey(subkey);

export function c1_1_showMyUserData() {
  console.log("CCID:", client.ccid);
  console.log("プロフィール:", client.user?.profile);
  console.log("所属ドメイン:", client.user?.domain);
  console.log("登録日時:", client.user?.cdate);
}

/* c1-2: カレント(投稿)する */
export async function c1_2_createCrnt() {
  await client.createMarkdownCrnt("Hello, **Concrnt** world!", [
    // 自分のホームタイムライン
    client.user!.homeTimeline,
    // テスト用のコミュニティタイムライン
    Timelines.TESTING,
  ]);
}


/* c1-3a: カレントを取得する */
// 適当な投稿のMessage IDとその投稿主のCCIDを調べて、ここにペースト
const TARGET_MESSAGE_ID: string = "m...";
const TARGET_AUTHOR_CCID: string = "con1...";

export async function c1_3a_getCrnt() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, TARGET_AUTHOR_CCID);
  console.log(target);
}

/* c1-3b: カレントをふぁぼる */
export async function c1_3b_favoriteCrnt() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, TARGET_AUTHOR_CCID);
  if (target == null) {
    throw new Error("投稿が見つかりませんでした");
  }

  await target.favorite();
}

/* c1-3c: カレントに絵文字リアクションをつける */
export async function c1_3c_reactToCrnt() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, TARGET_AUTHOR_CCID);
  if (target == null) {
    throw new Error("投稿が見つかりませんでした");
  }

  await target.reaction(
    "fox_face",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98a.svg",
  );
}

/* c1-3d: カレントにリプライする */
export async function c1_3d_replyToCrnt() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, TARGET_AUTHOR_CCID);
  if (target == null) {
    throw new Error("投稿が見つかりませんでした");
  }

  await target.reply([client.user!.homeTimeline, Timelines.TESTING], "こん〜");
}

/* c1-3e: カレントをリルートする */
export async function c1_3e_rerouteCrnt() {
  const target = await client.getMessage(TARGET_MESSAGE_ID, TARGET_AUTHOR_CCID);
  if (target == null) {
    throw new Error("投稿が見つかりませんでした");
  }

  await target.reroute([client.user!.homeTimeline, Timelines.TESTING]);
}

/* c1-4a: タイムラインを購読する(不完全版) */
export async function c1_4a_subscribeTLIncomplete() {
  const sub = await client.newSubscription();
  sub.on("MessageCreated", (ev) => {
    console.log("New Message!");
    console.log(ev);
  });
  sub.on("AssociationCreated", (ev) => {
    console.log("New Association!");
    console.log(ev);
  });
  await sub.listen([Timelines.TESTING]);
}

/* c1-4b: タイムラインを購読する(不完全版) */
export async function c1_4b_subscribeTLComplete() {
  const sub = await client.newSubscription();
  sub.on("MessageCreated", (ev) => {
    console.log("New Message!");
    console.log(ev);
  });
  sub.on("AssociationCreated", (ev) => {
    console.log("New Association!");
    console.log(ev);
  });
  await sub.listen([Timelines.TESTING, client.user!.associationTimeline]);
}
