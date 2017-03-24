/**
 * @name 上传图片
 * @desc  input 加上这个方法可以支持多图上传 multiple="multiple"可以支持多图。前提是移动设备支持
 * @param {string} id 需要上传input的id
 * ------ {string} uploadUrl    //上传图片得url地址
 * ------ {function} beforeSend //选择文件后，发送文件前回调函数
 * ------ {function} success    //文件上传失败后回调函数
 * ------ {function} error      //文件上传完成后回调函数
 * ------ {function} complete   //文件上传成功后回调函数
 * ------ {function} uploading  //返回上传过程中包括上传进度的百分比
 * ------ {function} preview  ////上传的链接数，默认为1
 * ------ {function} maxconnections  //上传的链接数，默认为1
 * ------ {function} method  //上传图片方法
 * ------ {function} fieldname   //上传文件的name名称
 * 
 * 
 * 
 * @example
 *     
 *  var uploadObj = new upload({
 id:'file_id',
 //上传文件接收地址
 uploadUrl: "/mobile/Identity/upload",
 //选择文件后，发送文件前自定义事件
 //file为上传的文件信息，可在此处做文件检测、初始化进度条等动作
 beforeSend: function(file) {
 },
 preview: function(url){
 $('#priview').attr('src',url);
 },
 //文件上传完成后回调函数
 //res为文件上传信息
 success: function(res) {
 },
 //返回上传过程中包括上传进度的相关信息
 //详细请看res,可在此加入进度条相关代码
 uploading: function(res) {
 
 }
 });
 
 //默认绑定了change事件直接触发
 uploadObj.start();
 
 //默认没有绑定change事件
 $('#file_id').change(function(){
 uploadObj.add(this.files[0]);
 });
 });
 * 
 */

(function() {
    var fn = function() {
    };
    var upload = function(options) {
        this.options = {
            //需要上传文件的input id
            id: '',
            //上传文件接收地址
            uploadUrl: "/mobile/Identity/upload",
            //选择文件后，发送文件前回调函数
            beforeSend: fn,
            //文件上传成功后回调函数
            success: fn,
            //文件上传失败后回调函数
            error: fn,
            //文件上传完成后回调函数
            complete: fn,
            //返回上传过程中包括上传进度的百分比
            uploading: fn,
            //预览的回调函数，参数是地址
            preview: fn,
            //上传的链接数，默认为1
            maxconnections: 1,
            //上传图片方法
            method: 'post',
            //上传文件的name名称
            fieldname: 'files'
        };
        this.queue = [];
        this.running = [];
        this.STATUS = {
            QUEUED: 'queued',
            ABORTED: 'aborted',
            UPLOADING: 'uploading',
            COMPLETED: 'completed'
        };
        $.extend(this.options, options);
    };
    upload.prototype = {
        doUpload: function(item) {
            var self = this,
                    xhr = new XMLHttpRequest(),
                    formData = new FormData();
            item.xhr = xhr;
            this.options.beforeSend.call(this, item, xhr);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    self.onComplete(item, xhr);
                }
            };
            xhr.upload.onprogress = function(evt) {
                var uploading = self.options.uploading,
                        loaded = evt.loaded,
                        tot = evt.total,
                        per = Math.floor(100 * loaded / tot); //已经上传的百分比
                if (uploading instanceof Function) {
                    uploading(per);
                }
            };
            xhr.open(this.options.method, this.options.uploadUrl, true);
            formData.append(this.options.fieldname, item);
            xhr.send(formData);
        },
        onComplete: function(item, xhr) {
            if (item.status !== this.STATUS.ABORTED) {
                item.status = this.STATUS.COMPLETED;
                if (xhr.status === 200) {
                    this.options.success.call(this, item, xhr);
                }
                else {
                    this.options.error.call(this, item, xhr);
                }
                this.options.complete.call(this, item, xhr);
            }
            if (item.xhr) {
                delete item.xhr;
            }
            for (var i in this.running) {
                if (this.running[i].name === item.name) {
                    this.running.splice(i, 1);
                    break;
                }
            }
            this.run();
        },
        add: function(file) {
            this.queue.push(file);
            try{
                var url = this.getFileUrl(file);
                this.options.preview.call(this, url);
            } catch (e){
                
            }
            this.run();
        },
        run: function() {
            if (this.queue.length > 0 && this.running.length < this.options.maxconnections) {
                for (var i = 0; i < this.options.maxconnections - this.running.length; ++i) {
                    var item = this.queue.shift();
                    this.running.push(item);
                    this.doUpload(item);
                }
            }
        },
        start: function() {
            var self = this;
            $('#' + this.options.id).change(function() {
                //是否支持h5
                var fileName = '';
                var files = this.files;
                if (this.files) {
                    for (var i = 0; i < files.length; ++i) {
                        fileName = files[i].name || files[i].fileName;
                        if (fileName.toLowerCase().match('(jpg)|(png)|(jpeg)|(gif)$')) {
                            self.add(files[i]);
                        } else {
                            alert('您输入的图片格式有问题');
                        }
                    }
                }
            });
        },
        getFileUrl: function(file) {
            var url;
            if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
                url = $('#' + this.options.id)[0].value;
            } else {
                url = window.URL.createObjectURL(file);
            }
            return url;
        },
        setUploadUrl: function(url) {
            this.options.uploadUrl = url;
        }
    };

    window.upload = upload;
})();