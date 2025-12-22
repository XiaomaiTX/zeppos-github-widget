import { gettext } from "i18n";
import { BaseSideService } from "@zeppos/zml/base-side";
AppSideService(
    BaseSideService({
        onInit() {
            console.log(gettext("example"));
        },

        onRun() {},

        onDestroy() {},
    })
);
