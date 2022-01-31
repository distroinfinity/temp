import stream from "getstream";
import config from "../config";


export function SetUser(userId, userToken, data) {
    const client = stream.connect(config.stream.KEY, userToken,
        config.stream.APP_ID);
    
    client.setUser(data);
}




