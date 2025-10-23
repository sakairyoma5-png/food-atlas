import ComparisonTray from '../ComparisonTray';

export default function ComparisonTrayExample() {
  const mockItems = [
    {
      id: "r_790",
      title: "カポナータ",
      timeMin: 15,
      difficulty: "簡単",
      country: "イタリア",
    },
    {
      id: "r_791",
      title: "ミネストローネ",
      timeMin: 25,
      difficulty: "簡単",
      country: "イタリア",
    },
    {
      id: "r_792",
      title: "ガパオライス",
      timeMin: 20,
      difficulty: "普通",
      country: "タイ",
    },
  ];

  return (
    <div className="h-[300px] relative">
      <ComparisonTray items={mockItems} />
    </div>
  );
}
