export const testUserStatusData = {
    data: {
        user: {
            login: "octocat",
            repositories: {
                nodes: [
                    { stargazerCount: 150 },
                    { stargazerCount: 42 },
                    { stargazerCount: 89 },
                    { stargazerCount: 0 },
                    { stargazerCount: 230 },
                    { stargazerCount: 12 },
                    { stargazerCount: 56 },
                    { stargazerCount: 300 },
                    { stargazerCount: 78 },
                    { stargazerCount: 45 },
                ],
            },
            currentYearContributions: {
                totalCommitContributions: 245,
                totalPullRequestContributions: 32,
                totalIssueContributions: 18,
                totalRepositoriesWithContributedCommits: 42,
            },
            lastYearContributions: {
                totalRepositoriesWithContributedCommits: 38,
                commitContributionsByRepository: [
                    {
                        repository: {
                            nameWithOwner: "octocat/Hello-World",
                        },
                    },
                    {
                        repository: {
                            nameWithOwner: "github/docs",
                        },
                    },
                    {
                        repository: {
                            nameWithOwner: "octocat/Spoon-Knife",
                        },
                    },
                    {
                        repository: {
                            nameWithOwner: "github/linguist",
                        },
                    },
                    {
                        repository: {
                            nameWithOwner: "octocat/octocat.github.io",
                        },
                    },
                ],
            },
        },
    },
};

// 可选：导出默认数据
export default testUserStatusData;