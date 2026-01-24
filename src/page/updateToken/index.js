import * as hmUI from "@zos/ui";
import * as hmDevice from "@zos/device";
import * as hmRouter from "@zos/router";
import * as hmDisplay from "@zos/display";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, computed, effect } from "@x1a0ma17x/zeppos-reactive";
import { AES } from "crypto-es";

import { AsyncStorage } from "@silver-zepp/easy-storage";

import * as Style from "./index.style.js";
import * as Layout from "./index.layout.js";

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
			hmDisplay.pauseDropWristScreenOff({
				duration: 0,
			});
			hmDisplay.pausePalmScreenOff({
				duration: 0,
			});
			hmDisplay.setPageBrightTime({
				brightTime: 2147483000,
			});

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
			}, 5000);

			const deviceCodeText = hmUI.createWidget(hmUI.widget.TEXT, {
				...Layout.DEVICE_CODE_TEXT,
				...Style.DEVICE_CODE_TEXT,
				text: "Device Code",
			});

			const deviceCode = hmUI.createWidget(hmUI.widget.TEXT, {
				...Layout.DEVICE_CODE,
				...Style.DEVICE_CODE,
				text: state.code || "loading...",
			});
			const descriptionText = hmUI.createWidget(hmUI.widget.TEXT, {
				...Layout.DESCRIPTION_TEXT,
				...Style.DESCRIPTION_TEXT,
				text: "Scan the QR code to complete GitHub Token configuration",
			});
			const qrCodeImg = hmUI.createWidget(hmUI.widget.IMG, {
				...Layout.QR_CODE_IMG,
				src: "qr-code.png",
			});
		},

		getTokenFromCode(code) {
			// if (typeof code !== "string") {
			this.httpRequest({
				method: "get",
				url: `https://n8n.cafero.town/webhook/github-widget/get-token?code=${code}`,
			}).then((res) => {
				// 检查响应状态码是否为200
				if (res.status !== 200) {
					console.error("请求失败，状态码：", res.status);
					return;
				}
				console.log("[get token response]:", JSON.stringify(res.body));
				if (res.body.token && res.body.token !== "") {
					state.token = res.body.token;
					console.log("[get token]:", state.token);
					state.encryptedToken = AES.encrypt(
						state.token,
						state.uuid,
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
						},
					);
				} else {
					console.error("请求失败，状态码：", res.status);
				}
			});
		},
		onDestroy() {
			hmUI.deleteKeyboard();
			console.log("UpdateToken Page destroyed");
		},
	}),
);
