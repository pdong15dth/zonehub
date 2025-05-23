import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { GameForm } from './_components/game-form';

export const metadata: Metadata = {
  title: 'Thêm game mới | Admin',
  description: 'Thêm game mới vào cơ sở dữ liệu',
};

export default function CreateGamePage() {
  return (
    <div className="">
      <div className="flex items-center space-x-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="h-8"
        >
          <Link href="/admin/content/games">
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span>Quay lại</span>
          </Link>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-3">Thêm game mới</h1>
      <p className="text-muted-foreground mb-6">
        Điền đầy đủ thông tin để thêm game mới vào cơ sở dữ liệu.
      </p>
      
      <GameForm />
    </div>
  );
} 