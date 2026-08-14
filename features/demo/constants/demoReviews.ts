import { DEMO_STORES } from "./demoStores";

export type DemoReview = {
  id: string;
  storeId: string;
  storeName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  replied: boolean;
  replyText?: string;
  region: string;
  createdAt: string;
};

const COMMENTS = [
  "Sữa tươi rất ngon, nhân viên nhiệt tình!",
  "Cửa hàng sạch sẽ, dễ tìm trên Google Maps.",
  "Chờ lâu quá, thiếu nhân viên.",
  "Giá hơi cao so với siêu thị khác.",
  "Rất hài lòng với dịch vụ tư vấn.",
  "Địa chỉ trên Google Maps hơi lệch, khó đỗ xe.",
];

const NAMES = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C", "Phạm Thu D", "Hoàng Văn E"];

export function generateDemoReviews(): DemoReview[] {
  const reviews: DemoReview[] = [];
  let n = 0;
  for (const store of DEMO_STORES) {
    const count = store.reviewCount > 0 ? Math.min(6, Math.max(2, store.reviewCount % 6 || 3)) : 0;
    for (let i = 0; i < count; i++) {
      n += 1;
      const rating =
        i < store.oneStarCount ? 1 : store.rating >= 4 ? 5 : store.rating >= 3.5 ? 4 : 3;
      const replied = rating >= 4;
      reviews.push({
        id: `review-${String(n).padStart(4, "0")}`,
        storeId: store.id,
        storeName: store.name,
        reviewerName: NAMES[n % NAMES.length],
        rating,
        comment: COMMENTS[n % COMMENTS.length],
        replied,
        replyText: replied
          ? "Cảm ơn quý khách đã phản hồi. Chúng tôi sẽ cải thiện dịch vụ."
          : undefined,
        region: store.region,
        createdAt: `2026-08-${String((n % 12) + 1).padStart(2, "0")}T10:00:00Z`,
      });
    }
  }
  return reviews;
}

export const DEMO_REVIEWS = generateDemoReviews();

export const DEMO_REPLY_TEMPLATES = [
  {
    id: "apology",
    label: "Xin lỗi",
    body: "Vinamilk xin lỗi quý khách về trải nghiệm chưa tốt. Chúng tôi đã ghi nhận và sẽ xử lý ngay.",
  },
  {
    id: "thanks",
    label: "Cảm ơn",
    body: "Vinamilk cảm ơn quý khách đã tin tưởng. Rất mong được phục vụ lại lần sau.",
  },
  {
    id: "followup",
    label: "Hẹn xử lý",
    body: "Chúng tôi đã chuyển phản hồi tới cửa hàng. Quản lý sẽ liên hệ trong 24 giờ.",
  },
];
