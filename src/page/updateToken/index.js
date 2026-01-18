import * as hmUI from "@zos/ui";
import * as hmDevice from "@zos/device";
import * as hmRouter from "@zos/router";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, computed, effect } from "@x1a0ma17x/zeppos-reactive";
import { AES, Base, Utf8 } from "crypto-es";

import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";

const state = reactive({
    code: Math.random().toString().substring(2, 8),
    token: "",
    encryptedToken: "",
    uuid: hmDevice.getDeviceInfo().uuid,
    config: {},
    pageData: {},
});

Page(
    BasePage({
        onInit() {
            console.log(state.encryptedToken);
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    state.config = config;
                    state.encryptedToken = state.config.settings.encryptedToken;
                }
            });
        },
        build() {
            setInterval(() => {
                console.log("[get token request]:", state.code);
                this.getTokenFromCode(state.code);
            }, 10000);
            state.pageData = computed(() => ({
                title: "Update Token",
                items: [
                    {
                        title: "Update Code",
                        description: state.code || "loading...",
                    },
                    {
                        title: "How to get token",
                        description: "Go to https://n8n.cafero.town/github-widget/token",
                    },
                ],
            }));

            const page = new ScrollListPage(state.pageData.value);
            effect(() => {
                state.code;
                page.updateUI(state.pageData.value);
            });
        },

        getTokenFromCode(code) {
            // if (typeof code !== "string") {
            this.httpRequest({
                method: "get",
                url: `https://n8n.cafero.town/webhook/github-widget/get-token?code=${code}`,
                // url: `https://n8n.cafero.town/webhook-test/ping`,
            }).then((res) => {                
                // 检查响应状态码是否为200
                // if (res.status !== 200) {
                //     console.error("请求失败，状态码：", res.status);
                //     return;
                // }    
                console.log("[get token response]:", JSON.stringify(res.body));
                if (res.body.token && res.body.token !== "") {
                    state.token = res.body.token;
                    // state.token = "test_token_caonimabi";
                    console.log("[get token]:", state.token);
                    state.encryptedToken = AES.encrypt(
                        state.token,
                        state.uuid
                    ).toString();
                    state.config.settings.encryptedToken = state.encryptedToken;
                    AsyncStorage.WriteJson(
                        "config.json",
                        state.config,
                        (err, ok) => {
                            if (ok) {
                                console.log("config.json updated");
                                hmRouter.back();
                            }
                        }
                    );
                }
                else {
                    console.error("请求失败，状态码：", res.status);
                }
            });
        },
        onDestroy() {
            hmUI.deleteKeyboard();
            console.log("UpdateToken Page destroyed");
        },
    })
);
