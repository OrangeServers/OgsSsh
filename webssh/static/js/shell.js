// 版本4.9.0 <br>

// import {FitAddon} from './xterm/xterm-addon-fit/src/FitAddon'
//  document.write("<script language=javascript src="+url+"></script>");
const ogs_backend_url = ''

$(function () {
    let url_local = window.location.protocol + window.location.host + '/login.html'
    // document.write(returnCitySN["cip"]+','+returnCitySN["cname"])
    if ($.cookie('username') === undefined) {
        window.location.href = '/login.html'
    } else {
        // $(".orange-title-name").html($(".orange-title-name").html().replace("admin",$.cookie('username')))
        // $('.layui-header').css('background-color', '#2261A1')
    }
});

layui.config({
    base: '/layui/layuimod/dtree/'
}).extend({
    dtree: 'dtree'
})


layui.use(['tree', 'util', 'upload', 'element', 'layer', 'dtree'], function () {
    let tree = layui.tree
        , $ = layui.jquery
        , upload = layui.upload
        , element = layui.element
        , layer = layui.layer
        , util = layui.util //Tab的切换功能，切换事件监听等，需要依赖element模块
        , dtree = layui.dtree;

    function get_tree_list() {
        $.ajax({
            type: "POST",
            url: ogs_backend_url + "/local/data",
            dataType: "JSON",
            data: {'name': $.cookie('username')},
            showLine: true,
            edit: ['add', 'update', 'del'],
            success: function (res) {
                let data = res['host']
                dtree.render({
                    elem: '#orange-fx1'
                    , id: 'demoId1'
                    , data: data
                    , iconfont: ["layui-icon"]
                    , iconfontStyle: [{
                        fnode: {
                            node: {
                                open: "dtree-icon-jia1"
                            }
                        },
                        snode: {  //二级节点
                            node: {  //非叶子节点
                                // open:"",  //节点展开
                                // close:""  //节点关闭
                            },
                            leaf: "layui-icon-template-1"  //叶子节点
                        }
                    }]
                });
            }
        })
    }

    get_tree_list()


    dtree.on("node('orange-fx1')", function (obj) {
        if (obj.param['nodeId'] < 1000) {
            //  console.log(obj.param['context']); //得到当前点击的节点数据
            let termid = Math.floor(Math.random() * 100000)
            let csname = 'sta' + termid
            element.tabAdd('demo', {
                title: '<i class="layui-icon layui-icon-circle-dot ' + csname + '" style="font-size: 10px; color: #4cb450; margin-right: 10px"></i>' + obj.param['context'] //用于演示
                , content: '<div id="' + termid + '"></div>'
                //, content: '<div id="' + 'sttttm1' + '"></div>'
                //, id: termid //实际使用一般是规定好的id，这里以时间戳模拟下
                , id: termid //实际使用一般是规定好的id，这里以时间戳模拟下
            })

            $.ajax({
                type: "POST",
                url: ogs_backend_url + "/server/sys/user/name_list",
                dataType: "JSON",
                data: {'name': $.cookie('username')},
                success: function (res) {
                    let name_list = res['msg']
                    let sys_name_list = ''
                    for (let i of name_list) {
                        sys_name_list += '<input type="radio" name="sex" value="' + i + '" title="' + i + '" checked="">'
                    }
                    let select_sys_user = '<form class="layui-form" onsubmit="return false">\n' +
                        '  <div class="layui-form-item">\n' +
                        '    <label class="layui-form-label">单选框</label>\n' +
                        '    <div class="layui-input-block">\n' +
                        sys_name_list +
                        // '      <input type="radio" name="sex" value="男" title="男" checked="">\n' +
                        // '      <input type="radio" name="sex" value="女" title="女">\n' +
                        // '      <input type="radio" name="sex" value="禁" title="禁用" disabled="">\n' +
                        '    </div>\n' +
                        '  </div>\n' +
                        '  <div class="layui-form-item">\n' +
                        '    <div class="layui-input-block">\n' +
                        '      <button id="sys_user_conn" type="submit" class="layui-btn" lay-submit="" lay-filter="demo1">确认</button>\n' +
                        '    </div>\n' +
                        '  </div>\n' +
                        '</form>'

                    let user_open = layer.open({
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['420px', '240px'], //宽高
                        content: select_sys_user
                    });
                    layui.form.render()
                    $('#sys_user_conn').click(function () {
                        let user_name = $('.layui-form').serializeArray()[0]['value']
                        if (user_name === null) {
                            layer.msg('无可执行系统用户', {icon: 7});
                            layer.close(user_open)
                        } else {
                            $.ajax({
                                type: "POST",
                                url: ogs_backend_url + "/server/host/list",
                                dataType: "JSON",
                                data: {'type': 'host_alias', 'alias': obj.param['context']},
                                success: function (res) {
                                    let host_data = res
                                    $.ajax({
                                        type: "POST",
                                        url: ogs_backend_url + "/server/sys/user/list",
                                        dataType: "JSON",
                                        data: {'type': 'user_alias', 'alias': user_name},
                                        success: function (res2) {
                                            if (res2['host_key'] !== null) {
                                                wssh.connect(termid, csname, host_data['host_ip'], host_data['host_port'], res2['host_user'], '', res2['host_key'])
                                                layer.close(user_open)
                                            } else {
                                                if (res2['host_password'] !== null) {
                                                    wssh.connect(termid, csname, host_data['host_ip'], host_data['host_port'], res2['host_user'], res2['host_password'])
                                                    layer.close(user_open)
                                                } else {
                                                    layer.msg('该用户未设定登录密码和key')
                                                    layer.close(user_open)
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

            //wssh.connect(termid, '10.0.1.199', 22, 'web', '', '/data/tmp/test/sshkey/通用web用户_rsa')
            element.tabChange('demo', termid);

        }
    })


    //触发事件
    var active = {
        tabAdd: function () {
            //新增一个Tab项
            element.tabAdd('demo', {
                title: '新选项' + (Math.random() * 1000 | 0) //用于演示
                , content: '内容' + (Math.random() * 1000 | 0)
                , id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
            })
        }
        , tabDelete: function (othis) {
            //删除指定Tab项
            element.tabDelete('demo', '44'); //删除：“商品管理”


            othis.addClass('layui-btn-disabled');
        }
        , tabChange: function () {
            //切换到指定Tab项
            element.tabChange('demo', '22'); //切换到：用户管理
        }
    };

    $('.site-demo-active').on('click', function () {
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });


});

