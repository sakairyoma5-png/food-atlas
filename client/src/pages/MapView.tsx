import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import { useLocation } from "wouter";
import caponataImg from "@assets/generated_images/Italian_caponata_dish_c8849bba.png";
import thaiImg from "@assets/generated_images/Thai_basil_stir-fry_dish_cacb8d40.png";
import indianImg from "@assets/generated_images/Indian_butter_chicken_curry_792b4e83.png";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 世界の代表的な料理データ（国別）
const dishesbyCountry: Record<string, Array<{
  id: string;
  name: string;
  region: string;
  description: string;
  cookingTime: number;
  calories: number;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
}>> = {
  "Italy": [
    {
      id: "caponata-1",
      name: "カポナータ",
      region: "イタリア - 南イタリア",
      description: "シチリアの伝統的な野菜料理",
      cookingTime: 15,
      calories: 180,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
    {
      id: "carbonara-1",
      name: "カルボナーラ",
      region: "イタリア - ローマ",
      description: "クリーミーなパスタの定番",
      cookingTime: 20,
      calories: 520,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Thailand": [
    {
      id: "gapao-1",
      name: "ガパオライス",
      region: "タイ",
      description: "バジルの香りが食欲をそそる",
      cookingTime: 20,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "tom-yum-1",
      name: "トムヤムクン",
      region: "タイ",
      description: "辛酸っぱいスープの代表格",
      cookingTime: 30,
      calories: 150,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "India": [
    {
      id: "butter-chicken-1",
      name: "バターチキン",
      region: "インド - 北インド",
      description: "まろやかなトマトクリームソース",
      cookingTime: 30,
      calories: 510,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "biryani-1",
      name: "ビリヤニ",
      region: "インド",
      description: "スパイス香る炊き込みご飯",
      cookingTime: 45,
      calories: 450,
      imageUrl: indianImg,
      difficulty: "hard",
    },
  ],
  "Japan": [
    {
      id: "ramen-1",
      name: "ラーメン",
      region: "日本",
      description: "日本の国民食",
      cookingTime: 40,
      calories: 480,
      imageUrl: thaiImg,
      difficulty: "hard",
    },
  ],
  "France": [
    {
      id: "ratatouille-1",
      name: "ラタトゥイユ",
      region: "フランス - プロヴァンス",
      description: "夏野菜の煮込み料理",
      cookingTime: 35,
      calories: 200,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Mexico": [
    {
      id: "tacos-1",
      name: "タコス",
      region: "メキシコ",
      description: "手軽に楽しめる伝統料理",
      cookingTime: 25,
      calories: 350,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
  ],
  "China": [
    {
      id: "mapo-tofu-1",
      name: "麻婆豆腐",
      region: "中国 - 四川省",
      description: "ピリ辛で香り高い定番料理",
      cookingTime: 25,
      calories: 380,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "fried-rice-1",
      name: "チャーハン",
      region: "中国",
      description: "シンプルで美味しい炒飯",
      cookingTime: 15,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
  ],
  "South Korea": [
    {
      id: "bibimbap-1",
      name: "ビビンバ",
      region: "韓国",
      description: "色とりどりの野菜とご飯",
      cookingTime: 30,
      calories: 480,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "kimchi-jjigae-1",
      name: "キムチチゲ",
      region: "韓国",
      description: "辛くて温まるキムチ鍋",
      cookingTime: 35,
      calories: 320,
      imageUrl: indianImg,
      difficulty: "easy",
    },
  ],
  "Vietnam": [
    {
      id: "pho-1",
      name: "フォー",
      region: "ベトナム",
      description: "優しい味わいの米麺スープ",
      cookingTime: 40,
      calories: 350,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "banh-mi-1",
      name: "バインミー",
      region: "ベトナム",
      description: "フランスパンのサンドイッチ",
      cookingTime: 20,
      calories: 380,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Spain": [
    {
      id: "paella-1",
      name: "パエリア",
      region: "スペイン - バレンシア",
      description: "サフラン香る海鮮の炊き込みご飯",
      cookingTime: 50,
      calories: 520,
      imageUrl: thaiImg,
      difficulty: "hard",
    },
    {
      id: "tapas-1",
      name: "タパス",
      region: "スペイン",
      description: "小皿料理の盛り合わせ",
      cookingTime: 30,
      calories: 300,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Greece": [
    {
      id: "moussaka-1",
      name: "ムサカ",
      region: "ギリシャ",
      description: "ナスとひき肉の重ね焼き",
      cookingTime: 60,
      calories: 480,
      imageUrl: indianImg,
      difficulty: "hard",
    },
    {
      id: "gyros-1",
      name: "ギロス",
      region: "ギリシャ",
      description: "ピタパンに包んだ肉料理",
      cookingTime: 25,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Turkey": [
    {
      id: "kebab-1",
      name: "ケバブ",
      region: "トルコ",
      description: "スパイスが効いた串焼き肉",
      cookingTime: 30,
      calories: 450,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "baklava-1",
      name: "バクラヴァ",
      region: "トルコ",
      description: "ナッツとはちみつの甘いお菓子",
      cookingTime: 45,
      calories: 380,
      imageUrl: caponataImg,
      difficulty: "hard",
    },
  ],
  "United States of America": [
    {
      id: "burger-1",
      name: "ハンバーガー",
      region: "アメリカ",
      description: "ジューシーなパティとバンズ",
      cookingTime: 20,
      calories: 580,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
    {
      id: "bbq-ribs-1",
      name: "BBQリブ",
      region: "アメリカ - 南部",
      description: "甘辛いソースのスペアリブ",
      cookingTime: 90,
      calories: 650,
      imageUrl: indianImg,
      difficulty: "hard",
    },
  ],
  "Brazil": [
    {
      id: "feijoada-1",
      name: "フェイジョアーダ",
      region: "ブラジル",
      description: "豆と肉の煮込み料理",
      cookingTime: 120,
      calories: 520,
      imageUrl: indianImg,
      difficulty: "hard",
    },
    {
      id: "churrasco-1",
      name: "シュラスコ",
      region: "ブラジル",
      description: "串焼きの肉料理",
      cookingTime: 40,
      calories: 580,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Argentina": [
    {
      id: "asado-1",
      name: "アサード",
      region: "アルゼンチン",
      description: "炭火で焼いた肉の盛り合わせ",
      cookingTime: 90,
      calories: 620,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "empanada-1",
      name: "エンパナーダ",
      region: "アルゼンチン",
      description: "肉や野菜を包んだパイ",
      cookingTime: 35,
      calories: 320,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Morocco": [
    {
      id: "tagine-1",
      name: "タジン",
      region: "モロッコ",
      description: "スパイス香る鍋料理",
      cookingTime: 75,
      calories: 420,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "couscous-1",
      name: "クスクス",
      region: "モロッコ",
      description: "粒々のパスタと野菜",
      cookingTime: 40,
      calories: 350,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Ethiopia": [
    {
      id: "injera-1",
      name: "インジェラ",
      region: "エチオピア",
      description: "発酵させた薄いパン",
      cookingTime: 30,
      calories: 280,
      imageUrl: caponataImg,
      difficulty: "hard",
    },
    {
      id: "doro-wat-1",
      name: "ドロワット",
      region: "エチオピア",
      description: "スパイシーな鶏肉の煮込み",
      cookingTime: 60,
      calories: 450,
      imageUrl: indianImg,
      difficulty: "medium",
    },
  ],
  "Indonesia": [
    {
      id: "nasi-goreng-1",
      name: "ナシゴレン",
      region: "インドネシア",
      description: "甘辛いインドネシア風炒飯",
      cookingTime: 20,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
    {
      id: "rendang-1",
      name: "ルンダン",
      region: "インドネシア - スマトラ",
      description: "スパイシーなココナッツカレー",
      cookingTime: 120,
      calories: 550,
      imageUrl: indianImg,
      difficulty: "hard",
    },
  ],
  "Malaysia": [
    {
      id: "nasi-lemak-1",
      name: "ナシレマ",
      region: "マレーシア",
      description: "ココナッツライスの朝食",
      cookingTime: 30,
      calories: 480,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "laksa-1",
      name: "ラクサ",
      region: "マレーシア",
      description: "スパイシーなココナッツヌードル",
      cookingTime: 40,
      calories: 420,
      imageUrl: indianImg,
      difficulty: "medium",
    },
  ],
  "Philippines": [
    {
      id: "adobo-1",
      name: "アドボ",
      region: "フィリピン",
      description: "酢と醤油で煮込んだ肉料理",
      cookingTime: 50,
      calories: 380,
      imageUrl: indianImg,
      difficulty: "easy",
    },
    {
      id: "sinigang-1",
      name: "シニガン",
      region: "フィリピン",
      description: "酸っぱいタマリンドスープ",
      cookingTime: 45,
      calories: 280,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Pakistan": [
    {
      id: "nihari-1",
      name: "ニハリ",
      region: "パキスタン",
      description: "スパイシーな肉のシチュー",
      cookingTime: 180,
      calories: 520,
      imageUrl: indianImg,
      difficulty: "hard",
    },
    {
      id: "haleem-1",
      name: "ハリーム",
      region: "パキスタン",
      description: "小麦と肉のペースト料理",
      cookingTime: 150,
      calories: 480,
      imageUrl: indianImg,
      difficulty: "hard",
    },
  ],
  "Iran": [
    {
      id: "ghormeh-sabzi-1",
      name: "ゴルメサブジ",
      region: "イラン",
      description: "ハーブたっぷりの煮込み料理",
      cookingTime: 120,
      calories: 450,
      imageUrl: indianImg,
      difficulty: "hard",
    },
    {
      id: "tahdig-1",
      name: "タディグ",
      region: "イラン",
      description: "カリカリのご飯の底",
      cookingTime: 40,
      calories: 380,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Saudi Arabia": [
    {
      id: "kabsa-1",
      name: "カブサ",
      region: "サウジアラビア",
      description: "スパイス香るご飯と肉",
      cookingTime: 90,
      calories: 520,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "shawarma-1",
      name: "シャワルマ",
      region: "サウジアラビア",
      description: "回転焼きの肉料理",
      cookingTime: 25,
      calories: 450,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
  ],
  "United Kingdom": [
    {
      id: "fish-chips-1",
      name: "フィッシュアンドチップス",
      region: "イギリス",
      description: "揚げ魚とポテト",
      cookingTime: 30,
      calories: 580,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "shepherd-pie-1",
      name: "シェパーズパイ",
      region: "イギリス",
      description: "マッシュポテトの肉パイ",
      cookingTime: 70,
      calories: 520,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Germany": [
    {
      id: "schnitzel-1",
      name: "シュニッツェル",
      region: "ドイツ",
      description: "サクサクの豚肉カツレツ",
      cookingTime: 25,
      calories: 550,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "bratwurst-1",
      name: "ブラートヴルスト",
      region: "ドイツ",
      description: "ジューシーな焼きソーセージ",
      cookingTime: 20,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
  ],
  "Russia": [
    {
      id: "borscht-1",
      name: "ボルシチ",
      region: "ロシア",
      description: "ビーツの赤いスープ",
      cookingTime: 90,
      calories: 320,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "pelmeni-1",
      name: "ペリメニ",
      region: "ロシア",
      description: "肉入り小さな餃子",
      cookingTime: 40,
      calories: 450,
      imageUrl: caponataImg,
      difficulty: "hard",
    },
  ],
  "Portugal": [
    {
      id: "bacalhau-1",
      name: "バカリャウ",
      region: "ポルトガル",
      description: "塩漬けタラの料理",
      cookingTime: 50,
      calories: 380,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "pastel-de-nata-1",
      name: "パステル・デ・ナタ",
      region: "ポルトガル",
      description: "カスタードタルト",
      cookingTime: 40,
      calories: 280,
      imageUrl: caponataImg,
      difficulty: "hard",
    },
  ],
  "Netherlands": [
    {
      id: "stroopwafel-1",
      name: "ストロープワッフル",
      region: "オランダ",
      description: "キャラメル入りワッフル",
      cookingTime: 30,
      calories: 320,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "bitterballen-1",
      name: "ビッターバレン",
      region: "オランダ",
      description: "揚げ肉団子",
      cookingTime: 25,
      calories: 380,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Sweden": [
    {
      id: "meatballs-1",
      name: "スウェーデン風ミートボール",
      region: "スウェーデン",
      description: "クリームソースのミートボール",
      cookingTime: 40,
      calories: 480,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "gravlax-1",
      name: "グラブラックス",
      region: "スウェーデン",
      description: "塩漬けサーモン",
      cookingTime: 60,
      calories: 320,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Poland": [
    {
      id: "pierogi-1",
      name: "ピエロギ",
      region: "ポーランド",
      description: "具入り餃子",
      cookingTime: 45,
      calories: 420,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "bigos-1",
      name: "ビゴス",
      region: "ポーランド",
      description: "キャベツと肉の煮込み",
      cookingTime: 90,
      calories: 380,
      imageUrl: indianImg,
      difficulty: "medium",
    },
  ],
  "Austria": [
    {
      id: "wiener-schnitzel-1",
      name: "ウィーナーシュニッツェル",
      region: "オーストリア",
      description: "薄い仔牛のカツレツ",
      cookingTime: 30,
      calories: 520,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "sachertorte-1",
      name: "ザッハトルテ",
      region: "オーストリア - ウィーン",
      description: "チョコレートケーキ",
      cookingTime: 90,
      calories: 480,
      imageUrl: caponataImg,
      difficulty: "hard",
    },
  ],
  "Belgium": [
    {
      id: "moules-frites-1",
      name: "ムール・フリット",
      region: "ベルギー",
      description: "ムール貝とフライドポテト",
      cookingTime: 35,
      calories: 420,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
    {
      id: "waffles-1",
      name: "ベルギーワッフル",
      region: "ベルギー",
      description: "ふわふわの甘いワッフル",
      cookingTime: 20,
      calories: 350,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Canada": [
    {
      id: "poutine-1",
      name: "プーティン",
      region: "カナダ - ケベック",
      description: "フライドポテトとグレービー",
      cookingTime: 25,
      calories: 620,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
    {
      id: "tourtiere-1",
      name: "トゥルティエール",
      region: "カナダ - ケベック",
      description: "肉のパイ",
      cookingTime: 60,
      calories: 520,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Peru": [
    {
      id: "ceviche-1",
      name: "セビーチェ",
      region: "ペルー",
      description: "生魚のマリネ",
      cookingTime: 20,
      calories: 220,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
    {
      id: "lomo-saltado-1",
      name: "ロモ・サルタード",
      region: "ペルー",
      description: "牛肉の炒め物",
      cookingTime: 30,
      calories: 480,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Colombia": [
    {
      id: "bandeja-paisa-1",
      name: "バンデハ・パイサ",
      region: "コロンビア",
      description: "豆と肉の盛り合わせ",
      cookingTime: 70,
      calories: 720,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "arepas-1",
      name: "アレパ",
      region: "コロンビア",
      description: "トウモロコシのパン",
      cookingTime: 25,
      calories: 280,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Chile": [
    {
      id: "empanadas-chile-1",
      name: "エンパナーダ",
      region: "チリ",
      description: "具入りパイ",
      cookingTime: 40,
      calories: 340,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "pastel-de-choclo-1",
      name: "パステル・デ・チョクロ",
      region: "チリ",
      description: "トウモロコシのパイ",
      cookingTime: 60,
      calories: 480,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Jamaica": [
    {
      id: "jerk-chicken-1",
      name: "ジャークチキン",
      region: "ジャマイカ",
      description: "スパイシーな焼き鶏",
      cookingTime: 50,
      calories: 420,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "ackee-saltfish-1",
      name: "アキー&ソルトフィッシュ",
      region: "ジャマイカ",
      description: "国民的朝食",
      cookingTime: 30,
      calories: 380,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "Nigeria": [
    {
      id: "jollof-rice-1",
      name: "ジョロフライス",
      region: "ナイジェリア",
      description: "トマト風味の炊き込みご飯",
      cookingTime: 50,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "suya-1",
      name: "スヤ",
      region: "ナイジェリア",
      description: "スパイシーな串焼き肉",
      cookingTime: 30,
      calories: 380,
      imageUrl: indianImg,
      difficulty: "easy",
    },
  ],
  "South Africa": [
    {
      id: "bobotie-1",
      name: "ボボティー",
      region: "南アフリカ",
      description: "カレー風味のミートローフ",
      cookingTime: 60,
      calories: 480,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "biltong-1",
      name: "ビルトン",
      region: "南アフリカ",
      description: "乾燥させた肉",
      cookingTime: 240,
      calories: 320,
      imageUrl: thaiImg,
      difficulty: "hard",
    },
  ],
  "Egypt": [
    {
      id: "koshari-1",
      name: "コシャリ",
      region: "エジプト",
      description: "米とパスタの混合料理",
      cookingTime: 40,
      calories: 480,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "ful-medames-1",
      name: "フール・メダメス",
      region: "エジプト",
      description: "そら豆の煮込み",
      cookingTime: 60,
      calories: 320,
      imageUrl: indianImg,
      difficulty: "easy",
    },
  ],
  "Kenya": [
    {
      id: "nyama-choma-1",
      name: "ニャマ・チョマ",
      region: "ケニア",
      description: "炭火焼き肉",
      cookingTime: 50,
      calories: 520,
      imageUrl: indianImg,
      difficulty: "easy",
    },
    {
      id: "ugali-1",
      name: "ウガリ",
      region: "ケニア",
      description: "トウモロコシの粉の主食",
      cookingTime: 20,
      calories: 280,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Australia": [
    {
      id: "meat-pie-1",
      name: "ミートパイ",
      region: "オーストラリア",
      description: "肉入りパイ",
      cookingTime: 50,
      calories: 480,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "vegemite-toast-1",
      name: "ベジマイトトースト",
      region: "オーストラリア",
      description: "酵母エキスのトースト",
      cookingTime: 5,
      calories: 180,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "New Zealand": [
    {
      id: "hangi-1",
      name: "ハンギ",
      region: "ニュージーランド",
      description: "地中で蒸し焼きにした料理",
      cookingTime: 180,
      calories: 520,
      imageUrl: indianImg,
      difficulty: "hard",
    },
    {
      id: "pavlova-1",
      name: "パブロバ",
      region: "ニュージーランド",
      description: "メレンゲのデザート",
      cookingTime: 90,
      calories: 320,
      imageUrl: caponataImg,
      difficulty: "hard",
    },
  ],
  "Lebanon": [
    {
      id: "tabbouleh-1",
      name: "タブーリ",
      region: "レバノン",
      description: "パセリとブルグルのサラダ",
      cookingTime: 20,
      calories: 180,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
    {
      id: "kibbeh-1",
      name: "キッベ",
      region: "レバノン",
      description: "ひき肉とブルグルのコロッケ",
      cookingTime: 50,
      calories: 420,
      imageUrl: indianImg,
      difficulty: "hard",
    },
  ],
  "Israel": [
    {
      id: "falafel-1",
      name: "ファラフェル",
      region: "イスラエル",
      description: "ひよこ豆のコロッケ",
      cookingTime: 30,
      calories: 320,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
    {
      id: "shakshuka-1",
      name: "シャクシュカ",
      region: "イスラエル",
      description: "トマトソースの卵料理",
      cookingTime: 25,
      calories: 280,
      imageUrl: indianImg,
      difficulty: "easy",
    },
  ],
};

// デフォルトで表示する世界の代表的な料理
const defaultDishes = [
  dishesbyCountry["Italy"][0],
  dishesbyCountry["Thailand"][0],
  dishesbyCountry["India"][0],
  dishesbyCountry["Japan"][0],
  dishesbyCountry["France"][0],
  dishesbyCountry["Mexico"][0],
];

export default function MapView() {
  const [, setLocation] = useLocation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  // Initial rotation to show Asia/Europe region where most of our dish data is located
  const [rotation, setRotation] = useState([30, -20, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const displayedDishes = selectedCountry && dishesbyCountry[selectedCountry]
    ? dishesbyCountry[selectedCountry]
    : defaultDishes;

  const handleCountryClick = (geo: { properties: { name: string } }) => {
    const countryName = geo.properties.name;
    console.log("Clicked country:", countryName);
    setSelectedCountry(countryName);
  };

  const handleCardClick = (dishId: string) => {
    // Note: Currently using mock dish IDs. In production, these should map to actual recipe IDs
    // For now, navigate to home page and suggest using chat to find similar dishes
    setLocation("/");
    console.log("Navigate to dish:", dishId);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation((prev) => [
      prev[0] + deltaX * 0.5,
      prev[1] - deltaY * 0.5,
      prev[2],
    ]);

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">世界の味を探索</h2>
          <p className="text-muted-foreground">
            {selectedCountry
              ? `${selectedCountry}の料理を見る`
              : "地球儀をクリックして地域の料理を発見しましょう"}
          </p>
        </div>

        <div 
          className="bg-card border border-card-border rounded-lg overflow-hidden mb-8"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{
              scale: 200,
              rotate: rotation as [number, number, number],
            } as any}
            width={800}
            height={600}
            style={{
              width: "100%",
              height: "auto",
            }}
          >
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={1} center={[0, 0]}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const countryName = geo.properties.name;
                    const hasDeishes = !!dishesbyCountry[countryName];
                    const isSelected = selectedCountry === countryName;
                    const isHovered = hoveredCountry === countryName;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredCountry(countryName)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => handleCountryClick(geo)}
                        style={{
                          default: {
                            fill: isSelected
                              ? "hsl(var(--primary))"
                              : hasDeishes
                              ? "hsl(var(--chart-2))"
                              : "hsl(var(--muted))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: hasDeishes
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: hasDeishes ? "pointer" : "default",
                          },
                          pressed: {
                            fill: "hsl(var(--primary))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                        }}
                        data-testid={`geography-${countryName}`}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-semibold">
              {selectedCountry ? `${selectedCountry}の料理` : "世界の代表的な料理"}
            </h3>
            {selectedCountry && (
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-sm text-primary hover:underline"
                data-testid="button-clear-selection"
              >
                すべて表示
              </button>
            )}
          </div>
          
          {selectedCountry && !dishesbyCountry[selectedCountry] && (
            <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">
                {selectedCountry}の料理データはまだ登録されていません。
                代わりに世界の代表的な料理を表示しています。
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDishes.map((dish) => (
              <Card
                key={dish.id}
                className="overflow-hidden hover-elevate cursor-pointer"
                onClick={() => handleCardClick(dish.id)}
                data-testid={`card-dish-${dish.id}`}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-display font-semibold" data-testid={`text-dish-name-${dish.id}`}>
                      {dish.name}
                    </h3>
                    <p className="text-sm" data-testid={`text-dish-region-${dish.id}`}>
                      {dish.region}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span data-testid={`text-dish-time-${dish.id}`}>{dish.cookingTime}分</span>
                    </div>
                    <Badge
                      className={
                        dish.difficulty === "easy"
                          ? "bg-chart-2 text-white"
                          : dish.difficulty === "medium"
                          ? "bg-chart-4 text-white"
                          : "bg-destructive text-destructive-foreground"
                      }
                      data-testid={`badge-dish-difficulty-${dish.id}`}
                    >
                      {dish.difficulty === "easy"
                        ? "簡単"
                        : dish.difficulty === "medium"
                        ? "普通"
                        : "難しい"}
                    </Badge>
                    <span className="text-muted-foreground" data-testid={`text-dish-calories-${dish.id}`}>
                      {dish.calories}kcal
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-dish-description-${dish.id}`}>
                    {dish.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
