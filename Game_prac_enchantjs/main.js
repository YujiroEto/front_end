// class作成
enchant();

/*
 *  
 *  Core
 *  - rootScene
 *  -- Sprite (bear)
 *   
 *   */

window.onload = function() {

	var core = new Core(320, 320);
	core.preload('chara1.png');
	core.fps = 15;
	core.onload = function() {

		/*
		   var bear = new Sprite(32, 32);
		   bear.image = core.assets['chara1.png'];
		   bear.x = 0;
		   bear.y = 0;        
		   bear.addEventListener('enterframe', function() {
		   if (core.input.right) this.x += 5;
		   });
		   core.rootScene.addChild(bear);
		   */
		var Bear = Class.create(Sprite, {
			initialize: function(x, y) {
				Sprite.call(this, 32, 32);
				this.x = x;
				this.y = y;
				this.frame = rand(5);
				this.opacity = rand(100) / 100;
				this.image = core.assets['chara1.png'];

				this.tl.moveBy(rand(100), 0, 40, enchant.Easing.BOUNCE_EASEOUT)
			.moveBy(-rand(100), -rand(20), rand(20))
			.fadeOut(20)
			.fadeIn(10)
			.loop();

		core.rootScene.addChild(this);
			}        
		});

		var bears = [];
		for (var i = 0; i < 100; i++) {
			bears[i] = new Bear(rand(320), rand(320));
		}

	}
	core.start();

};

function rand(n) {
	return Math.floor(Math.random() * (n+1));
}



//enchant();
//
//window.onload = function() {
//
//	var core = new Core(320, 320);
//	core.preload('chara1.png');
//	core.fps = 15;
//	core.onload = function() {
//
//		var bear = new Sprite(32, 32);
//		bear.image = core.assets['chara1.png'];
//		bear.x = 0;
//		bear.y = 0;
//		// bear.frame = 1;
//
//		bear.addEventListener('enterframe', function() {
//			if (core.input.right) this.x += 5;
//
//			// instersect
//			if (this.intersect(enemy)) {
//				// label.text = 'hit!';
//			}
//			
//			// within
//			if (this.within(enemy, 10)) {
//				// label.text = 'HIT!';
//				core.pushScene(gameOverScene);
//				core.stop();
//			}
//
//
//
//			/*
//			//動作
//			if (core.input.left) this.x -= 5;
//			if (core.input.right) this.x += 5;
//			if (core.input.up) this.y -= 5;
//			if (core.input.down) this.y += 5;
//			//this.x += 5;						// 動作
//			//this.frame = this.age % 3 + 5;	// 画像切替
//			//if (this.x > 320) this.x = 0;		// 画面区切り
//			//this.rotate(2);					// 回転
//			//this.scale(1.01, 1.01);			// 徐々に拡大
//			*/
//
//		});
//
//		/*
//		// touchしたら消える
//		bear.on('touchstart', function() {
//			core.rootScene.removeChild(this);
//		});
//		*/
//
//		/*
//		// touchしたらそこに移動
//		core.rootScene.on('touchstart', function(e) {
//			bear.x = e.x;
//			bear.y = e.y;
//		});
//		*/
//		
//		// 2体目
//		var enemy = new Sprite(32, 32);
//		enemy.image = core.assets['chara1.png'];
//		enemy.x = 80;
//		enemy.y = 0;
//		enemy.frame = 5;
//
//		// gameorver
//		var gameOverScene = new Scene();
//		gameOverScene.backgroundColor = 'black';
//
//		// text
//		var label = new Label();
//		label.x = 300;
//		label.y = 5;
//		label.color = 'red';
//		label.font = '14px "Arial"';
//
//		/*
//		label.text = '0';
//
//		label.on('enterframe', function() {
//			label.text = core.frame;	
//		});
//		*/
//
//		core.rootScene.addChild(label);
//		core.rootScene.addChild(enemy);
//		core.rootScene.addChild(bear);
//
//	}
//	core.start();
//
//};
//
