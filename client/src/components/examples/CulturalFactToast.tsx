import CulturalFactToast from '../CulturalFactToast';

export default function CulturalFactToastExample() {
  return (
    <div className="h-[400px] relative">
      <CulturalFactToast
        fact="カポナータは揚げ焼き野菜に甘酸っぱい味付けをする郷土料理。地方により砂糖や松の実を加えることも。"
        detailedFact="カポナータは揚げ焼き野菜に甘酸っぱい味付けをする郷土料理。地方により砂糖や松の実を加えることも。シチリアの夏の定番料理で、冷やして食べるのが一般的です。ナスを主役に、トマト、セロリ、オリーブ、ケッパーなどが入り、ビネガーと砂糖で甘酸っぱく仕上げます。"
        sourceLabel="Food Atlas編集部"
      />
    </div>
  );
}
