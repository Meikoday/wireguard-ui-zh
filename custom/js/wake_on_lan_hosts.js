var base_url = jQuery(".brand-link").attr('href');
if (base_url.substring(base_url.length - 1, base_url.length) != "/")
    base_url = base_url + "/";


// 模板中的按钮文本需要汉化
const wake_on_lan_new_template = '<div class="col-sm-4" id="{{ .Id }}">\n' +
    '\t<div class="info-box">\n' +
    '\t\t<div class="info-box-content">\n' +
    '\t\t\t<div class="btn-group">\n' +
    '\t\t\t\t<button type="button" class="btn btn-outline-success btn-sm"\n' +
    '\t\t\t\t\t\tdata-mac-address="{{ .MacAddress }}">唤醒\n' +
    '\t\t\t\t</button>\n' +
    '\t\t\t\t<button type="button"\n' +
    '\t\t\t\t\t\tclass="btn btn-outline-primary btn-sm btn_modify_wake_on_lan_host"\n' +
    '\t\t\t\t\t\tdata-toggle="modal" data-target="#modal_wake_on_lan_host"\n' +
    '\t\t\t\t\t\tdata-name="{{ .Name }}" data-mac-address="{{ .MacAddress }}">编辑\n' +
    '\t\t\t\t</button>\n' +
    '\t\t\t\t<button type="button" class="btn btn-outline-danger btn-sm" data-toggle="modal"\n' +
    '\t\t\t\t\t\tdata-target="#modal_remove_wake_on_lan_host"\n' +
    '\t\t\t\t\t\tdata-mac-address="{{ .MacAddress }}">删除\n' +
    '\t\t\t\t</button>\n' +
    '\t\t\t</div>\n' +
    '\t\t\t<hr>\n' +
    '\t\t\t<span class="info-box-text"><i class="fas fa-address-card"></i> <span class="name">{{ .Name }}</span></span>\n' +
    '\t\t\t<span class="info-box-text"><i class="fas fa-ethernet"></i> <span class="mac-address">{{ .MacAddress }}</span></span>\n' +
    '\t\t\t<span class="info-box-text"><i class="fas fa-clock"></i> <span class="latest-used">未使用</span></span>\n' +
    '\t\t</div>\n' +
    '\t</div>\n' +
    '</div>';

// MAC地址验证提示信息需要汉化
jQuery(function ($) {
    $.validator.addMethod('mac', function (value, element) {
        return this.optional(element) || /^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/.test(value);
    }, '请输入有效的MAC地址（大写字母和数字，仅使用冒号分隔）例如：00:AB:12:EF:DD:AA');
});

jQuery.each(["put", "delete"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback,
            contentType: 'application/json'
        });
    };
});

// "新建主机"按钮文本需要汉化
jQuery(function ($) {
    let newHostHtml = '<div class="col-sm-2 offset-md-4" style=" text-align: right;"><button style="" id="btn_new_wake_on_lan_host" type="button" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#modal_wake_on_lan_host"><i class="nav-icon fas fa-plus"></i> 新建主机</button></div>';
    $('h1').parents(".row").append(newHostHtml);
});

jQuery(function ($) {
    $('.btn-outline-success').click(function () {
        const $this = $(this);
        $.put(base_url + 'wake_on_lan_host/' + $this.data('mac-address'), function (result) {
            $this.parents('.info-box').find('.latest-used').text(prettyDateTime(result));
        });
    });
});

// 删除确认提示信息需要汉化
jQuery(function ($) {
    let $modal_remove_wake_on_lan_host = $('#modal_remove_wake_on_lan_host');
    let $remove_client_confirm = $('#remove_wake_on_host_confirm');

    $modal_remove_wake_on_lan_host.on('show.bs.modal', function (event) {
        const $btn = $(event.relatedTarget);
        const $modal = $(this);

        const $editBtn = $btn.parents('.btn-group').find('.btn_modify_wake_on_lan_host');
        $modal.find('.modal-body').text("您即将删除网络唤醒主机 " + $editBtn.data('name'));
        $remove_client_confirm.val($editBtn.data('mac-address'));
    })

    $remove_client_confirm.click(function () {
        const macAddress = $remove_client_confirm.val().replaceAll(":", "-");
        $.delete(base_url + 'wake_on_lan_host/' + macAddress);
        $('#' + macAddress).remove();

        $modal_remove_wake_on_lan_host.modal('hide');
    });
});

// "未使用"文本需要汉化
jQuery(function ($) {
    $('.latest-used').each(function () {
        const $this = $(this);
        const timeText = $this.text().trim();
        try {
            if (timeText != "未使用") {
                $this.text(prettyDateTime(timeText));
            }
        } catch (ex) {
            console.log(timeText);
            throw ex;
        }
    });
});

// 表单验证信息需要汉化
jQuery(function ($) {
    // 前面的代码保持不变...

    let validator = $frm_wake_on_lan_host.validate({
        // 其他代码保持不变...
        rules: {
            name: {
                required: true,
            },
            mac_address: {
                required: true,
                mac: true,
            }
        },
        messages: {
            name: {
                required: "请输入名称"
            },
            mac_address: {
                required: "请输入MAC地址"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        }
    });

    $modal_wake_on_lan_host.on('show.bs.modal', function (e) {
        const $btn = $(e.relatedTarget);
        validator.resetForm();
        $macAddress.removeClass('is-invalid');

        $name.val($btn.data('name'));
        $macAddress.val($btn.data('mac-address'));
        $oldMacAddress.val($btn.data('mac-address'));
    });
});
