import { storage } from "./storage";

const regionData = [
  // アジア
  { 
    name: "Japan", 
    nameJa: "日本", 
    country: "日本",
    continent: "Asia", 
    description: "島国で独自の料理文化を持つ", 
    culturalInfo: "和食はユネスコ無形文化遺産に登録されています",
    sampleDishes: ["寿司", "天ぷら"]
  },
  { 
    name: "China", 
    nameJa: "中国", 
    country: "中国",
    continent: "Asia", 
    description: "多様な地域料理が特徴", 
    culturalInfo: "八大料理系統があり、それぞれ独自の味わいがあります",
    sampleDishes: ["麻婆豆腐", "北京ダック"]
  },
  { 
    name: "Thailand", 
    nameJa: "タイ", 
    country: "タイ",
    continent: "Asia", 
    description: "辛味と甘味のバランスが特徴", 
    culturalInfo: "ハーブとスパイスを多用した料理が特徴です",
    sampleDishes: ["ガパオライス", "トムヤムクン"]
  },
  { 
    name: "India", 
    nameJa: "インド", 
    country: "インド",
    continent: "Asia", 
    description: "スパイスの宝庫", 
    culturalInfo: "地域や宗教によって食文化が大きく異なります",
    sampleDishes: ["バターチキン", "ビリヤニ"]
  },
  { 
    name: "Korea", 
    nameJa: "韓国", 
    country: "韓国",
    continent: "Asia", 
    description: "発酵食品が豊富", 
    culturalInfo: "キムチなどの発酵食品が日常的に食べられています",
    sampleDishes: ["ビビンバ", "キムチチゲ"]
  },
  { 
    name: "Vietnam", 
    nameJa: "ベトナム", 
    country: "ベトナム",
    continent: "Asia", 
    description: "フレッシュなハーブが特徴", 
    culturalInfo: "フォーは国民的料理として愛されています",
    sampleDishes: ["フォー", "バインセオ"]
  },
  
  // ヨーロッパ
  { 
    name: "Italy", 
    nameJa: "イタリア", 
    country: "イタリア",
    continent: "Europe", 
    description: "パスタとピザの本場", 
    culturalInfo: "地域ごとに独自の料理伝統があります",
    sampleDishes: ["カルボナーラ", "マルゲリータ"]
  },
  { 
    name: "Southern Italy", 
    nameJa: "南イタリア", 
    country: "イタリア",
    continent: "Europe", 
    description: "トマトとオリーブオイルが特徴", 
    culturalInfo: "地中海の恵みを活かした料理が豊富です",
    sampleDishes: ["カポナータ", "アランチーニ"]
  },
  { 
    name: "Northern Italy", 
    nameJa: "北イタリア", 
    country: "イタリア",
    continent: "Europe", 
    description: "バターとチーズを使った料理", 
    culturalInfo: "リゾットやポレンタが有名です",
    sampleDishes: ["リゾット", "ポレンタ"]
  },
  { 
    name: "France", 
    nameJa: "フランス", 
    country: "フランス",
    continent: "Europe", 
    description: "世界的に有名な料理文化", 
    culturalInfo: "フランス料理はユネスコ無形文化遺産です",
    sampleDishes: ["コックオーヴァン", "クロワッサン"]
  },
  { 
    name: "Basque", 
    nameJa: "バスク", 
    country: "フランス・スペイン",
    continent: "Europe", 
    description: "山と海の幸を活かした料理", 
    culturalInfo: "独自の食文化を持つ地域です",
    sampleDishes: ["ピペラード", "バスクチーズケーキ"]
  },
  { 
    name: "Spain", 
    nameJa: "スペイン", 
    country: "スペイン",
    continent: "Europe", 
    description: "タパス文化が有名", 
    culturalInfo: "小皿料理を楽しむタパス文化が根付いています",
    sampleDishes: ["パエリア", "ガスパチョ"]
  },
  { 
    name: "Greece", 
    nameJa: "ギリシャ", 
    country: "ギリシャ",
    continent: "Europe", 
    description: "地中海料理の代表", 
    culturalInfo: "オリーブオイルとヨーグルトをよく使います",
    sampleDishes: ["ムサカ", "ギリシャサラダ"]
  },
  
  // アメリカ大陸
  { 
    name: "Mexico", 
    nameJa: "メキシコ", 
    country: "メキシコ",
    continent: "North America", 
    description: "トウモロコシとチリが基本", 
    culturalInfo: "メキシコ料理はユネスコ無形文化遺産です",
    sampleDishes: ["タコス", "ポソレ"]
  },
  { 
    name: "USA", 
    nameJa: "アメリカ", 
    country: "アメリカ",
    continent: "North America", 
    description: "多様な移民料理の融合", 
    culturalInfo: "バーベキューやハンバーガーなどが有名です",
    sampleDishes: ["ハンバーガー", "バーベキューリブ"]
  },
  { 
    name: "Brazil", 
    nameJa: "ブラジル", 
    country: "ブラジル",
    continent: "South America", 
    description: "シュラスコが有名", 
    culturalInfo: "ポルトガルとアフリカの影響を受けた料理です",
    sampleDishes: ["シュラスコ", "フェジョアーダ"]
  },
  { 
    name: "Peru", 
    nameJa: "ペルー", 
    country: "ペルー",
    continent: "South America", 
    description: "新鮮な魚介類を使う", 
    culturalInfo: "セビーチェは代表的な料理です",
    sampleDishes: ["セビーチェ", "ロモサルタード"]
  },
  
  // 中東・アフリカ
  { 
    name: "Turkey", 
    nameJa: "トルコ", 
    country: "トルコ",
    continent: "Middle East", 
    description: "東西の文化が融合", 
    culturalInfo: "ケバブやバクラヴァなどが有名です",
    sampleDishes: ["ケバブ", "バクラヴァ"]
  },
  { 
    name: "Morocco", 
    nameJa: "モロッコ", 
    country: "モロッコ",
    continent: "Africa", 
    description: "スパイスを効かせたタジン", 
    culturalInfo: "タジン鍋で煮込んだ料理が特徴です",
    sampleDishes: ["タジン", "クスクス"]
  },
  { 
    name: "Lebanon", 
    nameJa: "レバノン", 
    country: "レバノン",
    continent: "Middle East", 
    description: "メゼ（前菜）文化", 
    culturalInfo: "フムスやタブーレなどのメゼが豊富です",
    sampleDishes: ["フムス", "タブーレ"]
  },
  
  // オセアニア
  { 
    name: "Australia", 
    nameJa: "オーストラリア", 
    country: "オーストラリア",
    continent: "Oceania", 
    description: "多文化の融合料理", 
    culturalInfo: "新鮮な食材とアジア料理の影響があります",
    sampleDishes: ["ミートパイ", "パブロバ"]
  },
];

async function seedRegions() {
  console.log("地域データのシードを開始します...");
  
  for (const region of regionData) {
    try {
      const existing = await storage.getRegionByName(region.name);
      if (!existing) {
        await storage.createRegion(region);
        console.log(`✓ ${region.nameJa} (${region.name}) を追加しました`);
      } else {
        console.log(`- ${region.nameJa} (${region.name}) は既に存在します`);
      }
    } catch (error) {
      console.error(`✗ ${region.name} の追加に失敗しました:`, error);
    }
  }
  
  console.log("地域データのシードが完了しました！");
  process.exit(0);
}

seedRegions().catch((error) => {
  console.error("シード処理でエラーが発生しました:", error);
  process.exit(1);
});
