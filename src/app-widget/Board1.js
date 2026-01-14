import * as hmUI from "@zos/ui";
import { log as Logger, px } from "@zos/utils";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, effect, computed } from "@x1a0ma17x/zeppos-reactive";

import {
    generateHeatmapData,
    generateHeatmapBoxes,
    getMonthLabels,
    convertToHeatmapData,
} from "../utils/method";

import { testContributionsData } from "../graphql/test-data-contributions";

import * as Layout from "./Board1.layout";

const logger = Logger.getLogger("Board1");

const state = reactive({
    githubHeatmapData: [],
    totalContributions: 0,
    monthLabels: [],
    widgets: {},
});

AppWidget(
    BasePage({
        onInit() {},

        onDataRestore() {},

        build() {
            hmUI.setAppWidgetSize({
                h: px(155),
            });

            try {
                state.githubHeatmapData = computed(() => {
                    return convertToHeatmapData(testContributionsData.data);
                });

                state.totalContributions =
                    testContributionsData.data.user.contributionsCollection.contributionCalendar.totalContributions;

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
                const contributionText = hmUI.createWidget(hmUI.widget.TEXT, {
                    ...Layout.CONTRIBUTION_TEXT,
                    text: `${state.totalContributions} Contributions`,
                    text_size: px(14),
                    align_h: hmUI.align.LEFT,
                    align_v: hmUI.align.CENTER_V,
                    color: 0x757d86,
                });
                const contributionImg = hmUI.createWidget(hmUI.widget.IMG, {
                    ...Layout.CONTRIBUTION_IMG,
                    auto_scale: true,
                    src: "Board1/contribution_level.png",
                });

                state.widgets.boxCanvas = hmUI.createWidget(
                    hmUI.widget.CANVAS,
                    Layout.BOX_CANVAS
                );
                state.widgets.monthCanvas = hmUI.createWidget(
                    hmUI.widget.CANVAS,
                    Layout.MONTH_CANVAS
                );

                const boxPerRow = 23;
                const rows = 7;
                const boxSize = px(12);
                const spacing = px(3);

                effect(() => {
                    console.log("[effect]");
                    this.updateHeatmapUI(
                        state.githubHeatmapData.value,
                        boxPerRow,
                        rows,
                        boxSize,
                        spacing
                    );
                });
            } catch (error) {
                logger.log(error);
            }
        },
        updateHeatmapUI(heatmapData, boxPerRow, rows, boxSize, spacing) {
            const boxList = generateHeatmapBoxes(
                heatmapData,
                boxPerRow,
                rows,
                boxSize,
                spacing
            );
            const monthLabels = getMonthLabels(
                heatmapData,
                boxPerRow,
                boxSize,
                spacing
            );

            state.widgets.boxCanvas.clear(Layout.BOX_CANVAS);
            boxList.forEach((box) => {
                state.widgets.boxCanvas.drawImage({
                    x: box.x,
                    y: box.y,
                    w: box.w,
                    h: box.h,
                    alpha: 255,
                    image: `Board1/common-${box.level}.png`,
                });
            });

            state.widgets.monthCanvas.clear(Layout.MONTH_CANVAS);
            monthLabels.forEach((label) => {
                state.widgets.monthCanvas.drawText({
                    x: label.x,
                    y: 0,
                    text_size: px(14),
                    color: 0xffffff,
                    text: label.text,
                });
            });
        },
        onResume() {},
    })
);
