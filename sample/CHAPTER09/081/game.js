enchant();

window.onload = function() {

  core = new Core(320, 320);
  core.fps = 16;
  core.keybind(88, 'a');

  core.preload('button.png', 'map1.png','chara0.png', 'chara5.png',
               'avatarBg1.png','avatarBg2.png','avatarBg3.png',
               'monster/monster1.gif', 'monster/monster2.gif',
               'monster/monster3.gif' ,'monster/monster4.gif',
               'monster/monster5.gif', 'monster/monster6.gif',
               'monster/monster7.gif', 'monster/bigmonster1.gif',
               'monster/bigmonster2.gif', 'end.png');

  core.onload = function() {

    // マップを作成する
    var map = new Map(16, 16);
    map.image = core.assets['map1.png'];
    map.loadData(town.bg1, town.bg2);
    map.collisionData = town.collisionData;
    // フォアグラウンドマップを作成する
    var foregroundMap = new Map(16, 16);
    foregroundMap.image = core.assets['map1.png'];
    foregroundMap.loadData(town.fg);
    
    var stage = new Group();
    stage.addChild(map);

    // プレイヤーを作成する
    var player = new Player(96, 152, map);
    stage.addChild(player);

    // NPCを3キャラ作成する
    var npc1 = new Npc(192, 160, 0, map);
    stage.addChild(npc1);

    var npc2 = new Npc(192, 64, 2, map);
    stage.addChild(npc2);

    var npc3 = new Npc(96, 96, 1, map);
    npc3.noMoving = true; // 動くNPCかどうかの設定(「true」で動かない)
    stage.addChild(npc3);
    // npc3の「touchstart」イベントリスナ
    npc3.addEventListener('touchstart', function(e) {
      // プレイヤーとnpc3の距離が48ピクセル以内なら、
      if (calclen(npc3.x, npc3.y, player.x, player.y) <= 48) {
        // 宿屋シーンを実行する
        core.pushScene(core.Hotel());
      }
    });

    stage.addChild(foregroundMap);
    core.rootScene.addChild(stage);

    // rootSceneの「enterframe」イベントリスナ
    core.rootScene.addEventListener('enterframe', function(e) {
      // コインラベルを更新する
      coinLabel.text = 'COIN:' + playerStatus.coin;
      // マップのスクロール処理
      var x = Math.min((core.width  - 16) / 2 - player.x, 0);
      var y = Math.min((core.height - 16) / 2 - player.y, 0);
      x = Math.max(core.width,  x + map.width)  - map.width;
      y = Math.max(core.height, y + map.height) - map.height;
      stage.x = x;
      stage.y = y;
      // プレイヤーを画面の下端に移動すると、町からバトルフィールドへシーンを切り替える
      if (player.y > 445) core.pushScene(core.field(player.x, player.y));

      // npc3に近づいて(48ピクセル以内)、「a」ボタンを押すと、
      if (calclen(npc3.x, npc3.y, player.x, player.y) <= 48 && core.input.a) {
        // 宿屋シーンを表示する
        core.pushScene(core.Hotel());
      }
    });

    // バーチャルパッドを作成する
    var pad = new Pad();
    pad.x = 0;
    pad.y = 220;
    core.rootScene.addChild(pad);

    // バーチャル「a」ボタンを作成する
    var btn = new Button(250, 250, 'a');
    core.rootScene.addChild(btn);

    // コインラベル(コインの所持数を表示するラベル)を作成する
    coinLabel = new MutableText(192, 0);
    core.rootScene.addChild(coinLabel);

  }

  // 宿屋シーン(会話イベント)
  core.Hotel = function() {
    // シーンを作成する
    var scene = new Scene();
    // メッセージを表示する
    scene.addChild(makeMessage("1泊5コインです。宿泊しますか？"));
    
    // 選択肢を表示する
    
    // 1つ目の選択肢を作成する
    var select0 = makeSelect("【はい。】", 320 - 32 * 2);
    // 1つ目の選択肢の「touchstart」イベントリスナ
    select0.addEventListener('touchstart', function(e) {
      // 5コイン以上持っていなければ、
      if (playerStatus.coin < 5) {
        // メッセージを表示する
        scene.addChild(makeMessage("コインが足りません。"));
        // 「戻る」(前のシーンに戻るための選択肢)を表示する
        var select3 = makeSelect("【戻る】", 320 - 32 * 2);
        select3.addEventListener('touchstart', function(e) {
          core.popScene(); // 【戻る】タッチで前のシーンに戻る
        });
        scene.addChild(select3);
      } else {
      // 5コイン以上持っていたら、
        // 所持コインから5コイン引く
        playerStatus.coin -= 5;
        // プレイヤーのHPを回復する
        playerStatus.hp = playerStatus.maxhp;
        // 前のシーンに戻る
        core.popScene();
      }
    });
    scene.addChild(select0);
    
    // 1つ目の選択肢を作成する
    var select1 = makeSelect("【いいえ。】", 320 - 32);
    // 2つ目の選択肢の「touchstart」イベントリスナ
    select1.addEventListener('touchstart', function(e) {
      // 何もせずに前のシーンに戻る
      core.popScene();
    });
    scene.addChild(select1);
    return scene;
  }

  // バトルフィールドシーン
  core.field = function(px, py) {
    // シーンを作成する
    var scene = new Scene();
    // マップを作成する
    var map = new Map(16, 16);
    map.image = core.assets['map1.png'];
    map.loadData(field.bg1, field.bg2);
    map.collisionData = field.collisionData;

    var stage = new Group();
    stage.addChild(map);

    // プレイヤーを作成する
    var player = new Player(px + 8, 16, map);
    stage.addChild(player);

    // シーンに「stage」グループを追加する
    scene.addChild(stage);
    // シーンの「enterframe」イベントリスナ
    scene.addEventListener('enterframe', function(e) {
      // マップのスクロール処理
      var x = Math.min((core.width  - 16) / 2 - player.x, 0);
      var y = Math.min((core.height - 16) / 2 - player.y, 0);
      x = Math.max(core.width,  x + map.width)  - map.width;
      y = Math.max(core.height, y + map.height) - map.height;
      stage.x = x;
      stage.y = y;
      // プレイヤーを画面の上端まで移動したら、前のシーン(町)へ戻す
      if (player.y < 1 ) core.popScene();
      // 移動中にランダムな確率でバトル発生（バトルシーンに移行させる）
      if (player.isMoving && rand(ENCOUNT_BASE_RATE) < 5) {
        core.pushScene(core.battle());
      }
    });

    // バーチャルパッドを作成する
    var pad = new Pad();
    pad.x = 0;
    pad.y = 220;
    scene.addChild(pad);

    return scene;

  }

  // バトルシーン
  core.battle = function(no) {

    // バトル中フラグを「true」にする
    core.isBattle = true;

    // シーンを作成する
    var scene = new Scene();
    // シーンの背景色を白色にする
    scene.backgroundColor="#FFFFFF";
    // アバターの背景を作成する
    bg =new AvatarBG(1);
    bg.y=50;
    scene.addChild(bg);

    var m; // モンスターのデータを格納する変数
    // no(モンスター番号)が「7」「8」なら対応するモンスターデータを設定する
    if (no == 7 || no == 8) {
      m = monstorTable[no];
    } else {
    // それ以外の場合は、no6までのモンスターデータをランダムに設定する
      m = monstorTable[rand(6)];
    }

    // 「m」変数に設定されたモンスターデータを元にモンスターを作成する
    var monster = new AvatarMonster(core.assets[m.image]);
    monster.x = 200;
    monster.y = 100;
    monster.hp = m.hp * playerStatus.lv; // HO
    monster.speed = m.speed;             // スピード
    monster.attack = m.attack;           // 攻撃力
    monster.exp = m.exp;                 // 取得経験値
    monster.coin = m.coin;               // 取得コイン
    monster.drop = m.drop;               // ドロップするアイテム
    monster.rate = m.rate;               // ドロップ確率
    monster.no = no;                     // 種類
    monster.vx = -2 * monster.speed;     // 移動量  
    monster.death = false;               // 死亡フラグ
    monster.action = 'appear'            // アクション
    scene.addChild(monster);
    
    // モンスターの「enterframe」イベントリスナ
    monster.addEventListener('enterframe', function() {
      // バトル中でなければリターン
      if (core.isBattle == false) return;

      // 「attack」「appear」「disappear」アクションならリターン
      if (this.action == "attack" || this.action == "appear" || this.action == "disappear") return;
      // モンスターの移動処理
      this.x += this.vx * this.speed;
 
      // キャラとの当たり判定
 
      // キャラとモンスターの中心点の同士の距離が「16」ピクセル以下なら
      if (chara.within(this, 16)) {
        // 「attack」アクションにする
        this.action ="attack";
        // 移動量に「this.speed * 2」を代入する
        this.vx = this.speed * 2;
        // キャラのHPから、攻撃xレベルを引く
        chara.hp -= this.attack * chara.lv;
        // キャラのHPが「0」以下になったら、キャラのHPを「0」にする
        if (chara.hp < 0) chara.hp = 0;
        // HP表示ラベルを更新する
        hpLabel.text = 'HP:' + chara.hp + '/' + chara.maxhp;
        pLabel.text = String(chara.hp);
        // キャラのHPが「0」以下になったら、ゲームオーバーシーンを表示する
        if (chara.hp <= 0) core.pushScene(core.lose());
      // 当たってないなら、「attack」アクションにする
      } else this.action = "walk";
      
      // 「モンスターのx座標 - キャラのx座標」の絶対値が「100」より大きい、
      // または、「モンスターのx座標」が「320 - モンスターの幅」以上なら
      if ((Math.abs(this.x - chara.x) > 100) || (this.x >= 320 - this.width)) {
        // モンスターの「vx」プロパティに左方向に移動させるための値を設定する
        this.vx = -2 * this.speed;
      }
      // モンスターのx座標が「0」以下なら、 x座標を「320」にする
      // (左端までいったら、右から出現し直す)
      if (this.x < 0) this.x = 320;
    });

    // 「wp」変数に、現在装備している武器のデータを代入する
    var wp = weapon[playerStatus.weapon];
    // プレイヤーキャラクター(キャラ)を作成する
    var chara = new Avatar("1:2:1:"+ wp.no +":21011:2211");
    scene.addChild(chara);
    chara.x = 50;
    chara.y = 100;
    chara.scaleX = -1;                  // x方向の倍率
    chara.scaleY = 1;                   // y方向の倍率
    chara.vx = 4;                       // x方向の移動量
    chara.tick = 0;                     // フレーム数カウンタ
    chara.lv = playerStatus.lv;         // レベル
    chara.maxhp = playerStatus.maxhp;   // 最大HP
    chara.hp = playerStatus.hp;         // 現在HP
    chara.exp = playerStatus.exp;       // 経験値
    chara.attack = playerStatus.attack; // 攻撃力
    chara.coin = playerStatus.coin;     // 所持コイン
    chara.weapon = playerStatus.weapon; // 装備武器
    // キャラの「enterframe」イベントリスナ
    chara.addEventListener('enterframe', function() {

      // モンスターが生存中(画面上いるとき)の処理
      if (!monster.death) {
        // モンスターラベルを空にする
        mLabel.text = '';
        
        // キャラの攻撃、移動処理
        
        // 右ボタンが押され、かつキャラのx座標が「ゲーム幅-64」より小さいなら
        if (core.input.right && this.x < core.width-64) {
          // キャラを右向きにする
          this.scaleX = -1;
          // キャラを「run」アクション
          this.action = "run";
          // 右方向に「vx」プロパティの値ずつ移動させる
          this.x += this.vx;
          // モンスターは左方向に1ずつ移動させる
          monster.x --;
          // バックグラウンドをキャラの動きに合わせてスクロールする
          bg.scroll(this.x);
          
        // 左ボタンが押され、かつキャラのx座標が「0」より大きいなら
        } else if (core.input.left && this.x > 0) {
          // キャラを左向きにする
          this.scaleX = 1;
          // キャラを「run」アクション
          this.action = "run";
          // 左方向に「vx」プロパティの値ずつ移動させる
          this.x -= this.vx;
          // モンスターは右方向に1ずつ移動させる
          monster.x ++;
          // バックグラウンドをキャラの動きに合わせてスクロールする
          bg.scroll(this.x);
        
        // 「a」ボタンが押されたなら
        } else if (core.input.a) {
          // キャラを「attack」アクション
          this.action = "attack";

          // モンスターとの当たり判定

          if (monster.intersect(this)) {
            // 当たったら、モンスターの頭上に「Hit！」と表示する
            mLabel.text = ' Hit!';
            // x方向の移動量を「4」にする
            this.vx = 4;
            // モンスターのHPから、キャラの攻撃力+武器の攻撃力を引く
            monster.hp -= (this.attack +  wp.attack);
            // モンスターのHPが「0」以下なら
            if (monster.hp <= 0) {
              // モンスターラベルを空にする
              mLabel.text = "";
              // 死亡フラグを「true」にする
              monster.death = true;
              // 所持コインに取得コインを加算する
              this.coin += monster.coin;
              // モンスターをシーンから削除する
              scene.removeChild(monster);
              // 所持コインを更新
              playerStatus.coin = this.coin;
              // バトル終了
              core.isBattle = false;
              // 勝利シーンを表示する
              core.pushScene(core.win());
            }
          }
        } else {
          // ボタンが何も押されたいないなら、「stop」アクション
          this.action = "stop";
        }
      } else {
        // モンスターを倒したら、48フレーム待って、前のシーン(バトルフィールド)に戻る
        chara.tick ++;
        if (chara.tick > 48) core.popScene();
      }
    });
    
    // シーンの「enterframe」イベントリスナ
    scene.addEventListener('enterframe', function() {
      // バトル中でなければ、前のシーン(バトルフィールド)に戻る
      if (core.isBattle == false) core.popScene();
      // プレイヤーラベルとモンスターラベルの表示位置を更新する
      pLabel.x = chara.x + 16;
      pLabel.y = chara.y - 16;
      mLabel.x = monster.x + 16;
      mLabel.y = monster.y - 16;
    });

    // バーチャルパッドを作成する 
    var pad = new Pad();
    pad.x = 0;
    pad.y = 220;
    scene.addChild(pad);

    // バーチャル「a」ボタンを作成する
    var btn = new Button(250, 250, 'a');
    scene.addChild(btn);
    
    // 最大HP/現在HP表示ラベルを作成する
    hpLabel = new MutableText(10, 32);
    hpLabel.text = 'HP:' + playerStatus.hp + '/' + playerStatus.maxhp;
    scene.addChild(hpLabel);

    // プレイヤーラベルを作成する
    pLabel = new Label();
    pLabel.color = '#FFFFFF';
    pLabel.x = 0;
    pLabel.y = -200;
    pLabel.text = ''
    scene.addChild(pLabel);

    // モンスターラベルを作成する
    mLabel = new Label();
    mLabel.color = '#FF0000';
    mLabel.x = 0;
    mLabel.y = -200;
    mLabel.text = '';
    scene.addChild(mLabel);
    return scene;
  }

  // 勝利シーン
  core.win = function() {
    // シーンを作成する
    var scene = new Scene();
    
    // 表示するメッセージを設定する
    var mes = "モンスターを倒した！";
    // メッセージを表示する
    scene.addChild(makeMessage(mes));
    
    // 【戻る】選択肢を表示する
    var select0 = makeSelect("【戻る】", 320 - 32);
    select0.addEventListener('touchstart', function(e) {
      core.popScene(); // 【戻る】タッチで前のシーンに戻る
    });
    scene.addChild(select0);
    
    return scene;
  }

  // ゲームオーバーシーン
  core.lose = function() {
    // シーンを作成する
    var scene = new Scene();
    // メッセージを表示する
    scene.addChild(makeMessage("モンスターに倒された....."));

    // ゲームオーバー画像のスプライトを作成する
    var gameover = new Sprite(189, 97);
    gameover.image = core.assets['end.png'];
    gameover.x = 60;
    gameover.y = 112;
    scene.addChild(gameover);

    return scene;
  }

  core.start();
}

