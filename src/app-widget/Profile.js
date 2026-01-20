import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import * as hmRouter from "@zos/router";
import { LocalStorage } from "@zos/storage";

import { BasePage } from "@zeppos/zml/base-page";

import { reactive } from "@x1a0ma17x/zeppos-reactive";

import * as Layout from "./Profile.layout";

const state = reactive({
    userInfo: {},
    widgets: {},
});

AppWidget(
    BasePage({
        onInit() {
            console.log("Profile widget initialized");
        },

        onDataRestore() {},

        build() {
            hmUI.setAppWidgetSize({
                h: Layout.WIDGET_HEIGHT,
            });

            try {
                const backgroundFillRect = hmUI.createWidget(
                    hmUI.widget.FILL_RECT,
                    {
                        ...Layout.BACKGROUND_FILL_RECT,
                        color: 0x0d1117,
                        radius: px(36),
                    },
                );
                const backgroundStrokeRect = hmUI.createWidget(
                    hmUI.widget.STROKE_RECT,
                    {
                        ...Layout.BACKGROUND_STROKE_RECT,
                        radius: px(36),
                        line_width: 2,
                        color: 0x30363d,
                    },
                );

                const localStorage = new LocalStorage();
                state.userInfoData = JSON.parse(
                    localStorage.getItem("github-widget.userInfo"),
                );
                const avatarImg = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.AVATAR_IMG,
                    src: "github.png",
                });

                const nameText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.NAME_TEXT,
                    text_size: px(34),
                    color: 0xffffff,
                    text:
                        state.userInfoData.data.user.name ||
                        state.userInfoData.data.user.login,
                });

                const companyIcon = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.COMPANY_ICON,
                    src: "Profile/company.png",
                });

                const companyText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.COMPANY_TEXT,
                    text_size: px(26),
                    color: 0x8b949e,
                    text: state.userInfoData.data.user.company || "No company",
                });

                const followersIcon = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.FOLLOWERS_ICON,
                    src: "Profile/followers.png",
                });
                const followersText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.FOLLOWERS_TEXT,
                    text_size: px(26),
                    color: 0x8b949e,
                    text: `${state.userInfoData.data.user.followers.totalCount} followers`,
                });
            } catch (error) {
                console.log(error);
            }
        },
        updateProfileUI() {
            try {
                const localStorage = new LocalStorage();
                state.userInfoData = JSON.parse(
                    localStorage.getItem("github-widget.userInfo"),
                );
                state.widgets.nameText.setProperty(
                    hmUI.prop.TEXT,
                    state.userInfoData.data.user.name ||
                        state.userInfoData.data.user.login,
                );
                state.widgets.companyText.setProperty(
                    hmUI.prop.TEXT,
                    state.userInfoData.data.user.company || "No company",
                );
                state.widgets.followersText.setProperty(
                    hmUI.prop.TEXT,
                    `${state.userInfoData.data.user.followers.totalCount} followers`,
                );
            } catch (error) {
                console.log(error);
            }
        },
        onResume() {
            this.updateUserInfoData();
        },
    }),
);
