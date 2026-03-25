module.exports = {
    apps: [{
        name: 'ucs-frontend',
        cwd: '/home/ucscogroup/htdocs/ucscogroup.com/ucs3',
        script: 'npm',
        args: 'start',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '4G',
        error_file: '/home/ucscogroup/htdocs/ucscogroup.com/ucs3/logs/error.log',
        out_file: '/home/ucscogroup/htdocs/ucscogroup.com/ucs3/logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }]
}