// 2点間の距離を求める関数
var calclen = function(x0, y0, x1, y1){
  return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 -y1));
}

// メッセージを作成する関数
var makeMessage = function(text) {
    var label = new Label(text);
    label.font  = "16px monospace";
    label.color = "rgb(255,255,255)";
    label.backgroundColor = "rgba(0, 0, 0, 1.0)";
    label.y     = 320 - 32 * 3;
    label.width = 320;
    label.height = 32 * 3;
    return label;
}

// 選択肢を作成する関数
var makeSelect = function(text, y) {
    var label = new Label(text);
    label.font  = "16px monospace";
    label.color = "rgb(255,200,0)";
    label.y     = y;
    label.width = 320;
    return label;
}

// バーチャルボタンを作成するクラス
var Button = enchant.Class.create(enchant.Sprite, {
  initialize: function(x, y, mode) {
    enchant.Sprite.call(this, 50, 50);
    this.image = core.assets['button.png'];
    this.x = x;
    this.y = y;
    this.buttonMode = mode; // ボタンモード
  }
});

// プレイヤーを作成するクラス
var Player = enchant.Class.create(enchant.Sprite, {
  initialize: function(x , y, map) {
    enchant.Sprite.call(this, 32, 32);
    this.x = x;
    this.y = y;
    var image = new Surface(96, 128);
    image.draw(core.assets['chara5.png'], 0, 0, 96, 128, 0, 0, 96, 128);
    this.image =image;
    this.isMoving = false; // 移動フラグ(移動中なら「true」)
    this.direction = 0;    // 向き
    // 歩行アニメーションの基準フレーム番号を保持するプロパティ
    this.walk = 0;
    // 攻撃アクション中のフレーム数を保持するプロパティ
    this.acount = 0;
    // 「enterframe」イベントリスナ
    this.addEventListener('enterframe', function() {

      // プレイヤーの移動処理

      // 歩行アニメーションのフレーム切り替え
      this.frame = this.direction * 3 + this.walk;
      // 移動中の処理
      if (this.isMoving) {
        // 「vx」「vy」プロパティの分だけ移動する
        this.moveBy(this.vx, this.vy);
        // 歩行アニメーションの基準フレーム番号を取得する
        this.walk = core.frame % 3;
          // 次のマス(16x16が1マス)まで移動しきったら停止する
          if ((this.vx && (this.x - 8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
            this.isMoving = false;
            this.walk = 0;
          }
      } else {
        // 移動中でないときは、パッドやキーの入力に応じて、向きや移動先を設定する
        this.vx = this.vy = 0;
        if (core.input.left) {
          this.direction = 1;
          this.vx = -4;
        } else if (core.input.right) {
          this.direction = 2;
          this.vx = 4;
        } else if (core.input.up) {
          this.direction = 3;
          this.vy = -4;
        } else if (core.input.down) {
          this.direction = 0;
          this.vy = 4;
        }
        // 移動先が決まったら、
        if (this.vx || this.vy) {
          // 移動先の座標を求める
          var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
          var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
          // その座標が移動可能な場所なら
          if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
            // 移動フラグを「true」にする
            this.isMoving = true;
            // 自身(「enterframe」イベントリスナ)を呼び出す
            // (歩行アニメーションをスムーズに表示するため)
            arguments.callee.call(this);
          }
        }
      }
    });
  }
});

// NPCを作成するクラス
var Npc = enchant.Class.create(enchant.Sprite, {
  initialize: function(x, y , no , map) {
    enchant.Sprite.call(this, 32, 32);
    this.x = x;
    this.y = y;
    this.kind = no; // NPCの種類
    // サーフィスを作成する
    var image = new Surface(96, 128);
    // NPCの種類に応じた領域の画像をサーフィスに描画する
    switch (this.kind) {
      case 0: image.draw(core.assets['chara0.png'], 0, 0, 96, 128, 0, 0, 96, 128);
        break;
      case 1: image.draw(core.assets['chara0.png'], 96, 0, 96, 128, 0, 0, 96, 128);
        break;
      case 2: image.draw(core.assets['chara0.png'], 192, 0, 96, 128, 0, 0, 96, 128);
        break;
    }
    this.image = image; //サーフィスの画像をスプライトの画像に設定する
    this.isMoving = false; // 移動フラグ(移動中なら「true」)
    this.noMoving = false; // 動くNPCなら「false」、動かないNPCなら「true」
    this.direction = 0;    // 向き
    // 歩行アニメーションの基準フレーム番号を保持するプロパティ
    this.walk = 0;
    this.frame = 0;
    // 「enterframe」イベントリスナ
    this.addEventListener('enterframe', function() {
      if (this.noMoving) return; // 動かないNPCならリターン
      
      // NPCの移動処理
      
      // 歩行アニメーションのフレーム切り替え
      this.frame = this.direction * 3 + this.walk;
      
      // 移動中の処理
      if (this.isMoving) {
        this.moveBy(this.vx, this.vy);
        this.walk = core.frame % 3;
        if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
          this.isMoving = false;
          this.walk = 0;
        }
      } else {
        // 移動中でないときは、ランダムに移動方向を設定する
        this.vx = this.vy = 0;
        this.mov = rand(4);
        if (this.mov == 1) {
          this.direction = 1;
          this.vx = -4;
        } else if (this.mov == 2) {
          this.direction = 2;
          this.vx = 4;
        } else if (this.mov == 3) {
          this.direction = 3;
          this.vy = -4;
        } else if (this.mov == 0) {
          this.direction = 0;
          this.vy = 4;
        }
         // 移動先が決まったら
        if (this.vx || this.vy) {
          // 移動先の座標を求める
          var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
          var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
          // その座標が移動可能な場所なら
          if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
            // 移動フラグを「true」にする
            this.isMoving = true;
            // 自身(「enterframe」イベントリスナ)を呼び出す
            // (歩行アニメーションをスムーズに表示するため)
            arguments.callee.call(this);
          }
        }
      }
    });
  }
});

