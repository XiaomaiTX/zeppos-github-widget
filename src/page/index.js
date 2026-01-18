import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";
import * as hmDevice from "@zos/device";
import * as hmSensor from "@zos/sensor";
import * as hmInteraction from "@zos/interaction";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";
import { computed, effect, reactive } from "@x1a0ma17x/zeppos-reactive";
import { ProgressArc } from "../components/ui/progress-arc";
import { AES, Utf8 } from "crypto-es";

import { ScrollListPage } from "../components/ScrollListPage";

import {
    CONTRIBUTIONS_QUERY,
    USER_INFO_QUERY,
    USER_STATUS_QUERY,
} from "../graphql/export";

import * as Styles from "zosLoader:./index.[pf].layout.js";

const time = new hmSensor.Time();

const state = reactive({
    uuid: hmDevice.getDeviceInfo().uuid,
    token: "",
    encryptedToken: "",
    github_username: "",
    lastUpdateTime: "",
    pageData: {},
    config: {},
});
Page(
    BasePage({
        onInit() {},
        build() {
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    // console.log(
                    //     "config.data.contributions属性树:",
                    //     JSON.stringify(config.data.contributions, null, 2)
                    // );
                    state.lastUpdateTime =
                        config.settings.last_update_timestamp;
                    state.github_username = config.settings.github_username;

                    state.encryptedToken = config.settings.encryptedToken;

                    if (state.encryptedToken) {
                        state.token = AES.decrypt(
                            state.encryptedToken,
                            state.uuid,
                        ).toString(Utf8);
                    }
                } else {
                    console.log("[config.json] not found, create new one");
                    AsyncStorage.WriteJson(
                        "config.json",
                        {
                            version: "1.0",
                            settings: {
                                github_username: "",
                                last_update_timestamp: Date.now(),
                                update_interval: 60 * 1000, // 60 seconds
                                encryptedToken: "",
                            },
                            data: {
                                contributions: {},
                                user_info: {},
                                user_status: {},
                            },
                        },
                        (err, ok) => {
                            if (ok) console.log("[config.json] created");
                        },
                    );
                }
            });

            state.pageData = computed(() => ({
                title: "Settings",
                items: [
                    {
                        title: "Github Token Status",
                        description: state.encryptedToken
                            ? "*".repeat(
                                  Math.min(state.encryptedToken.length, 16),
                              ) //最大16位
                            : "Token not set",
                        icon: state.encryptedToken
                            ? "checkbox-circle-fill@1x.png"
                            : "close-circle-fill@1x.png",
                        action: () => this.updateToken(state.token),
                    },
                    {
                        title: "Github Username",
                        description: state.github_username
                            ? state.github_username
                            : "Not set",
                        icon: state.github_username
                            ? "checkbox-circle-fill@1x.png"
                            : "close-circle-fill@1x.png",
                        action: () => this.updateGitHubUsername(),
                    },
                    {
                        title: "Last Update Time",
                        description: state.lastUpdateTime
                            ? new Date(state.lastUpdateTime).toLocaleString()
                            : "Never",
                        action: () => this.updateGithubData(),
                    },
                    {
                        title: "Clear Token",
                        action: () => this.clearToken(),
                    },
                    {
                        title: "Clear Data",
                        action: () => this.clearData(),
                    },
                ],
            }));
            const page = new ScrollListPage(state.pageData.value);

            effect(() => {
                state.token;
                state.encryptedToken;
                state.lastUpdateTime;
                state.github_username;
                console.log("[effect] pageData change:", state.pageData.value);
                page.updateUI(state.pageData.value);
            });
        },
        // isHaveToUpdate(
        //     currentTimestamp,
        //     last_update_timestamp,
        //     updateInterval,
        // ) {
        //     if (currentTimestamp - last_update_timestamp >= updateInterval)
        //         console.log("[isHaveToUpdate] true");
        //     else console.log("[isHaveToUpdate] false");
        //     return currentTimestamp - last_update_timestamp >= updateInterval;
        // },
        updateGitHubUsername() {
            hmUI.createKeyboard({
                inputType: hmUI.inputType.CHAR,
                onComplete: (_, result) => {
                    console.log("输入内容:", result.data);
                    state.github_username = result.data;
                    AsyncStorage.ReadJson("config.json", (err, config) => {
                        if (!err) {
                            config.settings.github_username =
                                state.github_username;
                            AsyncStorage.WriteJson(
                                "config.json",
                                config,
                                (err, ok) => {
                                    if (ok)
                                        console.log(
                                            "[updateGitHubUsername] updated",
                                        );
                                },
                            );
                        }
                    });
                    hmUI.deleteKeyboard();
                },
                onCancel: (_, result) => {
                    console.log("取消输入");
                    hmUI.deleteKeyboard();
                },
                text: state.github_username || "", // 初始化文本
            });
        },
        updateToken() {
            hmRouter.push({
                url: "page/updateToken/index",
            });
        },
        clearToken() {
            const clearTokenDialog = hmInteraction.createModal({
                content: "Are you sure to clear the token?",
                onClick: (keyObj) => {
                    const { type } = keyObj;
                    if (type === hmInteraction.MODAL_CONFIRM) {
                        console.log("confirm");
                        state.token = "";
                        state.encryptedToken = "";
                        AsyncStorage.ReadJson("config.json", (err, config) => {
                            if (!err) {
                                config.settings.encryptedToken =
                                    state.encryptedToken;
                                AsyncStorage.WriteJson(
                                    "config.json",
                                    config,
                                    (err, ok) => {
                                        if (ok)
                                            console.log("[clearToken] updated");
                                    },
                                );
                            }
                        });
                        clearTokenDialog.show(false);
                    } else {
                        clearTokenDialog.show(false);
                    }
                },
            });
        },
        clearData() {
            const clearDataDialog = hmInteraction.createModal({
                content: "Are you sure to clear all data?",
                onClick: (keyObj) => {
                    const { type } = keyObj;
                    if (type === hmInteraction.MODAL_CONFIRM) {
                        console.log("confirm");
                        AsyncStorage.RemoveFile("config.json", (err, ok) => {
                            if (ok) {
                                console.log("[clearData] updated");
                                hmRouter.home();
                            }
                        });
                        clearDataDialog.show(false);
                    } else {
                        clearDataDialog.show(false);
                    }
                },
            });
        },
        // checkLastUpdateTime() {
        //     AsyncStorage.ReadJson("config.json", (err, config) => {
        //         if (!err) {
        //             if (
        //                 state.lastUpdateTime !==
        //                 config.settings.last_update_timestamp
        //             )
        //                 state.lastUpdateTime =
        //                     config.settings.last_update_timestamp;
        //             return true;
        //         }
        //         return false;
        //     });
        // },
        updateGithubData() {
            this.queryGitHubData("contributions");
            this.queryGitHubData("userInfo");
            this.queryGitHubData("userStatus");

            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    config.settings.last_update_timestamp = Date.now();
                    AsyncStorage.WriteJson("config.json", config, (err, ok) => {
                        if (ok) console.log("[updateGithubData] updated");
                    });
                }
            });
        },
        queryGitHubData(type) {
            switch (type) {
                case "contributions":
                    this.httpRequest({
                        method: "post",
                        url: "https://api.github.com/graphql",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${state.token}`,
                        },
                        body: JSON.stringify({
                            query: CONTRIBUTIONS_QUERY,
                            variables: { username: state.github_username },
                        }),
                    })
                        .then((result) => {
                            console.log(
                                "[queryGitHubData] contributions",
                                JSON.stringify(result.body, null, 2),
                            );
                            if (result.statusText === "OK") {
                                AsyncStorage.ReadJson(
                                    "config.json",
                                    (err, config) => {
                                        if (!err) {
                                            let currentTimestamp = Date.now();
                                            config.settings.last_update_timestamp =
                                                currentTimestamp;
                                            state.lastUpdateTime =
                                                currentTimestamp;
                                            config.data.contributions =
                                                result.body;

                                            AsyncStorage.WriteJson(
                                                "config.json",
                                                config,
                                                (err, ok) => {
                                                    if (ok) {
                                                    }
                                                },
                                            );
                                        }
                                    },
                                );
                            }
                        })
                        .catch((error) => {
                            console.error("error======>", error);
                        });

                    break;
                case "userInfo":
                    this.httpRequest({
                        method: "post",
                        url: "https://api.github.com/graphql",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${state.token}`,
                        },
                        body: JSON.stringify({
                            query: USER_INFO_QUERY,
                            variables: { username: state.github_username },
                        }),
                    })
                        .then((result) => {
                            console.log(
                                "[queryGitHubData] userInfo",
                                JSON.stringify(result.body, null, 2),
                            );
                            if (result.statusText === "OK") {
                                AsyncStorage.ReadJson(
                                    "config.json",
                                    (err, config) => {
                                        if (!err) {
                                            let currentTimestamp = Date.now();
                                            config.settings.last_update_timestamp =
                                                currentTimestamp;
                                            state.lastUpdateTime =
                                                currentTimestamp;
                                            config.data.user_info = result.body;

                                            AsyncStorage.WriteJson(
                                                "config.json",
                                                config,
                                                (err, ok) => {
                                                    if (ok) {
                                                    }
                                                },
                                            );
                                        }
                                    },
                                );
                            }
                        })
                        .catch((error) => {
                            console.error("error======>", error);
                        });
                    break;
                case "userStatus":
                    return this.httpRequest({
                        method: "post",
                        url: "https://api.github.com/graphql",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${state.token}`,
                        },
                        body: JSON.stringify({
                            query: USER_STATUS_QUERY,
                            variables: { username: state.github_username },
                        }),
                    })
                        .then((result) => {
                            console.log(
                                "[queryGitHubData] userStatus",
                                JSON.stringify(result.body, null, 2),
                            );
                            if (result.statusText === "OK") {
                                AsyncStorage.ReadJson(
                                    "config.json",
                                    (err, config) => {
                                        if (!err) {
                                            let currentTimestamp = Date.now();
                                            config.settings.last_update_timestamp =
                                                currentTimestamp;
                                            state.lastUpdateTime =
                                                currentTimestamp;
                                            config.data.user_status =
                                                result.body;

                                            AsyncStorage.WriteJson(
                                                "config.json",
                                                config,
                                                (err, ok) => {
                                                    if (ok) {
                                                    }
                                                },
                                            );
                                        }
                                    },
                                );
                            }
                        })
                        .catch((error) => {
                            console.error("error======>", error);
                        });
                    break;
                default:
                    break;
            }
        },
        onCall(req) {
            console.log("call req=>", JSON.stringify(req));
            if (req.method === "GitHubWidget.UpdateToken") {
                console.log("call req=>", JSON.stringify(req));
            }
        },
        onDestroy() {},
    }),
);
