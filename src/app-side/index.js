import { BaseSideService, settingsLib } from '@zeppos/zml/base-side';

const METHODS = {
  GET_GITHUB_TOKEN: 'GitHubWidget.GetToken',
};

AppSideService(
  BaseSideService({
    onRequest(req, res) {
      console.log('[app-side] onRequest:', req);
      if (req.method === METHODS.GET_GITHUB_TOKEN) {
        try {
          // 从设置存储获取 GitHub token
          const githubToken = settingsLib.getItem('githubToken') || '';
          console.log('[app-side] get github token:', githubToken);
          console.log('[app-side] has token:', githubToken && githubToken.length > 0);
          // 返回给设备应用
          res(null, {
            token: githubToken,
            hasToken: githubToken && githubToken.length > 0
          });
        } catch (e) {
          res(e);
        }
      } else {
        res('request error: unknown method [' + req.method + ']');
      }
    },
    
    onInit() {
      console.log('GitHub Token Service initialized');
    },
    
    onRun() {
      console.log('GitHub Token Service running');
    },
    
    onDestroy() {
      console.log('GitHub Token Service destroyed');
    },
  }),
);