// 定数

// エンカウント確率(5 / ENCOUNT_BASE_RATE)
ENCOUNT_BASE_RATE = 1000;

// モンスターテーブル(JSON)
//  image : モンスターの画像ファイル名
//  hp    : モンスターのHP
//  speed : モンスターの移動スピード
//  exp   : 取得経験値
//  attack: モンスターの攻撃力
//  coin  : 取得コイン
//  drop  : 落とす武器
//  rate  : 武器を落とす確率の分子
var monstorTable = {
  0: {image:'monster/monster1.gif', hp:100, speed:1, exp:10, attack:1, coin:10, drop:3, rate:50},
  1: {image:'monster/monster2.gif', hp:200, speed:2, exp:20, attack:2, coin:20, drop:4, rate:40},
  2: {image:'monster/monster3.gif', hp:300, speed:2, exp:30, attack:3, coin:30, drop:5, rate:30},
  3: {image:'monster/monster4.gif', hp:400, speed:1, exp:40, attack:4, coin:40, drop:6, rate:25},
  4: {image:'monster/monster5.gif', hp:700, speed:1, exp:20, attack:5, coin:60, drop:7, rate:20},
  5: {image:'monster/monster6.gif', hp:800, speed:1, exp:30, attack:5, coin:60, drop:8, rate:15},
  6: {image:'monster/monster7.gif', hp:500, speed:2, exp:50, attack:5, coin:15, drop:9, rate:10},
  7: {image:'monster/bigmonster1.gif', hp:3000, speed:4, exp:1000, attack:30, coin:1000, drop:13, rate:50},
  8: {image:'monster/bigmonster2.gif', hp:4000, speed:3, exp:1000, attack:40, coin:1000, drop:14, rate:100},
}

