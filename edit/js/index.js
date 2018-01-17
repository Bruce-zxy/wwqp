!window.btoa ? window.btoa = $.base64.btoa : null
!window.atob ? window.atob = $.base64.atob : null
$.base64.utf8encode = true;
$.base64.utf8decode = true;

var url = location.search;
var Request = new Object();
var currentDocument = null;
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;
var demoHtml = $(".demo").html();
var currenteditor = null;
var layoutName = null;
var parentFolder = 0;
var host = "localhost";
var addressSave = "http://" + host + "/wwqp/edit/save.php";
var addressCreate = "http://" + host + "/wwqp/edit/create.php";
var addressImg = "http://" + host + "/wwqp/edit/imgList.php";
var imgList = [];

(function () {
    $.ajax({
        type: "post",
        url: addressImg,
        success: function(data) {
            imgs = JSON.parse(data);
            var docfrag = document.createDocumentFragment();
            for (i in imgs) {
                var LI1 = document.createElement('li');
                LI1.className = "";
                var A1 = document.createElement('a');
                A1.href = "#";
                A1.rel = imgs[i].path;
                A1.textContent = imgs[i].name;
                LI1.appendChild(A1);
                docfrag.appendChild(LI1);
                $('ul[data-rol=img_click]').append(docfrag);
                imgList.push(imgs[i].name);
            }
            imgClick();
        },
        error: function(a, b) {
            alert('向服务器请求数据失败！');
        }
    });
})();

function handleSaveLayout() {
    var e = $(".demo").html();
    if (!stopsave && e != window.demoHtml) {
        stopsave++;
        // 在window对象中存储当前编辑页面
        window.demoHtml = e;
        saveLayout();
        stopsave--;
    }
}

// 检验是否支持本地存储
function supportstorage() {
    if (typeof window.localStorage == 'object')
        return true;
    else
        return false;
}

// 重新读取Layout数据
function restoreData() {
    if (supportstorage()) {
        layouthistory = JSON.parse(localStorage.getItem("layoutdata"));
        if (!layouthistory) return false;
        window.demoHtml = layouthistory.list[layouthistory.count - 1];
        if (window.demoHtml) $(".demo").html(window.demoHtml);
    }
}

