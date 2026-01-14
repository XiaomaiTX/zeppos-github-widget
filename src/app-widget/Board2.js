import * as hmUI from "@zos/ui";
import { log as Logger, px } from "@zos/utils";

import {
    generateHeatmapData,
    generateHeatmapBoxes,
    convertToHeatmapData,
} from "../utils/method";
import { testContributionsData } from "../graphql/test-data-contributions";

const logger = Logger.getLogger("calories");

AppWidget({
    onInit() {
        logger.log("===onInit===");
    },

    onDataRestore() {},

    build() {
        logger.log("[build]", hmUI.getAppWidgetSize());

        hmUI.setAppWidgetSize({
            h: px(194),
        });

        try {
            const backgroundFillRect = hmUI.createWidget(
                hmUI.widget.FILL_RECT,
                {
                    x: px(40),
                    y: px(0),
                    w: px(400),
                    h: px(194),
                    color: 0x0d1117,
                    radius: px(36),
                }
            );
            const strokeRect = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
                x: px(40),
                y: px(0),
                w: px(400),
                h: px(194),
                radius: px(36),
                line_width: 2,
                color: 0x30363d,
            });
            const canvas = hmUI.createWidget(hmUI.widget.CANVAS, {
                x: px(40 + 19),
                y: px(19),
                w: px(363),
                h: px(156),
            });

            const githubHeatmapData = convertToHeatmapData(testContributionsData.data);
            

            const boxPerRow = 16;
            const rows = 7;
            const boxSize = 18;
            const spacing = 5;

            const boxList = generateHeatmapBoxes(
                githubHeatmapData,
                boxPerRow,
                rows,
                boxSize,
                spacing
            );

            boxList.forEach((box) => {
                if (box.x === 0 && box.y === 0) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/left-top-${box.level}@1x.png`,
                    });
                } else if (box.x + box.w === 363 && box.y === 0) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/right-top-${box.level}@1x.png`,
                    });
                } else if (box.x === 0 && box.y + box.h === 156) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/left-bottom-${box.level}@1x.png`,
                    });
                } else if (box.x + box.w === 363 && box.y + box.h === 156) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/right-bottom-${box.level}@1x.png`,
                    });
                } else {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/common-${box.level}.png`,
                    });
                }
            });
        } catch (error) {
            logger.log(error);
        }
    },

    onResume() {},
});