var playerStatus = {
  lv: 1,         // レベル
  maxhp: 1000,   // 最大HP
  hp: 1000,      // 現在HP
  exp: 0,        // 経験値
  attack: 1,     // 攻撃力
  coin: 0,       // 所持コイン
  weapon: 0,     // 装備武器
}

// 武器テーブル
// no    : 番号
// name  : 名前
// attack: 攻撃力
var weapon = {
  0: {no:2002, name:'ブロンズソード', attack:1},
  1: {no:2004, name:'ブラスソード', attack:2},
  2: {no:2005, name:'アイアンソード', attack:3},
  3: {no:2009, name:'スチールソード', attack:4},
  4: {no:2010, name:'ヘヴィソード', attack:5},
  5: {no:2019, name:'ブロードソード', attack:6},
  6: {no:2020, name:'クレイモア', attack:6},
  7: {no:2054, name:'スラッシュレイピア', attack:7},
  8: {no:2055, name:'サーベル', attack:8},
  9: {no:2044, name:'ブレイズソード', attack:9},
  10: {no:2091, name:'ブレイズブレイド', attack:10},
  11: {no:2091, name:'アクアブレイド', attack:11},
  12: {no:2073, name:'バラの宝剣', attack:12},
  13: {no:2098, name:'ドラゴンキラー', attack:13},
  14: {no:2506, name:'王家の剣', attack:14},
  15: {no:2514, name:'ダークブレイド', attack:15},
  16: {no:2597, name:'プロミネンスソード', attack:20},
}

