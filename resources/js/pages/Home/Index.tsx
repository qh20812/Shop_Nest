import React from 'react'
import HomeLayout from '@/layouts/app/HomeLayout'
import CategoryCarousel from '@/Components/home/ui/CategoryCarousel'
import { usePage } from '@inertiajs/react'
import DailyDiscoverSection from '@/Components/home/ui/DailyDiscoverSection'

interface CategoryProps {
  id: number | string
  name: string
  img?: string | null
  slug?: string | null
}

interface DailyDiscoverItem {
  id: number | string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount_price?: number | null;
  category: string;
  brand: string;
  rating: number | null;
  sold_count: number;
}

export default function Index() {
  // Get props passed through Inertia (server side HomeController)
  const { categories: serverCategories } = usePage<{ categories?: CategoryProps[] }>().props

  const dummyImg = 'https://dummyimage.com/300x300/666266/ffffff&text=Category'
  const fallbackCategories: CategoryProps[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Category ${i + 1}`,
    img: dummyImg,
    slug: `category-${i + 1}`,
  }))

  // Prefer server-provided categories if available, otherwise fallback to dummy data
  const categories = Array.isArray(serverCategories) && serverCategories.length > 0
    ? serverCategories as CategoryProps[]
    : fallbackCategories

  // Server-provided daily discover list prop (HomeController returns 'dailyDiscover')
  const { dailyDiscover: serverDailyDiscover } = usePage<{ dailyDiscover?: DailyDiscoverItem[] }>().props

  const fallbackDailyDiscover = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    description: `Mô tả sản phẩm mẫu ${i + 1}`,
    image: '/image/Product.png',
    price: 100000 * (i + 1),
    discount_price: i % 3 === 0 ? 90000 * (i + 1) : undefined,
    category: `Category ${((i % 4) + 1)}`,
    brand: `Brand ${((i % 3) + 1)}`,
    rating: Math.round((Math.random() * 5) * 10) / 10,
    sold_count: Math.floor(Math.random() * 1000),
  }))

  const dailyDiscover = Array.isArray(serverDailyDiscover) && serverDailyDiscover.length > 0
    ? serverDailyDiscover
    : fallbackDailyDiscover

  return (
    <HomeLayout>
      <CategoryCarousel categories={categories} />
      <DailyDiscoverSection products={dailyDiscover} />
    </HomeLayout>
  )
}
