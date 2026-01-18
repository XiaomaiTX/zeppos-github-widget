import { BaseSideService } from "@zeppos/zml/base-side";

AppSideService(
    BaseSideService({
        onInit() {
            console.log("GitHub Token Service onInit");

            // settings.settingsStorage.addListener(
            //     "change",
            //     ({ key, newValue, oldValue }) => {
            //         if (key === "GithubWidget.Token" && newValue) {
            //             console.log("githubToken changed:", newValue, oldValue);
            //             this.notifyDevice({ token: newValue });
            //         }
            //     }
            // );

        },
        // notifyDevice(params) {
        //     console.log("[notifyDevice]:", params);
        //     this.call({
        //         method: "GitHubWidget.UpdateToken",
        //         params: {
        //             token: params.token,
        //         },
        //     });
        // },
        onDestroy() {
            console.log("GitHub Token Service destroyed");
        },
    })
);