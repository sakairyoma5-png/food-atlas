import FoodLogCard from '../FoodLogCard';
import caponataImg from '@assets/generated_images/Italian_caponata_dish_c8849bba.png';

export default function FoodLogCardExample() {
  return (
    <div className="max-w-2xl p-4 space-y-4">
      <FoodLogCard
        id="log_1"
        dishName="カポナータ"
        country="イタリア"
        region="南イタリア"
        date="2025年10月20日"
        rating={5}
        imageUrl={caponataImg}
        notes="とても美味しかった！家族にも好評でした。"
      />
      <FoodLogCard
        id="log_2"
        dishName="ガパオライス"
        country="タイ"
        date="2025年10月18日"
        rating={4}
        notes="辛さがちょうど良かった。次回はもう少しバジルを多めに。"
      />
    </div>
  );
}