// 町のマップデータ
var town = {
  'bg1': [
    [20,20,20,20,20,20,20,20,20,20,20,20,20,48,49,49,49,49,33,33,33,33,33,33,33,33,33,33,33,33],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,48,49,49,49,49,49,49,49,49,49,49,49],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,48,49],
    [20,20,20,20,20,20,20,20,20,20,20,4,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,81,81,81,81,81,81,81,81,4,20,20,20,20,20,20,20,81,81,81,81,81,81,81,81,20,20,5],
    [20,20,20,81,81,81,81,81,81,81,81,37,37,37,37,20,20,20,20,81,81,81,81,81,81,66,66,20,20,5],
    [20,20,20,81,81,81,81,81,81,81,81,37,37,37,37,37,20,20,20,81,81,81,81,81,81,81,81,20,20,20],
    [20,20,20,81,81,81,81,81,81,81,81,37,37,37,37,37,37,37,37,81,81,81,81,81,81,81,81,20,20,20],
    [20,20,20,81,81,81,81,81,81,81,81,37,37,37,37,37,37,37,37,81,81,81,81,81,81,81,81,20,20,20],
    [20,20,20,81,81,81,81,81,81,81,81,37,37,37,37,37,37,37,37,81,81,81,81,81,81,81,81,20,20,20],
    [20,20,20,81,81,81,81,81,81,81,81,37,37,37,37,37,37,37,20,81,81,81,81,81,81,81,81,20,20,20],
    [20,20,20,20,35,19,83,85,20,20,37,37,37,37,37,37,37,37,20,20,20,20,83,85,20,20,20,20,20,20],
    [20,20,20,20,35,19,99,101,20,20,37,37,37,37,37,37,37,37,37,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,35,35,19,99,101,20,20,37,20,20,20,20,37,20,20,20,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,20,20,19,99,101,20,20,20,20,20,20,20,37,20,20,20,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,20,19,19,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,20,19,19,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,20,19,19,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,20,19,19,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20],
    [20,20,20,20,19,19,99,100,84,84,84,84,84,84,84,84,84,84,84,84,84,84,100,101,20,20,20,20,20,20],
    [20,20,20,20,19,19,115,116,116,116,116,116,116,116,100,100,116,116,116,116,116,116,116,117,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,16,17,17,17,17,17,17],
    [84,84,84,84,84,85,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,16,33,33,33,33,33,49,49],
    [100,100,100,100,100,101,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,32,33,33,49,49,50,20,20],
    [100,100,100,100,101,132,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,32,33,50,20,20,20,20,20],
    [100,100,100,100,117,132,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,32,34,20,20,20,20,20,20],
    [100,100,100,101,36,36,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,32,34,20,20,20,20,20,20],
    [100,100,100,101,36,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,32,34,20,20,20,20,20,20]
  ],
  'bg2': [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,33,33],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,60,61,-1,-1,-1,60,61,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,76,77,-1,-1,-1,76,77,-1,-1,-1,76,77,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,7,23,23,23,23,23,23,7,-1,-1,-1,-1,-1,-1,-1,-1,7,23,23,23,23,23,23,7,60,61,-1],
    [-1,60,61,7,29,-1,-1,27,-1,13,7,60,61,-1,-1,-1,-1,-1,-1,7,29,-1,27,27,-1,13,7,76,77,-1],
    [-1,76,77,7,-1,-1,-1,-1,-1,-1,7,76,77,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,7,-1,-1,-1],
    [-1,-1,-1,7,38,38,38,38,38,38,7,-1,-1,-1,-1,-1,28,-1,-1,7,38,38,38,38,38,38,7,60,61,-1],
    [-1,60,61,7,-1,-1,-1,-1,-1,11,7,60,61,-1,28,-1,-1,-1,-1,7,11,-1,-1,-1,-1,-1,7,76,77,-1],
    [-1,76,77,7,-1,-1,-1,-1,-1,11,7,76,77,-1,-1,-1,-1,-1,-1,7,11,-1,-1,-1,-1,-1,7,-1,-1,-1],
    [-1,-1,-1,23,23,23,-1,-1,23,23,23,-1,-1,-1,-1,-1,28,-1,-1,23,23,23,-1,-1,23,23,23,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,59,-1,-1,-1,-1,-1,28,-1,-1],
    [-1,-1,-1,-1,-1,75,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,75,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1],
    [-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,76,77,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1],
    [-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,76,77,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,28,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,28,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ],
  collisionData: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,0,0,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,1,1,0],
    [0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0],
    [0,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0],
    [0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0]
  ],
  fg: [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,33,33],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,60,61,-1,-1,-1,60,61,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1],
    [-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1],
    [-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ]
} 

