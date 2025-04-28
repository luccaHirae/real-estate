module.export = {
  apps: [
    {
      name: 'real-state',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}