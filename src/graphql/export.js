export const CONTRIBUTIONS_QUERY = `
query ($username: String!) {
    user(login: $username) {
        contributionsCollection {
            contributionCalendar {
                totalContributions
                weeks {
                    contributionDays {
                        contributionCount
                        date
                        weekday
                        color
                    }
                }
            }
        }
    }
}
`;

export const USER_INFO_QUERY = `
query GetUserInfo($username: String!) {
    user(login: $username) {
        login
        avatarUrl
        name
        company
        followers {
            totalCount
        }
        following {
            totalCount
        }
        location
        email
        websiteUrl
        socialAccounts(first: 10) {
            nodes {
                provider
                url
            }
        }
    }
}`;
export const USER_STATUS_QUERY = `
query GetStats($username: String!) {
    user(login: $username) {
        login

        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
            nodes {
                stargazerCount
            }
        }

        currentYearContributions: contributionsCollection(
            from: "${new Date().getFullYear()}-01-01T00:00:00Z"
        ) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoriesWithContributedCommits
        }

        lastYearContributions: contributionsCollection(
            from: "${new Date().getFullYear() - 1}-01-01T00:00:00Z"
            to: "${new Date().getFullYear() - 1}-12-31T23:59:59Z"
        ) {
            totalRepositoriesWithContributedCommits
            commitContributionsByRepository(maxRepositories: 100) {
                repository {
                    nameWithOwner
                }
            }
        }
    }
}

`;
