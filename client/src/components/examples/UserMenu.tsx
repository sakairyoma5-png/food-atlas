import UserMenu from '../UserMenu';

export default function UserMenuExample() {
  return (
    <div className="p-4 flex justify-end">
      <UserMenu username="山田 太郎" email="yamada@example.com" />
    </div>
  );
}