// 界面初始化
function initContainer() {
    $(".demo, .demo .column").sortable({
        connectWith: ".column",
        opacity: .35,
        handle: ".drag",
        start: function(e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function(e, t) {
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });
    $(".demo .column").sortable({
        opacity: .35,
        connectWith: ".column",
        start: function(e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function(e, t) {
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });
    
    configurationElm();
}

// 控件Configuration事件
function configurationElm(e, t) {
    $(".demo").delegate(".configuration > a", "click", function(e) {
        e.preventDefault();
        var t = $(this).parent().next().next().children();
        $(this).toggleClass("active");
        t.toggleClass($(this).attr("rel"))
    });
    $(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {
        e.preventDefault();
        var t = $(this).parent().parent();
        var n = t.parent().parent().next().next().children();
        t.find("li").removeClass("active");
        $(this).parent().addClass("active");
        var r = "";
        t.find("a").each(function() {
            r += $(this).attr("rel") + " "
        });
        t.parent().removeClass("open");
        n.removeClass(r);
        n.addClass($(this).attr("rel"))
    })
}

// 控件移除
function removeElm() {
    $(".demo").delegate(".remove", "click", function(e) {
        e.preventDefault();
        $(this).parent().remove();
        if (!$(".demo .lyrow").length > 0) {
            clearDemo()
        }
    })
}

// 预览部分生成栅格布局
function gridSystemGenerator() {
    $(".lyrow .preview input").bind("keyup", function() {
        var e = 0;
        var t = "";
        var n = $(this).val().split(" ", 12);
        $.each(n, function(n, r) {
            e = e + parseInt(r);
            t += '<div class="span' + r + ' column"></div>'
        });
        if (e == 12) {
            $(this).parent().next().children().html(t);
            $(this).parent().prev().show()
        } else {
            $(this).parent().prev().hide()
        }
    })
}

// 保存布局
function saveLayout() {
    var data = layouthistory;
    if (!data) {
        data = {};
        data.count = 0;
        data.list = [];
    }
    if (data.list.length > data.count) {
        for (i = data.count; i < data.list.length; i++)
            data.list[i] = null;
    }
    data.list[data.count] = window.demoHtml;
    data.count++;
    if (supportstorage()) {
        localStorage.setItem("layoutdata", JSON.stringify(data));
    }
    layouthistory = data;
}

function handleJsIds() {
    handleModalIds();
    handleAccordionIds();
    handleCarouselIds();
    handleTabsIds()
}
function handleModalIds() {
    var e = $(".demo #myModalLink");
    var t = randomNumber();
    var n = "modal-container-" + t;
    var r = "modal-" + t;
    e.attr("id", r);
    e.attr("href", "#" + n);
    e.next().attr("id", n)
}
function handleAccordionIds() {
    var e = $(".demo #myAccordion");
    var t = randomNumber();
    var n = "accordion-" + t;
    var r;
    e.attr("id", n);
    e.find(".accordion-group").each(function(e, t) {
        r = "accordion-element-" + randomNumber();
        $(t).find(".accordion-toggle").each(function(e, t) {
            $(t).attr("data-parent", "#" + n);
            $(t).attr("href", "#" + r)
        });
        $(t).find(".accordion-body").each(function(e, t) {
            $(t).attr("id", r)
        })
    })
}
function handleCarouselIds() {
    var e = $(".demo #myCarousel");
    var t = randomNumber();
    var n = "carousel-" + t;
    e.attr("id", n);
    e.find(".carousel-indicators li").each(function(e, t) {
        $(t).attr("data-target", "#" + n)
    });
    e.find(".left").attr("href", "#" + n);
    e.find(".right").attr("href", "#" + n)
}
function handleTabsIds() {
    var e = $(".demo #myTabs");
    var t = randomNumber();
    var n = "tabs-" + t;
    e.attr("id", n);
    e.find(".tab-pane").each(function(e, t) {
        var n = $(t).attr("id");
        var r = "panel-" + randomNumber();
        $(t).attr("id", r);
        $(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r)
    })
}

function randomNumber() {
    return randomFromInterval(1, 1e6)
}

function randomFromInterval(e, t) {
    return Math.floor(Math.random() * (t - e + 1) + e)
}

function clearDemo() {
    $(".demo").empty();
    layouthistory = null;
    if (supportstorage())
        localStorage.removeItem("layoutdata");
}

function removeMenuClasses() {
    $("#menu-layoutit li button").removeClass("active")
}

function changeStructure(e, t) {
    $("#download-layout ." + e).removeClass(e).addClass(t)
}

function cleanHtml(e) {
    $(e).parent().append($(e).children().html())
}

function downloadLayoutSrc() {
    var e = "";
    $("#download-layout").children().html($(".demo").html());
    var t = $("#download-layout").children();
    var tHTML = $(".demo").html();
    t.find(".preview, .configuration, .drag, .remove").remove();
    t.find(".lyrow").addClass("removeClean");
    t.find(".box-element").addClass("removeClean");
    t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
        cleanHtml(this)
    });
    t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
        cleanHtml(this)
    });
    t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {
        cleanHtml(this)
    });
    t.find(".lyrow .lyrow .removeClean").each(function() {
        cleanHtml(this)
    });
    t.find(".lyrow .removeClean").each(function() {
        cleanHtml(this)
    });
    t.find(".removeClean").each(function() {
        cleanHtml(this)
    });
    t.find(".removeClean").remove();
    $("#download-layout .column").removeClass("ui-sortable");
    $("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
    if ($("#download-layout .container").length > 0) {
        changeStructure("row-fluid", "row")
    }
    formatSrc = $.htmlClean($("#download-layout").html(), {
        format: true,
        allowedAttributes: [
            ["id"],
            ["class"],
            ["data-toggle"],
            ["data-target"],
            ["data-parent"],
            ["role"],
            ["data-dismiss"],
            ["aria-labelledby"],
            ["aria-hidden"],
            ["data-slide-to"],
            ["data-slide"]
        ]
    });
    $("#download-layout").html(formatSrc);
    $("#downloadModal textarea").empty();
    $("#downloadModal textarea").val(formatSrc);
    return [formatSrc, tHTML];
}

function undoLayout() {
    var data = layouthistory;
    if (data) {
        if (data.count < 2) return false;
        window.demoHtml = data.list[data.count - 2];
        data.count--;
        $('.demo').html(window.demoHtml);
        if (supportstorage()) {
            localStorage.setItem("layoutdata", JSON.stringify(data));
        }
        return true;
    }
    return false;
}

function redoLayout() {
    var data = layouthistory;
    if (data) {
        if (data.list[data.count]) {
            window.demoHtml = data.list[data.count];
            data.count++;
            $('.demo').html(window.demoHtml);
            if (supportstorage()) {
                localStorage.setItem("layoutdata", JSON.stringify(data));
            }
            return true;
        }
    }
    return false;
}

function imgClick() {
    $('ul[data-rol=img_click] li a').click(function () {
        $(this).parent().parent().parent().parent().parent().find('img').attr('src', this.getAttribute("rel"));
        console.log($(this).parent().parent().parent().parent().parent().find('img').attr('src'));
    });
}

