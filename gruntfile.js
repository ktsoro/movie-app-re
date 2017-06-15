module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            pug: {
                files: ['views/**'],
                options: {
                    livereload: true  // 是否重新启动
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint'],  
                options: {
                    livereload: true
                }
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app', 'config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },

        concurrent: {
            tasks: ['nodemon', 'watch'], // 可以重新执行上面的两个任务
            options: {
                logConcurrentOutput: true
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch') // 监听文件改动，重新执行流程
    grunt.loadNpmTasks('grunt-nodemon')       // 监听入口文件改动，自动重启
    grunt.loadNpmTasks('grunt-concurrent')    // 慢任务开发的优化
    grunt.loadNpmTasks('grunt-mocha-test')    // 单元测试部分

    grunt.option('force', true)               // 防止因为语法错误或者警告而使得编译中断
    grunt.registerTask('default', ['concurrent'])

    grunt.registerTask('test', ['mochaTest'])
}