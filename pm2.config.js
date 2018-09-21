module.exports = {
	apps: [{
		name: 'app',
		script: './app/index.js',
		output: '/dev/null',
		error: '/dev/null',
		instances: 0,
		instance_var: 'INSTANCE_ID',
		exec_mode: 'cluster',
		env: {
			NODE_ENV: 'development',
		},
		env_production: {
			NODE_ENV: 'production',
		}
	}]
};
