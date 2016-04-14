Object.prototype.structify = function(lo){
	if(lo.constructor !== Array){
		return null;
	}

	var isBE = lo.isBigEndian;
	var buf = new Buffer(16);
	var off = 0;

	buf.fill(0);
	for(var i = 0; i < lo.length; ++i){
		var name = lo[i].name;
		var type = lo[i].type;
		var call = 'write';
		var isInt = false;
		var bpe = 0;

		function grow(newBytes){
			if(off + newBytes >= buf.length){
				var newBuf = new Buffer(buf.length << 1);
				newBuf.fill(0);
				buf.copy(newBuf);
				buf = newBuf;
			}
		}

		switch(type[0]){
		case 'f': call += 'Float'; bpe = 4;  break;
		case 'd': call += 'Double'; bpe = 8; break;
		case 'u': call += 'UInt'; isInt = true; break;
		case 'i': call += 'Int'; isInt = true; break;
		}
		
		if(isInt){
			var bits = parseInt(type.substr(1, type.length - 1));
			call += type.substr(1, type.length - 1);
			bpe = bits >> 3; 
		}

		if(bpe > 1){
			call += isBE ? 'BE' : 'LE';
		}

		if(lo[i].size && bpe == 1){
			var size = lo[i].size;
			var str = this[name];
			grow(size);
			buf.write(str, off, size > str.len ? str.len : size, 'ascii');
			off += size;
		}
		else{
			grow(bpe);
			buf[call](this[name], off);
			off += bpe;
		}
	}

	return buf.slice(0, off);
};
