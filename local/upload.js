const express = require('express');
const fs = require('fs');
const app = express();
const multer  = require('multer')
const common = require('../common/common')
 
module.exports = function(){
	const upload = multer({ dest: './uploads/' });

	app.post('/upload',  upload.single('file'),  (req, res) => { 
		res.setHeader('Access-Control-Allow-Origin', '*');
		if (!req.file) {
			return res.status(400).send('没有上传文件');
		}
		const fileName = req.file.name;
		res.send('文件上传成功！' + fileName);

		// 将文件保存到指定目录
		// file.mv(`uploads/${fileName}`, (err) => {
		// 	if (err) {
		// 		console.error(err);
		// 		return res.status(500).send('文件上传失败');
		// 	}
		// 	res.send('文件上传成功！');
		// });
	});

	app.listen(3000, () => {
		const [ip] = common.getIp()
		console.log('文件上传服务 http://'+ ip + ':'+ 3000);
	});
}

