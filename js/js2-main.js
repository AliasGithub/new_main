var main = {};

(function ($) {
  var loading = null;
  var ajaxCnt = 0;
  var loads = [];
  var htmlObject = null;
  var eleLoading = 0;

  layui.use('layer', function () {
    var layer = layui.layer;
  
    $.ajaxSetup({
      headers: {
        'X-XSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      beforeSend: function () {
        if (eleLoading == 0) {
          eleLoading = layer.load(1, {
            shade: [0.1,'#fff'], time: 1000*1000
          });
        }

        ajaxCnt++;

        ajaxLock = true;
      },
      complete: function (XMLHttpRequest,status) {
        ajaxCnt--;

        if (ajaxCnt == 0) {
          layer.close(eleLoading);

          eleLoading = 0;
        }

        ajaxLock = false;
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        ajaxCnt--;

        if (ajaxCnt == 0) {
          layer.close(eleLoading);

          eleLoading = 0;
        }

        ajaxLock = false;
      },
      dataFilter: function (response, type) {
        try {
          response = $.parseJSON( response );
          var decodedString = BASE64.decode(response.data);

          return decodedString;
        } catch(err) {
          return response;
        }
      }
    });

    main = {
      BASE64: function () {
        return BASE64;
      }
    };

    var BASE64 = {

      enKey: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
       
      deKey: new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
      ),
       
      encode: function(src){
        src = src.toString();
        //????????????????????????????????????????????????????????????????????????????????????
        var str=new Array();
        var ch1, ch2, ch3;
        var pos=0;
        //??????????????????????????????
        while(pos+3<=src.length){
          ch1=src.charCodeAt(pos++);
          ch2=src.charCodeAt(pos++);
          ch3=src.charCodeAt(pos++);
          str.push(this.enKey.charAt(ch1>>2), this.enKey.charAt(((ch1<<4)+(ch2>>4))&0x3f));
          str.push(this.enKey.charAt(((ch2<<2)+(ch3>>6))&0x3f), this.enKey.charAt(ch3&0x3f));
        }
        //?????????????????????????????????
        if(pos<src.length){
          ch1=src.charCodeAt(pos++);
          str.push(this.enKey.charAt(ch1>>2));
          if(pos<src.length){
            ch2=src.charCodeAt(pos);
            str.push(this.enKey.charAt(((ch1<<4)+(ch2>>4))&0x3f));
            str.push(this.enKey.charAt(ch2<<2&0x3f), '=');
          }else{
            str.push(this.enKey.charAt(ch1<<4&0x3f), '==');
          }
        }
        //??????????????????????????????????????????????????????
        return str.join('');
      },
       
      decode: function(src){
        //?????????????????????????????????????????????
        var str=new Array();
        var ch1, ch2, ch3, ch4;
        var pos=0;
        //??????????????????????????????'='???
        src=src.replace(/[^A-Za-z0-9\+\/]/g, '');
        //decode the source string in partition of per four characters.
        while(pos+4<=src.length){
          ch1=this.deKey[src.charCodeAt(pos++)];
          ch2=this.deKey[src.charCodeAt(pos++)];
          ch3=this.deKey[src.charCodeAt(pos++)];
          ch4=this.deKey[src.charCodeAt(pos++)];
          str.push(String.fromCharCode(
            (ch1<<2&0xff)+(ch2>>4), (ch2<<4&0xff)+(ch3>>2), (ch3<<6&0xff)+ch4));
        }
        //?????????????????????????????????
        if(pos+1<src.length){
          ch1=this.deKey[src.charCodeAt(pos++)];
          ch2=this.deKey[src.charCodeAt(pos++)];
          if(pos<src.length){
            ch3=this.deKey[src.charCodeAt(pos)];
            str.push(String.fromCharCode((ch1<<2&0xff)+(ch2>>4), (ch2<<4&0xff)+(ch3>>2)));
          }else{
            str.push(String.fromCharCode((ch1<<2&0xff)+(ch2>>4)));
          }
        }
        //??????????????????????????????????????????????????????
        return str.join('');
      }
    };
  });
})(jQuery);