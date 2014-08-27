/**
 * 本文件是 Gruntfile.js 默认模板，请根据需要和注释提示自行修改
 * 从这里获得最新版
 * https://github.com/jayli/generator-clam/blob/master/app/templates/Gruntfile_src.js
 */
var path = require('path'),
    clamUtil = require('clam-util'),
    exec = require('child_process').exec;

module.exports = function (grunt) {

    var file = grunt.file;
    var task = grunt.task;
    var pathname = path.basename(__dirname);
    var source_files = clamUtil.walk('src',
        clamUtil.NORMAL_FILTERS,
        clamUtil.NORMAL_EXFILTERS);
    var all_files = (source_files.css || [])
        .concat(source_files.eot || [])
        .concat(source_files.otf || [])
        .concat(source_files.svg || [])
        .concat(source_files.ttf || [])
        .concat(source_files.woff || [])
        .concat(source_files.html || [])
        .concat(source_files.htm || [])
        .concat(source_files.js || [])
        .concat(source_files.less || [])
        .concat(source_files.css || [])
        .concat(source_files.png || [])
        .concat(source_files.gif || [])
        .concat(source_files.jpg || [])
        .concat(source_files.scss || [])
        .concat(source_files.php || [])
        .concat(source_files.swf || []);

    all_files = all_files.concat('!**/*/build/**');
    //all_files = all_files.concat('!libs/mtop.js');
    //all_files = all_files.concat('!libs/seed.js');

    var relative = '';
    var base = 'http://s.youshop.com';
    var pkg = grunt.file.readJSON('abc.json');

    if (pkg.env === 'daily') base = 'http://s.test.youshop.com';
    relative = [base, pkg.group + '/'].join('/');

    // -------------------------------------------------------------
    // 任务配置
    // -------------------------------------------------------------

    // 如果 Gruntfile.js 编码为 gbk，打开此注释
    // grunt.file.defaultEncoding = 'gbk';
    grunt.initConfig({

        // 从 abc.json 中读取配置项
        pkg: grunt.file.readJSON('abc.json'),

        // 配置默认分支
        currentBranch: 'master',

        // 对build目录进行清理
        clean: {
            mods: {
                src: 'src/mods.js'
            },
            sass: {
                src: 'build/**/*.scss'
            },
            build: {
                src: 'build/*'
            }
        },

        /**
         * 将src目录中的KISSY文件做编译打包，仅解析合并，源文件不需要指定名称
         *        KISSY.add(<名称留空>,function(S){});
         *
         *        @link https://github.com/daxingplay/grunt-kmc
         *
         * 如果需要只生成依赖关系表，不做合并，样例代码:
         *   options: {
         *       packages: [
         *           {
         *              name: '<%= pkg.name %>',
         *              path: './src/',
		 *				charset:'utf-8',
		 *				ignorePackageNameInUri:true
         *           }
         *       ],
		 *		depFilePath: 'build/map.js',// 生成的模块依赖表
		 *		comboOnly: true,
		 *		fixModuleName:true,
		 *		copyAssets:true,
		 *		comboMap: true
         *   },
         *   main: {
         *       files: [
         *           {
		 *				// 这里指定项目根目录下所有文件为入口文件，自定义入口请自行添加
         *              src: [ 'src/** /*.js', '!src/** /* /Gruntfile.js'],
         *              dest: 'build/'
         *           }
         *       ]
         *   }
         */
        kmc: {
            options: {
                depFilePath: 'build/mods.js',
                comboOnly: true,
                fixModuleName: true,
                comboMap: true,
                packages: [
                    {
                        ignorePackageNameInUri: true,
                        name: '<%= pkg.name %>',
                        path: '../',
                        charset: 'utf-8'
                    }
                ],
                //map: [['<%= pkg.name %>/src/', '<%= pkg.name %>/']]
                map: [
                    ['<%= pkg.name %>/build/', '<%= pkg.name %>/']
                ]
            },
            main: {
                files: [
                    {
                        expand: true,
                        //cwd: 'src/',
                        cwd: 'build/',
                        src: source_files.js,
                        //dest: 'build/'
                        dest: 'src/'
                    }
                ]
            }
            // 若有新任务，请自行添加
            /*
             "simple-example": {
             files: [
             {
             src: "a.js",
             dest: "build/index.js"
             }
             ]
             }
             */
        },

        // 将css文件中引用的本地图片上传CDN并替换url，默认不开启
        mytps: {
            options: {
                argv: "--inplace"
            },
            expand: true,
            cwd: 'src',
            all: source_files.css
        },

        // 静态合并HTML和抽取JS/CSS，解析juicer语法到vm/php
        // https://npmjs.org/package/grunt-combohtml
        combohtml: {
            options: {
                encoding: 'utf8',
                replacement: {
                    from: /src\//,
                    to: 'build/'
                },
                // 本地文件引用替换为线上地址
                relative: 'http://g.tbcdn.cn/<%= pkg.group %>/<%= pkg.name %>/<%= pkg.version %>/',
                tidy: false,  // 是否重新格式化HTML
                comboJS: false, // 是否静态合并当前页面引用的本地js
                comboCSS: false, // 是否静态合并当前页面引用的css
                convert2vm: false,// 是否将juicer语法块转换为vm格式
                convert2php: false // 是否将juicer语法块转换为php格式
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'build',
                        // 对'*.php'文件进行HTML合并解析
                        src: ['**/*.php'],
                        dest: 'build/'
                    }
                ]
            }
        },

        relativeurl: {
            options: {
                encoding: 'utf8',
                replacement: {
                    from: /src\//,
                    to: 'build/'
                },
                relative: relative,
                combo: false
            },

            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'build',
                        // 对'*.htm'文件进行HTML合并解析
                        src: ['**/*.html'],
                        dest: 'build/',
                        ext: '.html'
                    }
                ]
            }
        },


        // FlexCombo服务配置
        // https://npmjs.org/package/grunt-flexcombo
        //
        // 注意：urls 字段末尾不能有'/'
        flexcombo: {
            // 源码调试服务
            server: {
                options: {
                    proxyport: '<%= pkg.proxyPort %>',
                    target: 'src/',
                    urls: '/<%= pkg.group %>/<%= pkg.name %>',
                    port: '<%= pkg.port %>',
                    proxyHosts: ['demo', 'wd.youshop.com'],
                    servlet: '?',
                    separator: ',',
                    charset: 'utf8'
                }
            }
        },

        less: {
            options: {
                paths: './'
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*.less'],
                        dest: 'build/',
                        ext: '.less.css'
                    }
                ]
            }
        },

        sass: {
            src: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.scss'],
                        dest: 'src/',
                        ext: '.css'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*.scss'],
                        dest: 'build/',
                        ext: '.scss.css'
                    }
                ]
            }
        },

        // 压缩JS https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            options: {
                banner: '/*! Generated by Clam: <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
                beautify: {
                    ascii_only: true
                }
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*.js', '!**/*-min.js'],
                        dest: 'build/',
                        // ext: '-min.js'
                        ext: '.js'
                    }
                ]
            }
        },

        // 压缩CSS https://github.com/gruntjs/grunt-contrib-cssmin
        cssmin: {
            scss: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*.scss.css', '!**/*.scss-min.css'],
                        dest: 'build/',
                        ext: '.scss-min.css'
                    }
                ]
            },
            less: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*.less.css', '!**/*.less-min.css'],
                        dest: 'build/',
                        ext: '.less-min.css'
                    }
                ]
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*.css', '!**/*-min.css', '!**/*.less.css', '!**/*.scss.css'],
                        dest: 'build/',
                        ext: '.css'
                        //ext: '.css'
                    }
                ]
            }
        },

        // 监听JS、CSS、LESS文件的修改
        watch: {
            'style': {
                files: ['src/**/*.scss'],
                tasks: ['newer:sass:src']
            },

            'all': {
                files: ['src/**/*.js',
                    'src/**/*.css',
                    'src/**/*.less',
                    'src/**/*.php',
                    'src/**/*.html',
                    'src/**/*.htm',
                    'src/**/*.scss'],
                //files: [],
                tasks: [ 'build' ]
            }
        },

        // 发布命令
        exec: {
            tag: {
                command: 'git tag publish/<%= currentBranch %>'
            },
            publish: {
                command: 'git push origin publish/<%= currentBranch %>:publish/<%= currentBranch %>'
            },
            commit: {
                command: function (msg) {
                    var command = 'git commit -m "' + grunt.config.get('currentBranch') + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
                    return command;
                }
            },
            add: {
                command: 'git add .'
            },
            prepub: {
                command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
            },
            grunt_publish: {
                command: 'grunt default:publish'
            },
            grunt_prepub: {
                command: function (msg) {
                    return 'grunt default:prepub:' + msg;
                }
            },
            new_branch: {
                command: 'git checkout -b daily/<%= currentBranch %>'
            }

        },

        // 拷贝文件
        copy: {
            mods: {
                files: [
                    {
                        expand: true,
                        src: 'mods.js',
                        dest: 'src/',
                        cwd: 'build/',
                        filter: 'isFile'
                    }
                ]
            },
            main: {
                files: [
                    {
                        expand: true,
                        src: all_files,
                        dest: 'build/',
                        cwd: 'src/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        // 替换config中的版本号@@version
        replace: {
            dist: {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>'
                    },
                    prefix: '@@'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        dest: 'build/',
                        src: ['**/*']
                    }
                ]
            },
            script: {
                options: {
                    patterns: [
                        {
                            match: /<\s*head\s*>/,
                            replacement: '<head><script>window.aplusStartT = Date.now()</script>'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        dest: 'build/',
                        src: ['**/*.html']
                    }
                ]
            }
        },
        prompt: {
            grunt_default: {
                options: {
                    questions: [
                        {
                            config: 'grunt_default',
                            type: 'list',
                            message: '是否对JS和CSS进行Combo?',
                            default: base.valueOf(),
                            choices: [
                                {
                                    value: 'yes',
                                    name: '合并JS和CSS'
                                },
                                {
                                    value: 'no',
                                    name: '不合并JS和CSS'
                                }
                            ]
                        }
                    ]
                }
            },
            uglify: {
                options: {
                    questions: [
                        {
                            config: 'grunt_uglify',
                            type: 'list',
                            message: '是否对静态资源进行压缩?',
                            default: "no",
                            choices: [
                                {
                                    value: 'yes',
                                    name: '压缩JS和CSS'
                                },
                                {
                                    value: 'no',
                                    name: '不压缩JS和CSS'
                                }
                            ]
                        }
                    ]
                }
            }
        }



    });

    // -------------------------------------------------------------
    // 载入模块
    // -------------------------------------------------------------

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mytps');
    grunt.loadNpmTasks('grunt-flexcombo');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-combohtml');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-prompt');

    grunt.loadNpmTasks('grunt-relativeurl');


    // 根据需要打开这些配置
    //grunt.loadNpmTasks('grunt-kissy-template');
    //grunt.loadNpmTasks('grunt-contrib-connect');
    //grunt.loadNpmTasks('grunt-contrib-concat');

    // -------------------------------------------------------------
    // 注册Grunt子命令
    // -------------------------------------------------------------


    /**
     * 启动Demo调试时的本地服务
     */
    grunt.registerTask('server', '开启Demo调试模式', function () {
        task.run(['flexcombo:server', 'watch:style']);
    });

    // 默认构建任务
    grunt.registerTask('exec_build', '默认构建任务', function () {

        base = grunt.config('grunt_default') || base;



        console.log("======" + base);
        var action =
            ['clean:build',
                'clean:mods',
                'copy:main',
                'sass',
                'copy:mods'
            ];
        if(base == "yes"){
            action.push("relativeurl");
        }

        action.push('replace');
        action.push("clean:sass");

        var uglify = grunt.config('grunt_uglify') || 'no';

        if (uglify == "yes") {

            action.push("uglify");
            action.push("cssmin");
        }

        task.run(action);

    });


    // 默认构建任务
    grunt.registerTask('build', ['prompt:grunt_default','prompt:uglify', 'exec_build']);





    grunt.registerTask('svninit', '初始化svn', function (type, msg) {
        var done = this.async();
        var username = pkg.author.name;
        var password = pkg.author.password;
        var remote = pkg.repository.url;

        exec('svn checkout ' + remote + " --username=" + username + " --password=" + password, function (err, stdout, stderr, cb) {
            grunt.log.write(("初始化成功,更新版本号为" + stdout.replace(/\D/g, "")).red);
            done();
        });
    });




    // -------------------------------------------------------------
    // 注册Grunt主流程
    // -------------------------------------------------------------

    return grunt.registerTask('default', 'Clam 默认流程', function (type, msg) {

        var done = this.async();

        // 获取当前分支
        exec('git branch', function (err, stdout, stderr, cb) {

            var reg = /\*\s+daily\/(\S+)/,
                match = stdout.match(reg);

            if (!match) {
                grunt.log.error('当前分支为 master 或者名字不合法(daily/x.y.z)，请切换到daily分支'.red);
                grunt.log.error('创建新daily分支：grunt newbranch'.yellow);
                grunt.log.error('只执行构建：grunt build'.yellow);
                return;
            }
            grunt.log.write(('当前分支：' + match[1]).green);
            grunt.config.set('currentBranch', match[1]);
            done();
        });

        // 构建和发布任务
        if (!type) {
            task.run(['build']);
        } else if ('publish' === type || 'pub' === type) {
            task.run(['exec:tag', 'exec:publish']);
        } else if ('prepub' === type) {
            task.run(['exec:add', 'exec:commit:' + msg]);
            task.run(['exec:prepub']);
        }

    });

};
