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
// Italian
import caponataImg from "@assets/stock_images/italian_caponata_veg_16a3ae8a.jpg";
import carbonaraImg from "@assets/stock_images/italian_carbonara_pa_b21ab050.jpg";
// Thai
import gapaoImg from "@assets/stock_images/thai_basil_chicken_r_87057ea3.jpg";
import tomYumImg from "@assets/stock_images/thai_tom_yum_soup_18bc6c65.jpg";
// Indian
import butterChickenImg from "@assets/stock_images/indian_butter_chicke_5f242724.jpg";
import biryaniImg from "@assets/stock_images/indian_biryani_rice_b94e8585.jpg";
// Japanese
import ramenImg from "@assets/stock_images/japanese_ramen_noodl_0f87abfb.jpg";
// French
import ratatouilleImg from "@assets/stock_images/french_ratatouille_v_4eea6383.jpg";
// Mexican
import tacosImg from "@assets/stock_images/mexican_tacos_c0d0a509.jpg";
// Chinese
import mapoTofuImg from "@assets/stock_images/chinese_mapo_tofu_8627136e.jpg";
import friedRiceImg from "@assets/stock_images/chinese_fried_rice_db0e331f.jpg";
// Korean
import bibimbapImg from "@assets/stock_images/korean_bibimbap_rice_0fb3ffc7.jpg";
import kimchiJjigaeImg from "@assets/stock_images/korean_kimchi_jjigae_22633623.jpg";
// Vietnamese
import phoImg from "@assets/stock_images/vietnamese_pho_noodl_69b914d1.jpg";
import banhMiImg from "@assets/stock_images/vietnamese_banh_mi_s_836468e1.jpg";
// Spanish
import paellaImg from "@assets/stock_images/spanish_paella_seafo_1eee2bad.jpg";
import tapasImg from "@assets/stock_images/spanish_tapas_appeti_6cb34433.jpg";
// Greek
import moussakaImg from "@assets/stock_images/greek_moussaka_eggpl_a9b45073.jpg";
import gyrosImg from "@assets/stock_images/greek_gyros_pita_wra_f910c51e.jpg";
// Turkish
import kebabImg from "@assets/stock_images/turkish_kebab_skewer_d86ef149.jpg";
import baklavaImg from "@assets/stock_images/turkish_baklava_past_75e92ef8.jpg";
// American
import burgerImg from "@assets/stock_images/american_hamburger_b_1f0fa252.jpg";
import bbqRibsImg from "@assets/stock_images/bbq_ribs_barbecue_abf6ee84.jpg";
// Brazilian
import feijoadaImg from "@assets/stock_images/brazilian_feijoada_b_6c176e96.jpg";
import churrascoImg from "@assets/stock_images/brazilian_churrasco__b0a0a8e0.jpg";
// Argentine
import asadoImg from "@assets/stock_images/argentine_asado_gril_9a7a203b.jpg";
import empanadaArgImg from "@assets/stock_images/argentine_empanada_p_8f00e9bf.jpg";
// Moroccan
import tagineImg from "@assets/stock_images/moroccan_tagine_stew_32e1b0d6.jpg";
import couscousImg from "@assets/stock_images/moroccan_couscous_ae6cb28e.jpg";
// Ethiopian
import injeraImg from "@assets/stock_images/ethiopian_injera_bre_290c055a.jpg";
import doroWatImg from "@assets/stock_images/ethiopian_doro_wat_c_c540a98b.jpg";
// Indonesian
import nasiGorengImg from "@assets/stock_images/indonesian_nasi_gore_069c2127.jpg";
import rendangImg from "@assets/stock_images/indonesian_rendang_c_d8283318.jpg";
// Malaysian
import nasiLemakImg from "@assets/stock_images/malaysian_nasi_lemak_3afbfc75.jpg";
import laksaImg from "@assets/stock_images/malaysian_laksa_nood_ba6d5916.jpg";
// Philippine
import adoboImg from "@assets/stock_images/philippine_adobo_chi_d972991c.jpg";
import sinigangImg from "@assets/stock_images/philippine_sinigang__11788dda.jpg";
// Pakistani
import nihariImg from "@assets/stock_images/pakistani_nihari_mea_ebf5cb3c.jpg";
import haleemImg from "@assets/stock_images/pakistani_haleem_por_0ad3ad32.jpg";
// Iranian
import ghormehSabziImg from "@assets/stock_images/iranian_ghormeh_sabz_52333aae.jpg";
import tahdigImg from "@assets/stock_images/iranian_tahdig_crisp_c46f3ae3.jpg";
// Saudi
import kabsaImg from "@assets/stock_images/saudi_kabsa_rice_chi_5c2a2c80.jpg";
import shawarmaImg from "@assets/stock_images/saudi_shawarma_wrap_f76111e6.jpg";
// British
import fishChipsImg from "@assets/stock_images/british_fish_and_chi_dce9570c.jpg";
import shepherdPieImg from "@assets/stock_images/british_shepherd's_p_fafdd133.jpg";
// German
import schnitzelImg from "@assets/stock_images/german_schnitzel_bre_320c76d0.jpg";
import bratwurstImg from "@assets/stock_images/german_bratwurst_sau_d2bbdd89.jpg";
// Russian
import borschimg from "@assets/stock_images/russian_borscht_soup_ebdca4c6.jpg";
import pelmeniImg from "@assets/stock_images/russian_pelmeni_dump_588c7360.jpg";
// Portuguese
import bacalhauImg from "@assets/stock_images/portuguese_bacalhau__133f60a7.jpg";
import pastelDeNataImg from "@assets/stock_images/portuguese_pastel_de_85154a16.jpg";
// Dutch
import stroopwafelImg from "@assets/stock_images/dutch_stroopwafel_wa_b174cbf0.jpg";
import bitterballenImg from "@assets/stock_images/dutch_bitterballen_f_b941e534.jpg";
// Swedish
import meatballsImg from "@assets/stock_images/swedish_meatballs_12ba3231.jpg";
import gravlaxImg from "@assets/stock_images/swedish_gravlax_cure_6469e9c0.jpg";
// Polish
import pierogiImg from "@assets/stock_images/polish_pierogi_dumpl_d9eb5955.jpg";
import bigosImg from "@assets/stock_images/polish_bigos_hunter'_04be714a.jpg";
// Austrian
import wienerSchnitzelImg from "@assets/stock_images/austrian_wiener_schn_bcea927f.jpg";
import sachertorteImg from "@assets/stock_images/austrian_sachertorte_cd696d6c.jpg";
// Belgian
import moulesFritesImg from "@assets/stock_images/belgian_moules_frite_ffcfbb18.jpg";
import wafflesImg from "@assets/stock_images/belgian_waffles_0231b88f.jpg";
// Canadian
import poutineImg from "@assets/stock_images/canadian_poutine_fri_c9bfb45c.jpg";
import tourtiereImg from "@assets/stock_images/canadian_tourtiere_m_dd1302e0.jpg";
// Peruvian
import cevicheImg from "@assets/stock_images/peruvian_ceviche_fis_3b4aa940.jpg";
import lomoSaltadoImg from "@assets/stock_images/peruvian_lomo_saltad_89befa76.jpg";
// Colombian
import bandejaPaisaImg from "@assets/stock_images/colombian_bandeja_pa_658386e5.jpg";
import arepasImg from "@assets/stock_images/colombian_arepas_cor_2592573e.jpg";
// Chilean
import empanadasChileImg from "@assets/stock_images/chilean_empanadas_pa_19cb8797.jpg";
import pastelDeChocloImg from "@assets/stock_images/chilean_pastel_de_ch_4c7009f1.jpg";
// Jamaican
import jerkChickenImg from "@assets/stock_images/jamaican_jerk_chicke_4006d459.jpg";
import ackeeSaltfishImg from "@assets/stock_images/jamaican_ackee_saltf_effdf76c.jpg";
// Nigerian
import jollofRiceImg from "@assets/stock_images/nigerian_jollof_rice_d98a775c.jpg";
import suyaImg from "@assets/stock_images/nigerian_suya_skewer_851e480d.jpg";
// South African
import bobotieImg from "@assets/stock_images/south_african_boboti_21143110.jpg";
import biltongImg from "@assets/stock_images/south_african_bilton_fe971c66.jpg";
// Egyptian
import koshariImg from "@assets/stock_images/egyptian_koshari_ric_1b783535.jpg";
import fulMedamesImg from "@assets/stock_images/egyptian_ful_medames_95e1ae6a.jpg";
// Kenyan
import nyamaChomaImg from "@assets/stock_images/kenyan_nyama_choma_g_88c09461.jpg";
import ugaliImg from "@assets/stock_images/kenyan_ugali_corn_me_d62282a7.jpg";
// Australian
import meatPieImg from "@assets/stock_images/australian_meat_pie_dbf42623.jpg";
import vegemiteToastImg from "@assets/stock_images/australian_vegemite__6ac05618.jpg";
// New Zealand
import hangiImg from "@assets/stock_images/new_zealand_hangi_ea_a1c9cb6c.jpg";
import pavlovaImg from "@assets/stock_images/new_zealand_pavlova__0d00b455.jpg";
// Lebanese
import tabboulehImg from "@assets/stock_images/lebanese_tabbouleh_s_bf6b30f1.jpg";
import kibbehImg from "@assets/stock_images/lebanese_kibbeh_meat_1cc44d93.jpg";
// Israeli
import falafelImg from "@assets/stock_images/israeli_falafel_chic_271d43e8.jpg";
import shakshukaImg from "@assets/stock_images/israeli_shakshuka_eg_14b08023.jpg";

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
      imageUrl: carbonaraImg,
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
      imageUrl: gapaoImg,
      difficulty: "medium",
    },
    {
      id: "tom-yum-1",
      name: "トムヤムクン",
      region: "タイ",
      description: "辛酸っぱいスープの代表格",
      cookingTime: 30,
      calories: 150,
      imageUrl: tomYumImg,
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
      imageUrl: butterChickenImg,
      difficulty: "medium",
    },
    {
      id: "biryani-1",
      name: "ビリヤニ",
      region: "インド",
      description: "スパイス香る炊き込みご飯",
      cookingTime: 45,
      calories: 450,
      imageUrl: biryaniImg,
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
      imageUrl: ramenImg,
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
      imageUrl: ratatouilleImg,
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
      imageUrl: tacosImg,
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
      imageUrl: mapoTofuImg,
      difficulty: "medium",
    },
    {
      id: "fried-rice-1",
      name: "チャーハン",
      region: "中国",
      description: "シンプルで美味しい炒飯",
      cookingTime: 15,
      calories: 420,
      imageUrl: friedRiceImg,
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
      imageUrl: bibimbapImg,
      difficulty: "medium",
    },
    {
      id: "kimchi-jjigae-1",
      name: "キムチチゲ",
      region: "韓国",
      description: "辛くて温まるキムチ鍋",
      cookingTime: 35,
      calories: 320,
      imageUrl: kimchiJjigaeImg,
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
      imageUrl: phoImg,
      difficulty: "medium",
    },
    {
      id: "banh-mi-1",
      name: "バインミー",
      region: "ベトナム",
      description: "フランスパンのサンドイッチ",
      cookingTime: 20,
      calories: 380,
      imageUrl: banhMiImg,
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
      imageUrl: paellaImg,
      difficulty: "hard",
    },
    {
      id: "tapas-1",
      name: "タパス",
      region: "スペイン",
      description: "小皿料理の盛り合わせ",
      cookingTime: 30,
      calories: 300,
      imageUrl: tapasImg,
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
      imageUrl: moussakaImg,
      difficulty: "hard",
    },
    {
      id: "gyros-1",
      name: "ギロス",
      region: "ギリシャ",
      description: "ピタパンに包んだ肉料理",
      cookingTime: 25,
      calories: 420,
      imageUrl: gyrosImg,
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
      imageUrl: kebabImg,
      difficulty: "medium",
    },
    {
      id: "baklava-1",
      name: "バクラヴァ",
      region: "トルコ",
      description: "ナッツとはちみつの甘いお菓子",
      cookingTime: 45,
      calories: 380,
      imageUrl: baklavaImg,
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
      imageUrl: burgerImg,
      difficulty: "easy",
    },
    {
      id: "bbq-ribs-1",
      name: "BBQリブ",
      region: "アメリカ - 南部",
      description: "甘辛いソースのスペアリブ",
      cookingTime: 90,
      calories: 650,
      imageUrl: bbqRibsImg,
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
      imageUrl: feijoadaImg,
      difficulty: "hard",
    },
    {
      id: "churrasco-1",
      name: "シュラスコ",
      region: "ブラジル",
      description: "串焼きの肉料理",
      cookingTime: 40,
      calories: 580,
      imageUrl: churrascoImg,
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
      imageUrl: asadoImg,
      difficulty: "medium",
    },
    {
      id: "empanada-1",
      name: "エンパナーダ",
      region: "アルゼンチン",
      description: "肉や野菜を包んだパイ",
      cookingTime: 35,
      calories: 320,
      imageUrl: empanadaArgImg,
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
      imageUrl: tagineImg,
      difficulty: "medium",
    },
    {
      id: "couscous-1",
      name: "クスクス",
      region: "モロッコ",
      description: "粒々のパスタと野菜",
      cookingTime: 40,
      calories: 350,
      imageUrl: couscousImg,
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
      imageUrl: injeraImg,
      difficulty: "hard",
    },
    {
      id: "doro-wat-1",
      name: "ドロワット",
      region: "エチオピア",
      description: "スパイシーな鶏肉の煮込み",
      cookingTime: 60,
      calories: 450,
      imageUrl: doroWatImg,
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
      imageUrl: nasiGorengImg,
      difficulty: "easy",
    },
    {
      id: "rendang-1",
      name: "ルンダン",
      region: "インドネシア - スマトラ",
      description: "スパイシーなココナッツカレー",
      cookingTime: 120,
      calories: 550,
      imageUrl: rendangImg,
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
      imageUrl: nasiLemakImg,
      difficulty: "medium",
    },
    {
      id: "laksa-1",
      name: "ラクサ",
      region: "マレーシア",
      description: "スパイシーなココナッツヌードル",
      cookingTime: 40,
      calories: 420,
      imageUrl: laksaImg,
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
      imageUrl: adoboImg,
      difficulty: "easy",
    },
    {
      id: "sinigang-1",
      name: "シニガン",
      region: "フィリピン",
      description: "酸っぱいタマリンドスープ",
      cookingTime: 45,
      calories: 280,
      imageUrl: sinigangImg,
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
      imageUrl: nihariImg,
      difficulty: "hard",
    },
    {
      id: "haleem-1",
      name: "ハリーム",
      region: "パキスタン",
      description: "小麦と肉のペースト料理",
      cookingTime: 150,
      calories: 480,
      imageUrl: haleemImg,
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
      imageUrl: ghormehSabziImg,
      difficulty: "hard",
    },
    {
      id: "tahdig-1",
      name: "タディグ",
      region: "イラン",
      description: "カリカリのご飯の底",
      cookingTime: 40,
      calories: 380,
      imageUrl: tahdigImg,
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
      imageUrl: kabsaImg,
      difficulty: "medium",
    },
    {
      id: "shawarma-1",
      name: "シャワルマ",
      region: "サウジアラビア",
      description: "回転焼きの肉料理",
      cookingTime: 25,
      calories: 450,
      imageUrl: shawarmaImg,
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
      imageUrl: fishChipsImg,
      difficulty: "medium",
    },
    {
      id: "shepherd-pie-1",
      name: "シェパーズパイ",
      region: "イギリス",
      description: "マッシュポテトの肉パイ",
      cookingTime: 70,
      calories: 520,
      imageUrl: shepherdPieImg,
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
      imageUrl: schnitzelImg,
      difficulty: "medium",
    },
    {
      id: "bratwurst-1",
      name: "ブラートヴルスト",
      region: "ドイツ",
      description: "ジューシーな焼きソーセージ",
      cookingTime: 20,
      calories: 420,
      imageUrl: bratwurstImg,
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
      imageUrl: borschimg,
      difficulty: "medium",
    },
    {
      id: "pelmeni-1",
      name: "ペリメニ",
      region: "ロシア",
      description: "肉入り小さな餃子",
      cookingTime: 40,
      calories: 450,
      imageUrl: pelmeniImg,
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
      imageUrl: bacalhauImg,
      difficulty: "medium",
    },
    {
      id: "pastel-de-nata-1",
      name: "パステル・デ・ナタ",
      region: "ポルトガル",
      description: "カスタードタルト",
      cookingTime: 40,
      calories: 280,
      imageUrl: pastelDeNataImg,
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
      imageUrl: stroopwafelImg,
      difficulty: "medium",
    },
    {
      id: "bitterballen-1",
      name: "ビッターバレン",
      region: "オランダ",
      description: "揚げ肉団子",
      cookingTime: 25,
      calories: 380,
      imageUrl: bitterballenImg,
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
      imageUrl: meatballsImg,
      difficulty: "medium",
    },
    {
      id: "gravlax-1",
      name: "グラブラックス",
      region: "スウェーデン",
      description: "塩漬けサーモン",
      cookingTime: 60,
      calories: 320,
      imageUrl: gravlaxImg,
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
      imageUrl: pierogiImg,
      difficulty: "medium",
    },
    {
      id: "bigos-1",
      name: "ビゴス",
      region: "ポーランド",
      description: "キャベツと肉の煮込み",
      cookingTime: 90,
      calories: 380,
      imageUrl: bigosImg,
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
      imageUrl: wienerSchnitzelImg,
      difficulty: "medium",
    },
    {
      id: "sachertorte-1",
      name: "ザッハトルテ",
      region: "オーストリア - ウィーン",
      description: "チョコレートケーキ",
      cookingTime: 90,
      calories: 480,
      imageUrl: sachertorteImg,
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
      imageUrl: moulesFritesImg,
      difficulty: "easy",
    },
    {
      id: "waffles-1",
      name: "ベルギーワッフル",
      region: "ベルギー",
      description: "ふわふわの甘いワッフル",
      cookingTime: 20,
      calories: 350,
      imageUrl: wafflesImg,
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
      imageUrl: poutineImg,
      difficulty: "easy",
    },
    {
      id: "tourtiere-1",
      name: "トゥルティエール",
      region: "カナダ - ケベック",
      description: "肉のパイ",
      cookingTime: 60,
      calories: 520,
      imageUrl: tourtiereImg,
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
      imageUrl: cevicheImg,
      difficulty: "easy",
    },
    {
      id: "lomo-saltado-1",
      name: "ロモ・サルタード",
      region: "ペルー",
      description: "牛肉の炒め物",
      cookingTime: 30,
      calories: 480,
      imageUrl: lomoSaltadoImg,
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
      imageUrl: bandejaPaisaImg,
      difficulty: "medium",
    },
    {
      id: "arepas-1",
      name: "アレパ",
      region: "コロンビア",
      description: "トウモロコシのパン",
      cookingTime: 25,
      calories: 280,
      imageUrl: arepasImg,
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
      imageUrl: empanadasChileImg,
      difficulty: "medium",
    },
    {
      id: "pastel-de-choclo-1",
      name: "パステル・デ・チョクロ",
      region: "チリ",
      description: "トウモロコシのパイ",
      cookingTime: 60,
      calories: 480,
      imageUrl: pastelDeChocloImg,
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
      imageUrl: jerkChickenImg,
      difficulty: "medium",
    },
    {
      id: "ackee-saltfish-1",
      name: "アキー&ソルトフィッシュ",
      region: "ジャマイカ",
      description: "国民的朝食",
      cookingTime: 30,
      calories: 380,
      imageUrl: ackeeSaltfishImg,
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
      imageUrl: jollofRiceImg,
      difficulty: "medium",
    },
    {
      id: "suya-1",
      name: "スヤ",
      region: "ナイジェリア",
      description: "スパイシーな串焼き肉",
      cookingTime: 30,
      calories: 380,
      imageUrl: suyaImg,
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
      imageUrl: bobotieImg,
      difficulty: "medium",
    },
    {
      id: "biltong-1",
      name: "ビルトン",
      region: "南アフリカ",
      description: "乾燥させた肉",
      cookingTime: 240,
      calories: 320,
      imageUrl: biltongImg,
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
      imageUrl: koshariImg,
      difficulty: "medium",
    },
    {
      id: "ful-medames-1",
      name: "フール・メダメス",
      region: "エジプト",
      description: "そら豆の煮込み",
      cookingTime: 60,
      calories: 320,
      imageUrl: fulMedamesImg,
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
      imageUrl: nyamaChomaImg,
      difficulty: "easy",
    },
    {
      id: "ugali-1",
      name: "ウガリ",
      region: "ケニア",
      description: "トウモロコシの粉の主食",
      cookingTime: 20,
      calories: 280,
      imageUrl: ugaliImg,
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
      imageUrl: meatPieImg,
      difficulty: "medium",
    },
    {
      id: "vegemite-toast-1",
      name: "ベジマイトトースト",
      region: "オーストラリア",
      description: "酵母エキスのトースト",
      cookingTime: 5,
      calories: 180,
      imageUrl: vegemiteToastImg,
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
      imageUrl: hangiImg,
      difficulty: "hard",
    },
    {
      id: "pavlova-1",
      name: "パブロバ",
      region: "ニュージーランド",
      description: "メレンゲのデザート",
      cookingTime: 90,
      calories: 320,
      imageUrl: pavlovaImg,
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
      imageUrl: tabboulehImg,
      difficulty: "easy",
    },
    {
      id: "kibbeh-1",
      name: "キッベ",
      region: "レバノン",
      description: "ひき肉とブルグルのコロッケ",
      cookingTime: 50,
      calories: 420,
      imageUrl: kibbehImg,
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
      imageUrl: falafelImg,
      difficulty: "medium",
    },
    {
      id: "shakshuka-1",
      name: "シャクシュカ",
      region: "イスラエル",
      description: "トマトソースの卵料理",
      cookingTime: 25,
      calories: 280,
      imageUrl: shakshukaImg,
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
