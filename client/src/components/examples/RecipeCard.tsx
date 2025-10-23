import RecipeCard from '../RecipeCard';
import caponataImg from '@assets/generated_images/Italian_caponata_dish_c8849bba.png';

export default function RecipeCardExample() {
  return (
    <div className="max-w-sm p-4">
      <RecipeCard
        id="r_790"
        title="カポナータ"
        country="イタリア"
        region="南イタリア"
        timeMin={15}
        difficulty="easy"
        tags={["野菜", "甘酸っぱい"]}
        teaser="シチリアの伝統的な野菜料理。ナスとトマトの甘酸っぱい味わいが特徴です。"
        imageUrl={caponataImg}
      />
    </div>
  );
}
