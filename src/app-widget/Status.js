import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import * as hmRouter from "@zos/router";
import { LocalStorage } from "@zos/storage";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive } from "@x1a0ma17x/zeppos-reactive";
import * as Layout from "./Status.layout";

const state = reactive({
    userStatusData: {},
    widgets: {},
});

AppWidget(
    BasePage({
        onInit() {
            console.log("Status widget initialized");
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
                state.userStatusData = JSON.parse(
                    localStorage.getItem("github-widget.userStatus"),
                );

                const titleText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.TITLE_TEXT,
                    text_size: px(26),
                    color: 0x57a5fd,
                    text: `${state.userStatusData.data.user.login || "unknown"}'s Status`,
                });

                const totalStarEarnedIcon = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.TOTAL_STAR_EARNED_ICON,
                    src: "Status/total-star-earned-icon.png",
                });
                const totalStarEarnedText = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_STAR_EARNED_TEXT,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `Total Star Earned:`,
                    },
                );
                state.widgets.totalStarEarnedValue = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_STAR_EARNED_VALUE,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `${this.totalStarEarned()}`,
                    },
                );

                const totalCommitsIcon = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.TOTAL_COMMITS_ICON,
                    src: "Status/total-commits-icon.png",
                });
                const totalCommitsText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.TOTAL_COMMITS_TEXT,
                    text_size: px(22),
                    color: 0xc3d1d9,
                    text: `Total Commits:`,
                });
                state.widgets.totalCommitValue = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_COMMITS_VALUE,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `${this.totalCommits()}`,
                    },
                );

                const totalPRsIcon = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.TOTAL_PRS_ICON,
                    src: "Status/total-prs-icon.png",
                });
                const totalPRsText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.TOTAL_PRS_TEXT,
                    text_size: px(22),
                    color: 0xc3d1d9,
                    text: `Total PRs:`,
                });
                state.widgets.totalPRsValue = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_PRS_VALUE,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `${this.totalPRs()}`,
                    },
                );
                const totalIssuesIcon = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.TOTAL_ISSUES_ICON,
                    src: "Status/total-issues-icon.png",
                });
                const totalIssuesText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.TOTAL_ISSUES_TEXT,
                    text_size: px(22),
                    color: 0xc3d1d9,
                    text: `Total Issues:`,
                });
                state.widgets.totalIssuesValue = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_ISSUES_VALUE,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `${this.totalIssues()}`,
                    },
                );
                const totalContributionsIcon = hmUI.createWidget(
                    hmUI.widget.IMG,
                    {
                        ...Layout.TOTAL_CONTRIBUTIONS_ICON,
                        src: "Status/total-contributions-icon.png",
                    },
                );
                const totalContributionsText = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_CONTRIBUTIONS_TEXT,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `Last Year Contributions:`,
                    },
                );
                state.widgets.totalContributionsValue = hmUI.createWidget(
                    hmUI.widget.TEXT,
                    {
                        ...Layout.TOTAL_CONTRIBUTIONS_VALUE,
                        text_size: px(22),
                        color: 0xc3d1d9,
                        text: `${this.totalContributions()}`,
                    },
                );
            } catch (error) {
                console.log(error);
            }
        },
        totalStarEarned() {
            let totalStarEarn = 0;
            for (const repo of state.userStatusData.data.user.repositories
                .nodes) {
                totalStarEarn += repo.stargazerCount;
            }
            return totalStarEarn;
        },
        totalCommits() {
            return (
                state.userStatusData.data.user.currentYearContributions
                    .totalCommitContributions || "unknown"
            );
        },
        totalPRs() {
            return (
                state.userStatusData.data.user.currentYearContributions
                    .totalPullRequestContributions || "unknown"
            );
        },
        totalIssues() {
            return (
                state.userStatusData.data.user.currentYearContributions
                    .totalIssueContributions || "unknown"
            );
        },
        totalContributions() {
            return (
                state.userStatusData.data.user.lastYearContributions
                    .totalRepositoriesWithContributedCommits || "unknown"
            );
        },

        updateStatus() {
            const localStorage = new LocalStorage();
            state.userStatusData = JSON.parse(
                localStorage.getItem("github-widget.userStatus"),
            );

            state.widgets.totalStarEarnedValue.setProperty(
                hmUI.prop.TEXT,
                `${this.totalStarEarned()}`,
            );
            state.widgets.totalCommitValue.setProperty(
                hmUI.prop.TEXT,
                `${this.totalCommits()}`,
            );
            state.widgets.totalPRsValue.setProperty(
                hmUI.prop.TEXT,
                `${this.totalPRs()}`,
            );
            state.widgets.totalIssuesValue.setProperty(
                hmUI.prop.TEXT,
                `${this.totalIssues()}`,
            );
            state.widgets.totalContributionsValue.setProperty(
                hmUI.prop.TEXT,
                `${this.totalContributions()}`,
            );
        },
        onResume() {
            this.updateStatus();
        },
    }),
);
