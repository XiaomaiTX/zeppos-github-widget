export const testUserInfoData = {
    data: {
        user: {
            login: "octocat",
            avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
            name: "The Octocat",
            company: "@github",
            followers: {
                totalCount: 8320,
            },
            following: {
                totalCount: 9,
            },
            location: "San Francisco",
            email: "octocat@github.com",
            websiteUrl: "https://github.com/blog",
            socialAccounts: {
                nodes: [
                    {
                        provider: "TWITTER",
                        url: "https://twitter.com/octocat",
                    },
                    {
                        provider: "LINKEDIN",
                        url: "https://www.linkedin.com/in/octocat",
                    },
                    {
                        provider: "MASTODON",
                        url: "https://mastodon.s/@ocialoctocat",
                    },
                ],
            },
        },
    },
};

// 可选：导出默认数据
export default testUserInfoData;
