/*
 * Copyright (c) 2014 Tencent ISUX. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */
~function($){

	function showTips(msg, timeout){
		var tips = $('#tips');
		tips.removeClass('hide').html(msg);
		setTimeout(function(){
			tips.addClass('hide');
		}, timeout || 3000);
	}
	
	function isURL(txt){
		return txt && txt.indexOf('http') == 0;
	}

	function setQRCode(uri, size, alpha){
		if(!size)size = 168;
		var qr = $('#qrcode');
		qr.html('');
		new QRCode("qrcode", {
		    text: uri,
		    width: size,
		    height: size,
		    colorDark : "#000000",
		    colorLight : (alpha ? 'rgba(0,0,0,0)' : '#ffffff'),
		    correctLevel : QRCode.CorrectLevel[$('#qr_level').val()] || QRCode.CorrectLevel.H
		});
		//qr.attr('title', '点击在 PS 中打开');
		qr.addClass('fn-hand');
		alpha ? qr.removeClass('qrcode-white') : qr.addClass('qrcode-white');
		$('#ip_txt').text(uri);
		$('#ip_label').text('内容:');
	}
	function setShortURL(){
		var uri = $('#uri_txt').val();
		isURL(uri) && $('#hidden_frame').attr('src', 'http://stat.324324.cn/turl.php?url=' + encodeURIComponent(uri) + '&surl=');
	}
	function bind(){
		$('#ok_btn').click(function(e){
			var uri = $('#uri_txt').val(),
				size = $('#size_txt').val(),
				alpha = $('#alpha_chk').is(':checked'),
				sl = $('#sl_chk').is(':checked');
			
			uri && (setQRCode(uri, size, alpha), (sl && setShortURL()));
			e.preventDefault();
		});
		$('.js-qrcode').click(function(e){
			var img = $('img', this);
			img.length && base64ToPNG(img.attr('src'));
		});
	}
	
	function parse(txt){
		txt && ($('#urlcn_txt').val('http://url.cn/' + txt), $('#urlcn_txt').show());
	}
	
	function open(path){
		var uri = $('#uri_txt').val();
		var extScript = "$._ext_PHXS.open('" + path + "', '" + uri + "')";
		evalScript(extScript);
	}
	function base64ToPNG(data){
		data = data.replace(/^data:image\/png;base64,/, '');
		/*if(window.require){
			var fs = require('fs'),
				path = require('path');
			 
			  fs.writeFile(path.resolve(__dirname, 'qrcode.png'), data, 'base64', function(err) {
				if (err) throw err;
				open(__dirname + '/qrcode.png', );
			  });
		}else{
		*/
			var csi = new CSInterface(),
				myDocumentsPath = csi.getSystemPath(SystemPath.MY_DOCUMENTS),
				filename = myDocumentsPath + '/qrcode-cc.png';

			var result = window.cep.fs.writeFile(filename, data, cep.encoding.Base64);
			if (0 == result.err) {
				open(filename);
			}else{
				alert('写出文件失败！');
			}
		//}
	}
	
	function init(){
		bind();
	}
	
	window.parse = parse;
	
	init();
	
}(jQuery);