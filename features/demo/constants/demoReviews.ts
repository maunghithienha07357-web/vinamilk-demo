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

const REVIEW_COMMENTS = [
  "Sữa tươi rất ngon, nhân viên nhiệt tình!",
  "Cửa hàng sạch sẽ, dễ tìm.",
  "Chờ lâu quá, thiếu nhân viên.",
  "Giá hơi cao so với siêu thị khác.",
  "Không có sản phẩm mới, kệ trống nhiều.",
  "Rất hài lòng với dịch vụ tư vấn.",
  "Địa chỉ trên Google Maps sai, khó tìm.",
  "Cảm ơn Vinamilk!",
];

const REVIEWER_NAMES = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Minh C",
  "Phạm Thu D",
  "Hoàng Văn E",
  "Vũ Thị F",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateDemoReviews(): DemoReview[] {
  const rand = seededRandom(99);
  const reviews: DemoReview[] = [];
  const regions = ["Miền Bắc", "Miền Trung", "Miền Nam", "Hà Nội", "TP.HCM"];

  for (let i = 0; i < 48; i++) {
    const num = i + 1;
    const rating = rand() < 0.25 ? (rand() < 0.5 ? 1 : 2) : Math.floor(rand() * 3) + 3;
    const replied = rating >= 3 ? rand() > 0.3 : rand() > 0.7;
    const region = regions[Math.floor(rand() * regions.length)];

    reviews.push({
      id: `review-${String(num).padStart(4, "0")}`,
      storeId: `store-${String((num % 560) + 1).padStart(4, "0")}`,
      storeName: `Vinamilk ${region} — CH ${(num % 560) + 1}`,
      reviewerName: REVIEWER_NAMES[num % REVIEWER_NAMES.length],
      rating,
      comment: REVIEW_COMMENTS[num % REVIEW_COMMENTS.length],
      replied,
      replyText: replied ? "Cảm ơn quý khách đã phản hồi. Chúng tôi sẽ cải thiện dịch vụ." : undefined,
      region,
      createdAt: `2026-08-${String((num % 12) + 1).padStart(2, "0")}T10:00:00Z`,
    });
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
    body: "Cảm ơn quý khách đã tin tưởng và ủng hộ Vinamilk. Rất mong được phục vụ quý khách lần sau!",
  },
  {
    id: "confirm",
    label: "Xác nhận xử lý",
    body: "Chúng tôi đã tiếp nhận phản hồi và đang xử lý. Quý khách sẽ nhận được cập nhật trong 24 giờ.",
  },
  {
    id: "invite",
    label: "Mời quay lại",
    body: "Rất mong quý khách quay lại cửa hàng để trải nghiệm dịch vụ cải thiện. Xin tặng voucher 10% cho lần mua tiếp theo.",
  },
] as const;

export const DEMO_UNREPLIED_COUNT = DEMO_REVIEWS.filter((r) => !r.replied).length;
