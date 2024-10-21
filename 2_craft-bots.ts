import { Client, Message } from "@concurrent-world/client";
import { Timelines } from "./consts.ts";
import {
  fetchRandomFoxImgURL,
  FOX_FACE_EMOJI_IMG_URL,
  isMessage,
  isReplyMessage,
  lookupEnvVar
} from "./utils.ts";

const botSubkey = lookupEnvVar("CONCRNT_SUBKEY_BOT");
const client = await Client.createFromSubkey(botSubkey);

/* c2-1: 定期投稿Bot */
export function c2_1_runPeriodicCrntBot() {
  const createCrnt = async () => {
    const foxImgURL = await fetchRandomFoxImgURL();
    client.createMediaCrnt("Random Fox🦊", [
      Timelines.TESTING,
      client.user!.homeTimeline,
    ], {
      medias: [{
        mediaType: "image/jpeg",
        mediaURL: foxImgURL,
      }],
    });
  };

  setInterval(createCrnt, 60 * 1000);
}

/* c2-2: 特定のキーワードを含むカレントに自動でリアクション */
const KEYWORDS_TO_REACT = ["こん", "コン", "con"];

export async function c2_2_runAutoReactionBot() {
  const sub = await client.newSubscription();
  sub.on("MessageCreated", async (ev) => {
    const message = ev.resource;
    if (message === undefined || !isMessage(message)) {
      return;
    }

    const content = message.document.body.body;
    console.log(content);
    if (
      !!content &&
      KEYWORDS_TO_REACT.some((keyword) => content.includes(keyword))
    ) {
      console.log("キーワードを含む投稿を受信:", content);
      const msg = new Message(client, message);
      await msg.reaction("fox_face", FOX_FACE_EMOJI_IMG_URL);
    }
  });

  sub.listen([Timelines.TESTING]);
}

/* c2-3: 自分宛のリプライに自動返信 */
export async function c2_3_runAutoReplyBot() {
  const sub = await client.newSubscription();
  sub.on("MessageCreated", async (ev) => {
    const message = ev.resource;
    if (
      message === undefined || !isMessage(message) || !isReplyMessage(message)
    ) {
      return;
    }

    if (message.document.body.replyToMessageAuthor === client.ccid) {
      console.log(message.document.body);
      const replyMsgApi = new Message(client, message);
      const replyer = await replyMsgApi.getAuthor();
      console.log(replyer);
      const replyerName = replyer.profile?.username ?? "名無し";

      await replyMsgApi.reply(
        [client.user!.homeTimeline, Timelines.TESTING],
        `${replyerName}さん、こんにちは🦊`,
      );
    }
  });

  sub.listen([Timelines.TESTING]);
}
