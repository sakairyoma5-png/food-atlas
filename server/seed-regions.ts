import { storage } from "./storage";

const regionData = [
  // アジア
  { name: "Japan", nameJa: "日本", continent: "Asia", description: "島国で独自の料理文化を持つ", culturalInfo: "和食はユネスコ無形文化遺産に登録されています" },
  { name: "China", nameJa: "中国", continent: "Asia", description: "多様な地域料理が特徴", culturalInfo: "八大料理系統があり、それぞれ独自の味わいがあります" },
  { name: "Thailand", nameJa: "タイ", continent: "Asia", description: "辛味と甘味のバランスが特徴", culturalInfo: "ハーブとスパイスを多用した料理が特徴です" },
  { name: "India", nameJa: "インド", continent: "Asia", description: "スパイスの宝庫", culturalInfo: "地域や宗教によって食文化が大きく異なります" },
  { name: "Korea", nameJa: "韓国", continent: "Asia", description: "発酵食品が豊富", culturalInfo: "キムチなどの発酵食品が日常的に食べられています" },
  { name: "Vietnam", nameJa: "ベトナム", continent: "Asia", description: "フレッシュなハーブが特徴", culturalInfo: "フォーは国民的料理として愛されています" },
  
  // ヨーロッパ
  { name: "Italy", nameJa: "イタリア", continent: "Europe", description: "パスタとピザの本場", culturalInfo: "地域ごとに独自の料理伝統があります" },
  { name: "France", nameJa: "フランス", continent: "Europe", description: "世界的に有名な料理文化", culturalInfo: "フランス料理はユネスコ無形文化遺産です" },
  { name: "Spain", nameJa: "スペイン", continent: "Europe", description: "タパス文化が有名", culturalInfo: "小皿料理を楽しむタパス文化が根付いています" },
  { name: "Greece", nameJa: "ギリシャ", continent: "Europe", description: "地中海料理の代表", culturalInfo: "オリーブオイルとヨーグルトをよく使います" },
  
  // アメリカ大陸
  { name: "Mexico", nameJa: "メキシコ", continent: "North America", description: "トウモロコシとチリが基本", culturalInfo: "メキシコ料理はユネスコ無形文化遺産です" },
  { name: "USA", nameJa: "アメリカ", continent: "North America", description: "多様な移民料理の融合", culturalInfo: "バーベキューやハンバーガーなどが有名です" },
  { name: "Brazil", nameJa: "ブラジル", continent: "South America", description: "シュラスコが有名", culturalInfo: "ポルトガルとアフリカの影響を受けた料理です" },
  { name: "Peru", nameJa: "ペルー", continent: "South America", description: "新鮮な魚介類を使う", culturalInfo: "セビーチェは代表的な料理です" },
  
  // 中東・アフリカ
  { name: "Turkey", nameJa: "トルコ", continent: "Middle East", description: "東西の文化が融合", culturalInfo: "ケバブやバクラヴァなどが有名です" },
  { name: "Morocco", nameJa: "モロッコ", continent: "Africa", description: "スパイスを効かせたタジン", culturalInfo: "タジン鍋で煮込んだ料理が特徴です" },
  { name: "Lebanon", nameJa: "レバノン", continent: "Middle East", description: "メゼ（前菜）文化", culturalInfo: "フムスやタブーレなどのメゼが豊富です" },
  
  // オセアニア
  { name: "Australia", nameJa: "オーストラリア", continent: "Oceania", description: "多文化の融合料理", culturalInfo: "新鮮な食材とアジア料理の影響があります" },
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
