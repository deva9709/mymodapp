function initSparkline() {
    $(".sparkline").each(function() {
        var a = $(this);
        a.sparkline("html", a.data())
    })
}

function initCounters() {
    $(".count-to").countTo()
}

function skinChanger() {
    $(".right-sidebar .choose-skin li").on("click", function() {
        var a = $("body"),
            b = $(this),
            c = $(".right-sidebar .choose-skin li.active").data("theme");
        $(".right-sidebar .choose-skin li").removeClass("active"), a.removeClass("theme-" + c), b.addClass("active"), a.addClass("theme-" + b.data("theme"))
    })
}

function CustomScrollbar() {
    $(".ls-closed .sidebar .list").slimscroll({
        height: "calc(100vh - 0px)",
        color: "rgba(0,0,0,0.2)",
        position: "left",
        size: "2px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "0"
    }), $(".navbar-nav .dropdown-menu .body .menu").slimscroll({
        height: "250px",
        color: "rgba(0,0,0,0.2)",
        size: "3px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "0"
    }), $(".cwidget-scroll").slimscroll({
        height: "306px",
        color: "rgba(0,0,0,0.4)",
        size: "2px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "2px"
    })
}

function CustomPageJS() {
    $(".boxs-close").on("click", function() {
        $(this).parents(".card").addClass("closed").fadeOut()
    }), $(".sub_menu_btn").on("click", function() {
        $(".sub_menu").toggleClass("show")
    }), $(".theme-light-dark .t-light").on("click", function() {
        $("body").removeClass("theme-dark")
    }), $(".theme-light-dark .t-dark").on("click", function() {
        $("body").addClass("theme-dark")
    }), $(document).ready(function() {
        $(".btn_overlay").on("click", function() {
            $(".overlay_menu").fadeToggle(200), $(this).toggleClass("btn-open").toggleClass("btn-close")
        })
    }), $(".overlay_menu").on("click", function() {
        $(".overlay_menu").fadeToggle(200), $(".overlay_menu button.btn").toggleClass("btn-open").toggleClass("btn-close"), open = !1
    }), $(".form-control").on("focus", function() {
        $(this).parent(".input-group").addClass("input-group-focus")
    }).on("blur", function() {
        $(this).parent(".input-group").removeClass("input-group-focus")
    })
}
if ("undefined" == typeof jQuery) throw new Error("jQuery plugins need to be before this file");
$.AdminInfiniO = {}, $.AdminInfiniO.options = {
    
    leftSideBar: {
        scrollColor: "rgba(0,0,0,0.5)",
        scrollWidth: "4px",
        scrollAlwaysVisible: !1,
        scrollBorderRadius: "0",
        scrollRailBorderRadius: "0"
    },
    dropdownMenu: {
        effectIn: "fadeIn",
        effectOut: "fadeOut"
    }
}, $.AdminInfiniO.leftSideBar = {
    activate: function() {
        var a = this,
            b = $("body"),
            c = $(".overlay");
        $(window).on("click", function(d) {
            var e = $(d.target);
            "i" === d.target.nodeName.toLowerCase() && (e = $(d.target).parent()), !e.hasClass("bars") && a.isOpen() && 0 === e.parents("#leftsidebar").length && (e.hasClass("js-right-sidebar") || c.fadeOut(), b.removeClass("overlay-open"))
        }), $.each($(".menu-toggle.toggled"), function(a, b) {
            $(b).next().slideToggle(0)
        }), $.each($(".menu .list li.active"), function(a, b) {
            var c = $(b).find("a:eq(0)");
            c.addClass("toggled"), c.next().show()
        }), $(".menu-toggle").on("click", function(a) {
            var b = $(this),
                c = b.next();
            if ($(b.parents("ul")[0]).hasClass("list")) {
                var d = $(a.target).hasClass("menu-toggle") ? a.target : $(a.target).parents(".menu-toggle");
                $.each($(".menu-toggle.toggled").not(d).next(), function(a, b) {
                    $(b).is(":visible") && ($(b).prev().toggleClass("toggled"), $(b).slideUp())
                })
            }
            b.toggleClass("toggled"), c.slideToggle(320)
        }), a.checkStatuForResize(!0), $(window).resize(function() {
            a.checkStatuForResize(!1)
        }), Waves.attach(".menu .list a", ["waves-block"]), Waves.init()
    },
    checkStatuForResize: function(a) {
        var b = $("body"),
            c = $(".navbar .navbar-header .bars"),
            d = b.width();
        a && b.find(".content, .sidebar").addClass("no-animate").delay(1e3).queue(function() {
            $(this).removeClass("no-animate").dequeue()
        }), d < 1170 ? (b.addClass("ls-closed"), $(".sidebar").removeClass("h_menu"), c.fadeIn()) : (b.removeClass("ls-closed"), $(".sidebar").addClass("h_menu"), c.fadeOut())
    },
    isOpen: function() {
        return $("body").hasClass("overlay-open")
    }
},  $.AdminInfiniO.navbar = {
    activate: function() {
        var a = $("body"),
            b = $(".overlay");
        $(".bars").on("click", function() {
            a.toggleClass("overlay-open"), a.hasClass("overlay-open") ? b.fadeIn() : b.fadeOut()
        }), $('.nav [data-close="true"]').on("click", function() {
            var a = $(".navbar-toggle").is(":visible"),
                b = $(".navbar-collapse");
            a && b.slideUp(function() {
                b.removeClass("in").removeAttr("style")
            })
        })
    }
}, $.AdminInfiniO.select = {
    activate: function() {
        $.fn.selectpicker && $("select:not(.ms)").selectpicker()
    }
};