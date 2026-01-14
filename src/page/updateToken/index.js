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
                console.log(state.code);
                this.getTokenFromCode(state.code);
            }, 1000);
            state.pageData = computed(() => ({
                title: "Update Token",
                items: [
                    {
                        title: "Update Code",
                        description: state.code || "loading...",
                    },
                    {
                        title: "How to get token",
                        description: "Go to https://n8n.cafero.town/token",
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
            this.request({
                method: "get",
                url: `http://cafero-n8n:5678/webhook-test/get-token?code=${code}`,
            }).then((res) => {
                console.log(res);
                // if (res.status === 200 && res.data.token) {
                    // state.token = res.data.token;
                    state.token = "test_token_sbxsaoxsa";
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
                // }
            });
        },
        onDestroy() {
            hmUI.deleteKeyboard();
            console.log("UpdateToken Page destroyed");
        },
    })
);
