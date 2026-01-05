const token = 'your_github_token';

async function genGetGitHubStatsQuery(username) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const query = `
    query GetStats($username: String!) {
      user(login: $username) {
        login
        
        # 计算总 stars
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            stargazerCount
          }
        }
        
        # 今年贡献
        contributionsCollection(from: "${currentYear}-01-01T00:00:00Z") {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoriesWithContributedCommits
        }
        
        # 去年贡献仓库
        contributionsCollection(from: "${lastYear}-01-01T00:00:00Z", to: "${lastYear}-12-31T23:59:59Z") {
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
  
  try {
    const data = await client.request(query, { username });
    
    // 计算总 stars
    const totalStars = data.user.repositories.nodes
      .reduce((sum, repo) => sum + repo.stargazerCount, 0);
    
    // 获取去年贡献的仓库列表（去重）
    const lastYearRepos = data.user.contributionsCollection[1]?.commitContributionsByRepository || [];
    const contributedRepos = [...new Set(lastYearRepos.map(item => item.repository.nameWithOwner))];
    
    return {
      username: data.user.login,
      stats: {
        totalStars,
        totalCommits: data.user.contributionsCollection[0].totalCommitContributions,
        totalPRs: data.user.contributionsCollection[0].totalPullRequestContributions,
        totalIssues: data.user.contributionsCollection[0].totalIssueContributions,
        contributedToCount: data.user.contributionsCollection[1]?.totalRepositoriesWithContributedCommits || 0,
        contributedToRepos: contributedRepos
      }
    };
  } catch (error) {
    console.error('查询失败:', error);
    return null;
  }
}

// 使用示例
// genGetGitHubStatsQuery('octocat').then(stats => {
//   if (stats) {
//     console.log('=== GitHub 统计 ===');
//     console.log(`用户: ${stats.username}`);
//     console.log(`总获星数: ${stats.stats.totalStars}`);
//     console.log(`今年提交: ${stats.stats.totalCommits}`);
//     console.log(`今年 PR: ${stats.stats.totalPRs}`);
//     console.log(`今年 Issues: ${stats.stats.totalIssues}`);
//     console.log(`去年贡献仓库数: ${stats.stats.contributedToCount}`);
//     console.log(`贡献仓库示例: ${stats.stats.contributedToRepos.slice(0, 5).join(', ')}...`);
//   }
// });