// バトルフィールドのマップデータ
var field = {
  'bg1': [
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,67,36,36,36,19,19,19,19,19,19,19,19,19],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,16],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,16,33],
    [36,36,36,36,36,36,36,36,36,36,83,100,84,36,36,36,36,36,36,36,36,36,36,36,36,36,16,17,33,33],
    [36,36,36,36,36,36,36,36,36,83,100,100,100,84,36,36,36,36,36,36,36,36,36,36,36,16,33,33,33,33],
    [36,36,36,36,36,36,36,36,83,100,100,100,100,100,36,36,36,36,36,36,36,36,36,36,16,33,33,33,33,33],
    [36,36,36,36,36,36,36,83,100,100,100,100,100,100,84,84,84,84,100,85,36,36,36,52,32,33,33,33,33,33],
    [36,36,36,36,36,36,36,100,100,100,100,100,100,100,100,100,100,100,100,100,85,36,36,36,48,33,33,33,33,33],
    [36,36,36,36,36,36,36,100,100,100,100,100,100,100,100,100,100,100,100,100,101,36,36,36,36,48,33,33,33,33],
    [36,36,36,36,36,36,83,100,100,116,116,116,116,116,100,100,100,100,100,100,101,36,36,36,36,36,48,33,33,33],
    [36,36,36,36,36,36,100,100,101,36,36,36,36,36,99,100,100,100,100,100,101,36,36,36,36,36,36,48,33,33],
    [36,36,36,36,36,83,100,100,101,36,36,36,36,36,99,100,100,100,100,100,100,85,36,36,36,36,36,36,48,33],
    [36,36,36,36,36,100,100,100,100,84,84,84,84,84,100,100,100,100,100,100,100,101,36,36,36,36,36,36,36,48],
    [36,36,36,36,36,99,100,116,116,100,100,116,116,100,100,100,100,100,100,100,100,101,36,36,36,36,36,36,36,36],
    [36,36,36,36,83,100,101,36,36,116,116,36,36,99,100,100,100,100,100,100,100,101,36,36,36,36,36,36,36,36],
    [36,36,36,36,115,116,100,85,36,36,36,36,36,115,100,100,100,100,100,100,100,100,84,84,84,85,36,36,36,36],
    [36,36,36,36,36,36,115,101,36,36,36,36,36,36,115,100,100,100,100,116,116,100,116,116,116,100,36,36,36,36],
    [36,36,36,36,36,36,36,100,85,36,36,36,36,36,36,99,100,116,117,36,36,101,36,36,21,115,85,36,36,36],
    [36,36,36,36,36,36,36,115,100,36,36,36,36,36,36,115,117,36,36,36,83,101,36,36,36,21,115,85,36,36],
    [36,36,36,36,36,36,36,36,100,84,85,36,36,36,36,36,36,36,36,83,100,117,36,36,36,36,36,100,36,36],
    [36,36,36,36,36,36,36,36,116,100,101,36,36,36,36,83,100,116,116,116,116,16,17,17,17,17,17,17,17,17],
    [36,36,36,36,36,36,36,36,36,116,100,84,84,84,84,116,117,36,36,36,36,32,33,33,49,49,49,49,49,49],
    [36,36,36,36,36,36,36,36,36,36,115,116,116,116,117,36,36,36,36,36,36,32,33,50,20,20,20,20,20,20],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,32,34,20,36,36,36,36,36,36],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,32,34,36,36,36,36,36,36,36],
    [36,36,36,36,67,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,32,34,36,36,36,36,36,36,36],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,32,34,36,36,36,36,36,36,36],
    [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,32,34,36,36,36,36,36,36,36]
  ],
  'bg2': [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,7,7,7,7,7,7,7,7,7],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,23,23,23,23,23,23,23,23,23,23],
    [-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,28,-1,-1,-1,-1,-1,107,107,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,107,107,107,107,107,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,28,-1,-1,-1,-1,-1,-1],
    [-1,-1,28,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,28,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,28,-1,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,28,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,28],
    [-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,107,107,107,-1,-1,-1,-1],
    [-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,107,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,59,-1,-1,107,-1],
    [-1,-1,-1,-1,107,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,75,-1,-1,107,-1],
    [-1,-1,-1,-1,107,-1,-1,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,-1,-1],
    [-1,-1,-1,-1,-1,-1,59,107,107,-1,-1,-1,-1,-1,-1,-1,-1,107,107,107,107,-1,-1,-1,-1,-1,-1,6,-1,-1],
    [-1,-1,-1,-1,-1,-1,75,107,107,107,-1,-1,-1,-1,-1,107,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,107,-1,-1,107,107,107,107,107,107,107,107,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,-1,107,107],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,107,-1,107,107],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,107,-1,-1,-1,107],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,107,107,-1,107,107],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,107,107,107,107,107,107]
  ],
  collisionData: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1],
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
  ]
} 
