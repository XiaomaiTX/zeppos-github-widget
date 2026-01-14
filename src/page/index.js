import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";
import * as hmDevice from "@zos/device";
import * as hmSensor from "@zos/sensor";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";
import { computed, effect, reactive } from "@x1a0ma17x/zeppos-reactive";
import { ProgressArc } from "../components/ui/progress-arc";
import { AES, Utf8 } from "crypto-es";

import { ScrollListPage } from "../components/ScrollListPage";

import * as Styles from "zosLoader:./index.[pf].layout.js";

const time = new hmSensor.Time();

const state = reactive({
    uuid: hmDevice.getDeviceInfo().uuid,
    token: "",
    encryptedToken: "",
    lastUpdateTime: "",
    pageData: {},
});
Page(
    BasePage({
        onInit() {},
        build() {
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    state.lastUpdateTime =
                        config.settings.last_update_timestamp;

                    state.encryptedToken = config.settings.encryptedToken;

                    if (state.encryptedToken) {
                        state.token = AES.decrypt(
                            state.encryptedToken,
                            state.uuid
                        ).toString(Utf8);
                    }
                } else {
                    console.log("[config.json] not found, create new one");
                    AsyncStorage.WriteJson(
                        "config.json",
                        {
                            version: "1.0",
                            settings: {
                                last_update_timestamp: "",
                                update_interval: 60 * 1000, // 60 seconds
                                encryptedToken: "",
                            },
                        },
                        (err, ok) => {
                            if (ok) console.log("[config.json] created");
                        }
                    );
                }
            });

            state.pageData = computed(() => ({
                title: "GitHub Widget",
                items: [
                    {
                        title: "Github Token Status",
                        description: state.encryptedToken
                            ? "*".repeat(
                                  Math.min(state.encryptedToken.length, 16)
                              ) //最大16位
                            : "Token not set",
                        icon: state.encryptedToken
                            ? "checkbox-circle-fill@1x.png"
                            : "close-circle-fill@1x.png",
                        action: () => this.updateToken(state.token),
                    },
                    {
                        title: "Last Update Time",
                        description: state.lastUpdateTime
                            ? new Date(state.lastUpdateTime).toLocaleString()
                            : "Never",
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
                console.log("[effect] pageData change:", state.pageData.value);
                page.updateUI(state.pageData.value);
            });
        },
        isHaveToUpdate(
            currentTimestamp,
            last_update_timestamp,
            updateInterval
        ) {
            if (currentTimestamp - last_update_timestamp >= updateInterval)
                console.log("[isHaveToUpdate] true");
            else console.log("[isHaveToUpdate] false");
            return currentTimestamp - last_update_timestamp >= updateInterval;
        },
        updateToken() {
            hmRouter.push({
                url: "page/updateToken/index",
            });
        },
        clearToken() {
            state.token = "";
            state.encryptedToken = "";
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    config.settings.encryptedToken = state.encryptedToken;
                    AsyncStorage.WriteJson("config.json", config, (err, ok) => {
                        if (ok) console.log("[clearToken] updated");
                    });
                }
            });
        },
        clearData() {
            state.lastUpdateTime = "";
            AsyncStorage.RemoveFile("config.json", (err, ok) => {
                if (ok) hmRouter.back();
            });
        },
        checkLastUpdateTime() {
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    if (
                        state.lastUpdateTime !==
                        config.settings.last_update_timestamp
                    )
                        state.lastUpdateTime =
                            config.settings.last_update_timestamp;
                    return true;
                }
                return false;
            });
        },
        updateGithubData() {
            this.httpRequest({
                method: "post",
                url: "https://api.github.com/graphql",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${state.token}`,
                },
                body: JSON.stringify({
                    query: "query($username: String!) { user(login: $username) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date weekday color } } } } } }",
                    variables: { username: "XiaomaiTX" },
                }),
            })
                .then((result) => {
                    console.log("result.status", result.status);
                    console.log("result.statusText", result.statusText);
                    console.log("result.body", result.body);
                    console.log("result.body length", result.body.length);
                })
                .catch((error) => {
                    console.error("error=>", error);
                });
        },
        onCall(req) {
            console.log("call req=>", JSON.stringify(req));
            if (req.method === "GitHubWidget.UpdateToken") {
                console.log("call req=>", JSON.stringify(req));
            }
        },
        onDestroy() {},
    })
);
