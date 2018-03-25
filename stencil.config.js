exports.config = {
  namespace: 'complete-table',
  outputTargets:[{type: 'dist'}, {type: 'www', serviceWorker: false}]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
