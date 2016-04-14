Object.prototype.structify = function(lo){
	if(lo.constructor !== Array){
		return null;
	}

	var isBE = lo.isBigEndian;
	var buf = new Buffer(16);
	var off = 0;
	for(var i = 0; i < lo.length; ++i){
		var name = lo[i].name;
		var type = lo[i].type;
		var call = 'write';
		var isInt = false;
		var bpe = 0;

		function grow(newBytes){
			if(off + newBytes >= buf.length){
				var newBuf = new Buffer(buf.length << 1);
				buf.copy(newBuf);
				buf = newBuf;
			}
		}

		console.log(name);

		switch(type[0]){
		case 'f': call += 'Float';  break;
		case 'd': call += 'Double'; break;
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
			grow(lo[i].size);
			buf.write(this[name], off, lo[i].size, 'ascii');
			off += lo[i].size;
		}
		else{
			grow(bpe);
			buf[call](this[name], off);
			off += bpe;
		}
	}

	return buf.slice(0, off);
};
