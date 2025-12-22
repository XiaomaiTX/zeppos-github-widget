import * as hmUI from '@zos/ui';

AppWidget({

  onInit() {
    logger.log("===onInit===");
  },

  onDataRestore() {},

  build() {
    logger.log(getAppWidgetSize())

    setAppWidgetSize({
      h: px(480)*0.6
    })
  },

  onResume() {
  },



});
