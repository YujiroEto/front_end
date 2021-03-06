enchant();

window.onload = function() {
  core = new Core(320, 320);
  core.fps = 15;
  
  // 使用する画像ファイルを読み込む
  core.preload('map1.png', 'chara5.png', 'chara6.png', 'piece.png',
               'start.png', 'end.png','button.png');

  core.onload = function() {

    // マップを作成する
    map = new Map(16, 16);
    map.image = core.assets['map1.png'];
    map.loadData(Field.Bg1, Field.Bg2);
    map.collisionData = Field.CollisionData;
    // フォアグラウンドのマップを作成する
    var foregroundMap = new Map(16, 16);
    foregroundMap.image = core.assets['map1.png'];
    foregroundMap.loadData(Field.Foreground);

    // 「stage」グループを作成する 
    stage = new Group();
    // 「stage」グループにマップを追加する
    stage.addChild(map);

    // 「stage」グループにフォラグランドマップを追加する
    stage.addChild(foregroundMap);
    // rootSceneに「stage」グループを追加する
    core.rootScene.addChild(stage);

  }
  core.start();
}

// マップデータ
var Field ={
  Bg1:[ // バックグラウンド1
    [20,20,20,20,20,20,20,20,20,20,20,20,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33],
    [20,20,20,20,20,20,20,20,20,20,20,20,48,49,49,49,33,33,33,33,33,33,33,33,33,33,33,33,33,33],
    [20,20,20,83,84,84,85,20,20,20,20,20,20,20,20,20,48,49,49,49,49,49,49,49,49,49,49,49,49,49],
    [20,20,20,99,100,100,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,115,100,100,117,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,99,100,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,85,20],
    [20,20,20,20,115,116,116,116,116,116,116,116,116,100,100,116,116,116,116,116,116,116,116,116,116,116,116,116,117,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,16,17,17,18,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,32,33,33,34,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,32,33,33,34,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,48,49,49,50,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,80,80,80,80,80,80,80,80,80,80,80,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20]
  ],
  Bg2:[ // バックグラウンド2
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,28,28,-1,-1,-1,76,77,-1,-1,-1,-1,-1,-1],
    [-1,-1,28,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,76,77,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,28,28,28,28,-1,-1,-1,-1,75,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,28,28,28,28,28,28,-1,-1,-1,-1,-1,-1,-1,-1,7,23,23,23,23,23,23,23,23,-1,7,-1,-1],
    [-1,-1,28,28,-1,-1,-1,-1,28,28,-1,-1,-1,-1,-1,-1,-1,7,27,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1],
    [-1,-1,28,28,-1,-1,-1,-1,28,28,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,7,23,23,23,23,7,-1,-1],
    [-1,-1,28,28,-1,-1,-1,-1,28,28,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,7,29,-1,-1,-1,7,-1,-1],
    [-1,-1,28,28,-1,-1,-1,-1,28,28,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,7,-1,-1,-1,-1,7,-1,-1],
    [-1,-1,-1,28,28,28,28,28,28,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,23,23,23,38,38,38,38,7,-1,-1],
    [-1,-1,-1,-1,28,28,28,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,11,-1,-1,-1,-1,-1,-1,7,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,76,77,-1,-1,-1,-1,-1,-1,-1,7,23,23,23,23,23,23,-1,-1,-1,7,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1],
    [-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,7,-1,-1,-1,-1,-1,-1,-1,7,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,23,-1,23,23,23,23,23,23,23,23,23,-1,-1],
    [-1,-1,-1,-1,60,61,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,76,77,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,60,61,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,76,77,-1,-1,-1,76,77,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ],
  CollisionData:[ // バックグラウンの衝突判定
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ],
  Foreground:[ // フォラグランド
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,60,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,60,61,-1,-1,-1,60,61,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ]};
