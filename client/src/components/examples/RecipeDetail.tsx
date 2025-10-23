import RecipeDetail from '../RecipeDetail';
import caponataImg from '@assets/generated_images/Italian_caponata_dish_c8849bba.png';

export default function RecipeDetailExample() {
  const mockRecipe = {
    title: "カポナータ",
    country: "イタリア",
    region: "南イタリア",
    timeMin: 15,
    difficulty: "easy" as const,
    servings: 2,
    ingredients: [
      { name: "ナス", qty: "1本", alt: "ズッキーニで代用可" },
      { name: "トマト缶", qty: "200g" },
      { name: "玉ねぎ", qty: "1/2個" },
      { name: "ビネガー", qty: "大さじ1", alt: "米酢+砂糖 少々" },
      { name: "オリーブオイル", qty: "大さじ2" },
    ],
    steps: [
      "ナスを1cm角に切り、塩水に10分さらしてアク抜きする。",
      "玉ねぎをみじん切りにし、オリーブオイルで炒める。",
      "水気を切ったナスを加えて、しんなりするまで炒める。",
      "トマト缶とビネガーを加え、弱火で10分煮込む。",
      "塩コショウで味を調えて完成。冷やして食べても美味しい。",
    ],
    nutritionEstimate: {
      kcal_per_serv: 180,
      p: 3,
      f: 10,
      c: 18,
    },
    imageUrl: caponataImg,
  };

  return (
    <div className="max-w-4xl p-4">
      <RecipeDetail {...mockRecipe} />
    </div>
  );
}
