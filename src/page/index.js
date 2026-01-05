import { getText } from "@zos/i18n";
import * as hmRouter from "@zos/router";

import { BasePage } from "@zeppos/zml/base-page";

import * as Styles from "zosLoader:./index.[pf].layout.js";
Page(
    BasePage({
        build() {
            console.log("[1]");
            const requestPromise = this.request({
                method: "GitHubWidget.GetToken",
                params: {},
            })
            requestPromise
                .then((result) => {
                    // receive your data
                    console.log("result=>", result.token);
                })
                .catch((error) => {
                    // receive your error
                    console.error("error=>", error);
                });
               
            // this.httpRequest({
            //     method: "post",
            //     url: "https://api.github.com/graphql",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `bearer ${token}`,
            //     },
            //     body: JSON.stringify({
            //         query: "query($username: String!) { user(login: $username) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date weekday color } } } } } }",
            //         variables: { username: "XiaomaiTX" },
            //     }),
            // })
            //     .then((result) => {
            //         console.log("result.status", result.status);
            //         console.log("result.statusText", result.statusText);
            //         console.log("result.body", result.body);
            //         console.log("result.body length", result.body.length);
            //     })
            //     .catch((error) => {
            //         console.error("error=>", error);
            //     });

            // this.httpRequest({
            //     method: "get",
            //     url: "https://n8n.cafero.town/webhook-test/c39784c1-3622-4206-961b-0ddc712244d7",
            // })
            //     .then((result) => {
            //         console.log("result.status", result.status);
            //         console.log("result.statusText", result.statusText);
            //         console.log("result.body", result.body);
            //         console.log("result.body length", result.body.length);
            //     })
            //     .catch((error) => {
            //         console.error("error=>", error);
            //     });
            console.log("[2]");
        },
    })
);
