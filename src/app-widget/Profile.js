import * as hmUI from "@zos/ui";
import { log as Logger, px } from "@zos/utils";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, effect, computed } from "@x1a0ma17x/zeppos-reactive";

import { testUserInfoData } from "../graphql/test-data-user-info";

import * as Layout from "./Profile.layout";

const logger = Logger.getLogger("Profile");

const state = reactive({
    userData: null,
    widgets: {},
});

AppWidget(
    BasePage({
        onInit() {
            logger.log("Profile widget initialized");
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
                    }
                );
                const backgroundStrokeRect = hmUI.createWidget(
                    hmUI.widget.STROKE_RECT,
                    {
                        ...Layout.BACKGROUND_STROKE_RECT,
                        radius: px(36),
                        line_width: 2,
                        color: 0x30363d,
                    }
                );

                state.userData = testUserInfoData.data.user;

                const avatarImg = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.AVATAR_IMG,
                    src: "icon.png",
                });

                const nameText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.NAME_TEXT,
                    text_size: px(20),
                    color: 0xffffff,
                    text: state.userData.name || state.userData.login,
                });

                const loginText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.LOGIN_TEXT,
                    text_size: px(24),
                    color: 0x8b949e,
                    text: `@${state.userData.login}`,
                });

                // const companyText = hmUI.createWidget(hmUI.widget.TEXT, {
                //     ...Layout.COMPANY_TEXT,
                //     text_size: px(24),
                //     color: 0x8b949e,
                //     text: state.userData.company || "No company",
                // });

                // const followersText = hmUI.createWidget(hmUI.widget.TEXT, {
                //     ...Layout.FOLLOWERS_TEXT,
                //     text_size: px(24),
                //     color: 0x8b949e,
                //     text: `${state.userData.followers.totalCount} followers`,
                // });

                // const locationText = hmUI.createWidget(hmUI.widget.TEXT, {
                //     ...Layout.LOCATION_TEXT,
                //     text_size: px(24),
                //     color: 0x8b949e,
                //     text: state.userData.location || "No location",
                // });

                // const followingText = hmUI.createWidget(hmUI.widget.TEXT, {
                //     ...Layout.FOLLOWING_TEXT,
                //     text_size: px(24),
                //     color: 0x8b949e,
                //     text: `${state.userData.following.totalCount} following`,
                // });

                state.widgets.avatarImg = avatarImg;
                state.widgets.nameText = nameText;
                state.widgets.loginText = loginText;
                // state.widgets.companyText = companyText;
                // state.widgets.followersText = followersText;
                // state.widgets.locationText = locationText;
                // state.widgets.followingText = followingText;

            } catch (error) {
                logger.log(error);
            }
        },

        onResume() {},
    })
);