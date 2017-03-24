$(function () {
    FastClick.attach(document.body);//解决部分手机点击事件延迟

    //图片上传正面
    var uploader_zheng = WebUploader.create({
        // 文件接收服务端。
        server: "/wechat/upload/index.html",
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.upload-zheng',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 开启自动上传
        auto: true,
    });
    //文件上传进度
    uploader_zheng.on('uploadProgress', function (file, percentage) {

    });

    //文件上传成功
    uploader_zheng.on('uploadSuccess', function (file, response) {
        console.log(response);
        $('.upload-zheng .box').hide();
        var tpl = '<img src="' + response.url + '" />';
        $('.upload-zheng').append(tpl);
    });
    
    
      //图片上传反面
    var uploader_fan = WebUploader.create({
        // 文件接收服务端。
        server: "/wechat/upload/index.html",
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.upload-fan',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 开启自动上传
        auto: true,
    });
    //文件上传进度
    uploader_fan.on('uploadProgress', function (file, percentage) {

    });

    //文件上传成功
    uploader_fan.on('uploadSuccess', function (file, response) {
        console.log(response);
        $('.upload-fan .box').hide();
        var tpl = '<img src="' + response.url + '" />';
        $('.upload-fan').append(tpl);
    });
    
    
      //图片上传其他资料
    var uploader_other = WebUploader.create({
        // 文件接收服务端。
        server: "/wechat/upload/index.html",
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.upload-other',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 开启自动上传
        auto: true,
    });
    //文件上传进度
    uploader_other.on('uploadProgress', function (file, percentage) {

    });

    //文件上传成功
    uploader_other.on('uploadSuccess', function (file, response) {
        console.log(response);
        $('.upload-other .box').hide();
        var tpl = '<img src="' + response.url + '" />';
        $('.upload-other').append(tpl);
    });
 
});  