$(document).ready(function() {
    CKEDITOR.disableAutoInline = true;
    restoreData();
    var contenthandle = CKEDITOR.replace('contenteditor', {
        language: 'zh-cn',
        contentsCss: ['css/bootstrap-combined.min.css'],
        allowedContent: true
    });
    layoutName ? $(".mask").css("display", "none") : null;
    $(".saveLayoutName").click(function () {
        layoutName = $(this).prev().val();
        $(".mask").css("display", "none");
    })
    $("body").css("min-height", $(window).height() - 90);
    $(".demo").css("min-height", $(window).height() - 160);
    $(".sidebar-nav .lyrow").draggable({
        connectToSortable: ".demo",
        helper: "clone",
        handle: ".drag",
        start: function(e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function(e, t) {
            $(".demo .column").sortable({
                opacity: .35,
                connectWith: ".column",
                start: function(e, t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                stop: function(e, t) {
                    if (stopsave > 0) stopsave--;
                    startdrag = 0;
                }
            });
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });
    $(".sidebar-nav .box").draggable({
        connectToSortable: ".column",
        helper: "clone",
        handle: ".drag",
        start: function(e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function() {
            handleJsIds();
            if (stopsave > 0) stopsave--;
            startdrag = 0;
            console.log(this);
            imgClick();
        }
    });
    initContainer();
    $('body.edit .demo').on("click", "[data-target=#editorModal]", function(e) {
        e.preventDefault();
        currenteditor = $(this).parent().parent().find('.view');
        var eText = currenteditor.html();
        contenthandle.setData(eText);
    });
    $("#savecontent").click(function(e) {
        e.preventDefault();
        currenteditor.html(contenthandle.getData());
    });
    $("[data-target=#downloadModal]").click(function(e) {
        e.preventDefault();
        downloadLayoutSrc();
    });
    $("[data-target=#shareModal]").click(function(e) {
        e.preventDefault();
        var date = new Date().getTime();
        var datas = {
            name: layoutName,
            content: $.base64.btoa(downloadLayoutSrc()[0]),
            create_time: date,
            img_name: imgList[Math.floor(Math.random() * imgList.length)]
        }
        $.ajax({
            type: "post",
            url: addressSave,
            data: datas,
            success: function(data) {
                console.log(data);
                console.log(date);
                $.ajax({
                    type: "post",
                    url: addressCreate,
                    data: datas,
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(a, b) {
                        console.log(a);
                    }
                });
            },
            error: function(a, b) {
                console.log(a);
            }
        });
        handleSaveLayout();
    });
    $("[data-target=#layoutModal]").click(function(e) {
        e.preventDefault();
        handleSaveLayout();
        var date = new Date().getTime();
        var datas = {
            name: layoutName,
            content: $.base64.btoa(downloadLayoutSrc()[0]),
            content_origin: $.base64.btoa(downloadLayoutSrc()[1]),
            parent_folder: parentFolder,
            create_time: date,
            classify: 'color-'+Math.floor(Math.random()*5 + 1)+',icon-user'
        }
        $.ajax({
            type: "post",
            url: address,
            data: datas,
            success: function(data) {
                data = JSON.parse(data);
                if(typeof(data) !== 'object') {
                    alert('服务器返回参数错误！')
                } else {
                    window.location.href = "./test.html?name="+layoutName;
                }
            },
            error: function(a, b) {
                alert('向服务器请求数据失败！');
            }
        });
    });
    $("#download").click(function() {
        downloadLayout();
        return false
    });
    $("#downloadhtml").click(function() {
        downloadHtmlLayout();
        return false
    });
    $("#edit").click(function() {
        $("body").removeClass("devpreview sourcepreview");
        $("body").addClass("edit");
        removeMenuClasses();
        $(this).addClass("active");
        return false
    });
    $("#clear").click(function(e) {
        e.preventDefault();
        clearDemo()
    });
    $("#devpreview").click(function() {
        $("body").removeClass("edit sourcepreview");
        $("body").addClass("devpreview");
        removeMenuClasses();
        $(this).addClass("active");
        return false
    });
    $("#sourcepreview").click(function() {
        $("body").removeClass("edit");
        $("body").addClass("devpreview sourcepreview");
        removeMenuClasses();
        $(this).addClass("active");
        return false
    });
    $("#fluidPage").click(function(e) {
        e.preventDefault();
        changeStructure("container", "container-fluid");
        $("#fixedPage").removeClass("active");
        $(this).addClass("active");
        downloadLayoutSrc()
    });
    $("#fixedPage").click(function(e) {
        e.preventDefault();
        changeStructure("container-fluid", "container");
        $("#fluidPage").removeClass("active");
        $(this).addClass("active");
        downloadLayoutSrc()
    });
    $(".nav-header").click(function() {
        $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
        $(this).next().slideDown()
    });
    $('#undo').click(function() {
        stopsave++;
        if (undoLayout()) initContainer();
        stopsave--;
    });
    $('#redo').click(function() {
        stopsave++;
        if (redoLayout()) initContainer();
        stopsave--;
    });
    removeElm();
    gridSystemGenerator();
    setInterval(function() {
        handleSaveLayout()
    }, timerSave)
})

