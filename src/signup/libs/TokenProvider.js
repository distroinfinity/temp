
import * as PusherPushNotifications from "@pusher/push-notifications-web"
//import * as serviceWorker from "../serviceWorker";

export const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
    url: 'https://social.bestguru.trade/prod/pusher/beams-auth', 
  });
 
export const beamsClient = new PusherPushNotifications.Client({
    instanceId: '34337233-6d04-4e49-bd71-095a753504ac',
});
    