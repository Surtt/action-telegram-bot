import {Context, Scenes} from "telegraf";

export interface MySceneSession extends Scenes.SceneSessionData {
    mySceneSessionProp: string;
}

export interface MySession extends Scenes.SceneSession<MySceneSession> {
    cityProp: string;
    userProp: number | undefined;
}

export interface MyContext extends Context {
    myContextProp: string;
    session: MySession;
    scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
}
