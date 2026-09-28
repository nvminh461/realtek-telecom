/**
 * Site content shared by demo mode (site runs without a database, see src/demo/provider.ts)
 * and by scripts/seed.ts (loads the same content into Payload).
 *
 * Company facts, services, projects, partners and the home/about/settings texts come from the company's own
 * documents (docs/RealTek_Company_Profile.docx, docs/RealTek公司介紹_2026.pptx), in Vietnamese, English and
 * Traditional Chinese. Still placeholders: the documents' download links, the banner photos and the Unsplash
 * illustrations.
 *
 * Conventions: a `{ vi, en, zh }` object is a localized value (zh is Traditional Chinese, Taiwan usage);
 * `photo('key')` references an entry of `photos` (Unsplash) or `localPhotos` (files in public/).
 * Rich text is either one document (Vietnamese; other locales fall back to it) or `rich(vi, en, zh)`.
 */

export type L = { vi: string; en: string; zh: string }
export type PhotoRef = { $photo: PhotoKey }

/* ---------- Lexical rich text helpers ---------- */

const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const block = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }
const p = (t: string) => ({ type: 'paragraph', children: [text(t)], textFormat: 0, ...block })
const h = (t: string, tag: 'h2' | 'h3' = 'h2') => ({ type: 'heading', tag, children: [text(t)], ...block })
const ul = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ type: 'listitem', value: i + 1, children: [text(t)], ...block })),
  ...block,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RichDoc = any
const doc = (...children: object[]): RichDoc => ({ root: { type: 'root', children, ...block } })

/* ---------- Photos (free Unsplash license; Asian people and Vietnamese cities) ---------- */

export const photos = {
  earth: '1451187580459-43490279c0fa',
  skylineHcmc: '1749580869357-64f04a4dc48f',
  skylineFlowers: '1740540595751-077e773ae950',
  daNang: '1558002890-c0b30998d1e6',
  cityNight: '1509964199763-e8c2f6549853',
  meeting: '1601513042740-3f9041642307',
  teamGroup: '1601513043334-36a0088140d4',
  teamTable: '1754531976828-69e42ce4e0d9',
  womenTeam: '1650784853603-bd1ee8fb6712',
  officeTeam: '1766066014773-0074bf4911de',
  womanPortrait: '1573496799652-408c2ac9fe98',
  whiteboard: '1573166364524-d9dbfd8bbf83',
  analyst: '1738566061688-47e66a008254',
  officeDesk: '1783538771515-78a987fcdbbf',
  womanMonitors: '1558949623-35b2e2649754',
  techPanel: '1786840320410-a7bec09c393c',
  techHelmet: '1613620838744-a0fbfb76bae3',
  facilityEngineer: '1700727448575-6f1680cd7d75',
  electronicsBench: '1755053757758-e06b6593a320',
  womanEngineer: '1685475896056-8f5c6fb7e8a7',
  itSupport: '1558698972-c50e325e6799',
}

/* ---------- Local photos (files in public/, cropped from the company profile; see public/content) ----------
   Demo mode serves them straight from public/; scripts/seed.ts and scripts/update-content.ts upload them
   to the media collection (file name = basename of `src`). Width/height must match the file. */

export type LocalPhoto = { src: `/${string}`; width: number; height: number }

export const localPhotos = {
  aeonMallExterior: { src: '/content/projects/aeon-mall-exterior.jpg', width: 567, height: 555 },
  aeonMallHaiPhong: { src: '/content/projects/aeon-mall-hai-phong-le-chan.jpg', width: 456, height: 559 },
  aeonSupermarketEntrance: { src: '/content/projects/aeon-supermarket-entrance.jpg', width: 567, height: 562 },
  aeonSupermarketInterior: { src: '/content/projects/aeon-supermarket-interior.jpg', width: 456, height: 564 },
  baThienFactoryGate: { src: '/content/projects/ba-thien-vinh-phuc-factory-gate.jpg', width: 456, height: 553 },
  baThienFactoryOffice: { src: '/content/projects/ba-thien-vinh-phuc-factory-office.jpg', width: 567, height: 555 },
  nhonTrach3Factory: { src: '/content/projects/nhon-trach-3-csb-factory.jpg', width: 456, height: 562 },
  nhonTrach3ProductionLine: { src: '/content/projects/nhon-trach-3-production-line.jpg', width: 567, height: 562 },
  cymmetrikVsipFactory: { src: '/content/projects/cymmetrik-vsip-binh-duong-factory.jpg', width: 567, height: 571 },
  cymmetrikVsipGate: { src: '/content/projects/cymmetrik-vsip-binh-duong-gate.jpg', width: 457, height: 573 },
  cymmetrikVsipSign: { src: '/content/projects/cymmetrik-vsip-binh-duong-sign.jpg', width: 567, height: 590 },
  cymmetrikYenPhong: { src: '/content/projects/cymmetrik-yen-phong-bac-ninh.jpg', width: 457, height: 592 },
  mowiLongBinh: { src: '/content/projects/mowi-long-binh-dong-nai.jpg', width: 1036, height: 569 },
  otsukaNhonTrach6Office: { src: '/content/projects/otsuka-nhon-trach-6-office.jpg', width: 456, height: 588 },
  otsukaNhonTrach6Entrance: { src: '/content/projects/otsuka-nhon-trach-6-entrance.jpg', width: 567, height: 588 },
  certIso9001Vi: { src: '/content/certificates/iso-9001-2015-vi.jpg', width: 412, height: 588 },
  certIso9001En: { src: '/content/certificates/iso-9001-2015-en.jpg', width: 412, height: 588 },
  certHikvisionPartner: {
    src: '/content/certificates/hikvision-authorized-solution-partner-2024.jpg',
    width: 386,
    height: 540,
  },
  certRuijieSilverPartner: { src: '/content/certificates/ruijie-silver-partner-2024.jpg', width: 386, height: 540 },
  certLilinDistributor: { src: '/content/certificates/lilin-certificate-of-distributor.jpg', width: 474, height: 350 },
} satisfies Record<string, LocalPhoto>

export type UnsplashPhotoKey = keyof typeof photos
export type LocalPhotoKey = keyof typeof localPhotos
export type PhotoKey = UnsplashPhotoKey | LocalPhotoKey
export const photoKeys = [...Object.keys(photos), ...Object.keys(localPhotos)] as PhotoKey[]
export const isLocalPhoto = (key: PhotoKey): key is LocalPhotoKey => key in localPhotos
export const photo = (key: PhotoKey): PhotoRef => ({ $photo: key })

export const photoAlts: Record<PhotoKey, L> = {
  earth: {
    vi: 'Mạng lưới kết nối toàn cầu nhìn từ không gian',
    en: 'Global connectivity seen from space',
    zh: '從太空俯瞰全球網路',
  },
  skylineHcmc: {
    vi: 'Toàn cảnh TP. Hồ Chí Minh lúc hoàng hôn',
    en: 'Ho Chi Minh City skyline at sunset',
    zh: '日落時分的胡志明市天際線',
  },
  skylineFlowers: {
    vi: 'Các tòa nhà cao tầng tại TP. Hồ Chí Minh',
    en: 'High-rise towers in Ho Chi Minh City',
    zh: '胡志明市高樓',
  },
  daNang: { vi: 'Cầu Rồng và thành phố Đà Nẵng', en: 'Dragon Bridge and Da Nang city', zh: '峴港龍橋與城市' },
  cityNight: { vi: 'Thành phố về đêm', en: 'City at night', zh: '城市夜景' },
  meeting: { vi: 'Cuộc họp nhóm', en: 'Team meeting', zh: '團隊會議' },
  teamGroup: { vi: 'Nhóm nhân viên văn phòng', en: 'Office team', zh: '辦公室團隊' },
  teamTable: { vi: 'Họp cùng đối tác doanh nghiệp', en: 'Meeting with business partners', zh: '與企業夥伴會談' },
  womenTeam: { vi: 'Nhóm nhân viên văn phòng', en: 'Office colleagues', zh: '辦公室同事' },
  officeTeam: {
    vi: 'Nhân viên trao đổi công việc tại văn phòng',
    en: 'Colleagues working together in the office',
    zh: '同事在辦公室協作',
  },
  womanPortrait: {
    vi: 'Kỹ sư công nghệ tại văn phòng',
    en: 'Technology engineer in the office',
    zh: '辦公室裡的技術工程師',
  },
  whiteboard: {
    vi: 'Kỹ sư trình bày giải pháp trên bảng',
    en: 'Engineer sketching a solution on a whiteboard',
    zh: '工程師在白板上講解方案',
  },
  analyst: {
    vi: 'Chuyên viên phân tích số liệu hệ thống',
    en: 'Analyst reviewing system data',
    zh: '分析師檢視系統資料',
  },
  officeDesk: {
    vi: 'Nhân viên làm việc với hệ thống IT',
    en: 'Staff working on the IT system',
    zh: '員工使用 IT 系統',
  },
  womanMonitors: {
    vi: 'Lập trình viên làm việc với nhiều màn hình',
    en: 'Developer working across monitors',
    zh: '開發人員使用多台螢幕工作',
  },
  techPanel: {
    vi: 'Kỹ sư kiểm tra linh kiện điện tử',
    en: 'Engineer testing electronic components',
    zh: '工程師測試電子元件',
  },
  techHelmet: { vi: 'Kỹ thuật viên thi công tại hiện trường', en: 'Field technician at work', zh: '現場施工技術人員' },
  facilityEngineer: {
    vi: 'Kỹ sư kiểm tra hệ thống kỹ thuật',
    en: 'Engineer inspecting technical systems',
    zh: '工程師檢查技術系統',
  },
  electronicsBench: {
    vi: 'Kỹ thuật viên sửa chữa thiết bị',
    en: 'Technician servicing equipment',
    zh: '技術人員維修設備',
  },
  womanEngineer: { vi: 'Kỹ sư vận hành phòng thiết bị', en: 'Engineer in the equipment room', zh: '設備間裡的工程師' },
  itSupport: {
    vi: 'Nhân viên giám sát hệ thống máy tính',
    en: 'Staff monitoring computer systems',
    zh: '員工監控電腦系統',
  },
  aeonMallExterior: { vi: 'Trung tâm thương mại AEON MALL', en: 'AEON MALL shopping center', zh: 'AEON MALL 購物中心' },
  aeonMallHaiPhong: {
    vi: 'AEON MALL Hải Phòng Lê Chân',
    en: 'AEON MALL Hai Phong Le Chan',
    zh: 'AEON MALL 海防黎真店',
  },
  aeonSupermarketEntrance: { vi: 'Lối vào siêu thị AEON', en: 'AEON supermarket entrance', zh: 'AEON 超市入口' },
  aeonSupermarketInterior: {
    vi: 'Khu mua sắm bên trong siêu thị AEON',
    en: 'Inside an AEON supermarket',
    zh: 'AEON 超市賣場',
  },
  baThienFactoryGate: {
    vi: 'Cổng nhà máy tại KCN Bá Thiện, Vĩnh Phúc',
    en: 'Factory gate at Ba Thien Industrial Park, Vinh Phuc',
    zh: '永福省Bá Thiện 工業區廠區大門',
  },
  baThienFactoryOffice: {
    vi: 'Tòa văn phòng nhà máy tại KCN Bá Thiện, Vĩnh Phúc',
    en: 'Factory office building at Ba Thien Industrial Park, Vinh Phuc',
    zh: '永福省Bá Thiện 工業區廠區辦公大樓',
  },
  nhonTrach3Factory: {
    vi: 'Nhà xưởng tại KCN Nhơn Trạch 3, Đồng Nai',
    en: 'Factory at Nhon Trach 3 Industrial Park, Dong Nai',
    zh: '同奈省仁澤三工業區廠房',
  },
  nhonTrach3ProductionLine: {
    vi: 'Dây chuyền sản xuất trong nhà máy tại KCN Nhơn Trạch 3',
    en: 'Production line in a factory at Nhon Trach 3 Industrial Park',
    zh: '仁澤三工業區工廠生產線',
  },
  cymmetrikVsipFactory: {
    vi: 'Nhà máy Cymmetrik Việt Nam tại KCN Việt Nam - Singapore, Bình Dương',
    en: 'Cymmetrik Vietnam factory at Vietnam - Singapore Industrial Park, Binh Duong',
    zh: '平陽省越南新加坡工業園區 Cymmetrik 越南廠',
  },
  cymmetrikVsipGate: {
    vi: 'Bảng hiệu cổng Công ty TNHH Cymmetrik Việt Nam',
    en: 'Gate sign of Cymmetrik Vietnam Co., Ltd.',
    zh: 'Cymmetrik 越南有限公司大門招牌',
  },
  cymmetrikVsipSign: {
    vi: 'Bảng hiệu Công ty TNHH Cymmetrik Việt Nam tại KCN Việt Nam - Singapore',
    en: 'Cymmetrik Vietnam Co., Ltd. sign at Vietnam - Singapore Industrial Park',
    zh: '越南新加坡工業園區 Cymmetrik 越南有限公司招牌',
  },
  cymmetrikYenPhong: {
    vi: 'Tòa nhà Cymmetrik tại KCN Yên Phong, Bắc Ninh',
    en: 'Cymmetrik building at Yen Phong Industrial Park, Bac Ninh',
    zh: '北寧省安豐工業區 Cymmetrik 大樓',
  },
  mowiLongBinh: {
    vi: 'Nhà máy MOWI tại KCN Long Bình (Amata), Đồng Nai',
    en: 'MOWI plant at Long Binh (Amata) Industrial Park, Dong Nai',
    zh: '同奈省Long Bình（Amata）工業區 MOWI 工廠',
  },
  otsukaNhonTrach6Office: {
    vi: 'Tòa nhà Otsuka tại KCN Nhơn Trạch 6, Đồng Nai',
    en: 'Otsuka building at Nhon Trach 6 Industrial Park, Dong Nai',
    zh: '同奈省仁澤六工業區大塚大樓',
  },
  otsukaNhonTrach6Entrance: {
    vi: 'Sảnh chính Otsuka tại KCN Nhơn Trạch 6, Đồng Nai',
    en: 'Otsuka main entrance at Nhon Trach 6 Industrial Park, Dong Nai',
    zh: '同奈省仁澤六工業區大塚正門',
  },
  certIso9001Vi: {
    vi: 'Giấy chứng nhận ISO 9001:2015 của Realtek (tiếng Việt)',
    en: 'Realtek ISO 9001:2015 certificate (Vietnamese)',
    zh: 'Realtek ISO 9001:2015 證書（越南文版）',
  },
  certIso9001En: {
    vi: 'Giấy chứng nhận ISO 9001:2015 của Realtek (tiếng Anh)',
    en: 'Realtek ISO 9001:2015 certificate (English)',
    zh: 'Realtek ISO 9001:2015 證書（英文版）',
  },
  certHikvisionPartner: {
    vi: 'Chứng nhận Đối tác giải pháp ủy quyền Hikvision 2024',
    en: 'Hikvision Authorized Solution Partner certificate 2024',
    zh: '海康威視授權解決方案合作夥伴證書（2024）',
  },
  certRuijieSilverPartner: {
    vi: 'Chứng nhận Đối tác Bạc Ruijie 2024',
    en: 'Ruijie Silver Partner certificate 2024',
    zh: '銳捷網路銀牌合作夥伴證書（2024）',
  },
  certLilinDistributor: {
    vi: 'Chứng nhận nhà phân phối LILIN',
    en: 'LILIN certificate of distributor',
    zh: 'LILIN 經銷商證書',
  },
}

/* ---------- Categories ---------- */

export const postCategories = [
  { slug: 'company-news', title: { vi: 'Tin công ty', en: 'Company news', zh: '公司新聞' } },
  { slug: 'technology', title: { vi: 'Công nghệ', en: 'Technology', zh: '技術' } },
]

export const documentCategories = [
  { slug: 'company-profile', title: { vi: 'Hồ sơ năng lực', en: 'Company profile', zh: '公司簡介' } },
]

/** Rich text given per locale (`{ vi, en, zh }`); `localize()` picks the right one. */
const rich = (vi: object[], en: object[], zh: object[]) => ({ vi: doc(...vi), en: doc(...en), zh: doc(...zh) })

/* ---------- Services (company profile p.8–9: "Dịch vụ của chúng tôi") ----------
   The company's two service lines. `groups` are the service's categories (optionally with sub-items): nodes on the
   home-page cards, lists on the detail page. Wording follows the profile, lightly corrected. */

/** `[vi, en, zh]` → localized value. */
type Tri = [string, string, string]
const tri = ([vi, en, zh]: Tri): L => ({ vi, en, zh })
const group = (title: Tri, items: Tri[] = []) => ({
  title: tri(title),
  items: items.map((item) => ({ title: tri(item) })),
})

export const services = [
  {
    slug: 'managed-it-services',
    featuredImage: photo('electronicsBench'),
    title: { vi: 'Dịch vụ quản lý MSP', en: 'Managed services (MSP)', zh: 'MSP 委外管理服務' },
    excerpt: {
      vi: 'Realtek ICT-SP – năng lực điều hành cốt lõi: dịch vụ bảo trì, quản lý gia công ngoài, dịch vụ kiến thức và dịch vụ cấp cao.',
      en: 'Realtek ICT-SP core executive capability: maintenance, outsourced managed services, knowledge services and high-level services.',
      zh: 'Realtek ICT-SP 核心執行能力：維護服務、委外管理服務、知識服務與高階服務。',
    },
    content: rich(
      [
        p(
          'Dịch vụ quản lý MSP (Managed Service Provider) là năng lực điều hành cốt lõi của Realtek ICT-SP, gồm bốn nhóm dịch vụ.',
        ),
      ],
      [
        p(
          'Managed services (Managed Service Provider) are the core executive capability of Realtek ICT-SP, in four service groups.',
        ),
      ],
      [p('MSP 委外管理服務（Managed Service Provider）是 Realtek ICT-SP 的核心執行能力，分為四大服務類別。')],
    ),
    groups: [
      group(
        ['Dịch vụ bảo trì (MA)', 'Maintenance service (MA)', '維護服務（MA）'],
        [
          ['Xử lý sự cố', 'Troubleshooting', '故障排除'],
          ['Kiểm tra hệ thống thường xuyên', 'Regular system checks', '定期系統檢查'],
          ['Thiết bị dự phòng', 'Spare backup units', '備品備機'],
          ['Hệ thống sẵn sàng cao', 'High-availability systems', '高可用性系統'],
        ],
      ),
      group(
        ['Dịch vụ quản lý gia công ngoài', 'Outsourced managed services', '委外管理服務'],
        [
          ['Quản lý hành vi người dùng', 'User behavior management', '使用者行為管理'],
          ['Vận hành hằng ngày', 'Daily operation', '日常維運'],
          ['Thông tin quản lý', 'Management information', '管理資訊'],
          ['Kỹ sư trực tại chỗ', 'On-site standby engineers', '工程師駐點待命'],
          ['Quy trình công việc chuẩn', 'Standard workflow', '標準作業流程'],
        ],
      ),
      group(
        ['Dịch vụ kiến thức', 'Knowledge services', '知識服務'],
        [
          ['Đào tạo hệ thống', 'System training', '系統教育訓練'],
          ['Đào tạo tính năng nâng cao', 'Advanced feature training', '進階功能教育訓練'],
          ['Họp trao đổi công nghệ', 'Technology meetings', '技術交流會議'],
        ],
      ),
      group(
        ['Dịch vụ cấp cao', 'High-level services', '高階服務'],
        [
          ['Dịch vụ SLA (cam kết chất lượng dịch vụ)', 'Service level agreement (SLA)', '服務等級協議（SLA）'],
          [
            'Dịch vụ CXO (Chief Experience Officer)',
            'CXO (Chief Experience Officer) service',
            'CXO（Chief Experience Officer）服務',
          ],
          ['Tư vấn', 'Consulting', '顧問諮詢'],
          ['Cải thiện hệ thống', 'System improvement', '系統改善'],
          ['Phân tích hiệu suất', 'Performance analysis', '效能分析'],
          ['Dịch vụ kinh doanh', 'Business services', '商務服務'],
        ],
      ),
    ],
  },
  {
    slug: 'ict-system-integration',
    featuredImage: photo('facilityEngineer'),
    title: {
      vi: 'Tích hợp hệ thống CNTT – Viễn thông (ICT-SI)',
      en: 'ICT system integration (ICT-SI)',
      zh: 'ICT 系統整合（ICT-SI）',
    },
    excerpt: {
      vi: 'Realtek SI – giải pháp CNTT: điện UPS, giám sát, truyền thông, mạng, hạ tầng cáp, bảo mật mạng, ảo hóa & SDx, trung tâm dữ liệu, máy chủ – lưu trữ, PC & thin client.',
      en: 'Realtek SI ICT solutions: UPS power, surveillance, communications, networks, cabling, network security, virtualization & SDx, data centers, servers & storage, PCs & thin clients.',
      zh: 'Realtek SI 資訊解決方案：UPS 電力、監控、通訊、網路、綜合佈線、網路安全、虛擬化與 SDx、資料中心、伺服器與儲存、個人電腦與 Thin Client。',
    },
    content: rich(
      [p('Realtek SI cung cấp giải pháp CNTT (ICT Solution) cho doanh nghiệp, gồm mười hạng mục hệ thống.')],
      [p('Realtek SI delivers ICT solutions for businesses across ten system areas.')],
      [p('Realtek SI 為企業提供資訊解決方案（ICT Solution），涵蓋十大系統領域。')],
    ),
    groups: [
      group(['Hệ thống điện UPS', 'UPS power systems', 'UPS 電力系統']),
      group(['Hệ thống giám sát', 'Surveillance systems', '監控系統']),
      group(['Hệ thống truyền thông', 'Communication systems', '通訊系統']),
      group(['Hệ thống mạng', 'Network systems', '網路系統']),
      group(['Hạ tầng cáp', 'Cabling infrastructure', '綜合佈線']),
      group(['Bảo mật mạng', 'Network security', '網路安全']),
      group(['Ảo hóa & SDx', 'Virtualization & SDx', '虛擬化與 SDx']),
      group(['Trung tâm dữ liệu', 'Data center', '資料中心']),
      group(['Máy chủ và lưu trữ', 'Servers & storage', '伺服器與儲存']),
      group(['PC & máy khách mỏng (thin client)', 'PCs & thin clients', '個人電腦與精簡型終端（Thin Client）']),
    ],
  },
].map((s, i) => ({ ...s, order: i + 1, featured: true, gallery: [] }))

/* ---------- Projects (profile p.24–27 with photos, deck slides 9–13) ----------
   The documents give no project years, so `year` is left empty. Locations use the names printed in the
   documents (before the 2025 merger of provinces). */

const projectDoc = (intro: string, scopeTitle: string, scope: string[], outro?: string) =>
  doc(p(intro), h(scopeTitle), ul(scope), ...(outro ? [p(outro)] : []))

export const projects = [
  {
    slug: 'aeon-vietnam-security-surveillance',
    featuredImage: photo('aeonMallExterior'),
    gallery: [photo('aeonMallHaiPhong'), photo('aeonSupermarketEntrance'), photo('aeonSupermarketInterior')],
    featured: true,
    title: { vi: 'Camera an ninh chuỗi AEON', en: 'AEON security surveillance', zh: 'AEON 永旺安防監控' },
    client: { vi: 'AEON Việt Nam', en: 'AEON Vietnam', zh: 'AEON 永旺（越南）' },
    location: {
      vi: 'TP. Hồ Chí Minh, Bình Dương, Hà Nội, Hải Phòng',
      en: 'Ho Chi Minh City, Binh Duong, Hanoi, Hai Phong',
      zh: '胡志明市、平陽、河內、海防',
    },
    field: { vi: 'An ninh – giám sát', en: 'Security & surveillance', zh: '監控安防' },
    excerpt: {
      vi: 'Hệ thống camera an ninh cho 8 trung tâm thương mại AEON (TP. Hồ Chí Minh, Bình Dương, Hà Nội, Hải Phòng) và 100 cửa hàng bán lẻ AEON tại TP. Hồ Chí Minh.',
      en: 'Security surveillance for 8 AEON shopping malls (Ho Chi Minh City, Binh Duong, Hanoi, Hai Phong) and 100 AEON retail stores in Ho Chi Minh City.',
      zh: '為胡志明市、平陽、河內、海防等地 8 座 AEON 購物中心，及胡志明市 100 家 AEON 生活超市門市建置安防監控。',
    },
    content: {
      vi: projectDoc(
        'Realtek triển khai hệ thống an ninh giám sát theo mô hình khu thương mại thông minh cho chuỗi AEON tại Việt Nam, trong đó có AEON MALL Hải Phòng Lê Chân, AEON MALL Hà Đông, AEON Bình Dương và AEON Nguyễn Văn Linh.',
        'Phạm vi công việc',
        [
          'Camera an ninh cho 8 trung tâm thương mại tại TP. Hồ Chí Minh, Bình Dương, Hà Nội và Hải Phòng',
          'Hệ thống camera cho 100 cửa hàng bán lẻ AEON tại TP. Hồ Chí Minh',
        ],
      ),
      en: projectDoc(
        'Realtek deployed smart-campus security surveillance for AEON in Vietnam, including AEON MALL Hai Phong Le Chan, AEON MALL Ha Dong, AEON Binh Duong and AEON Nguyen Van Linh.',
        'Scope of work',
        [
          'Security surveillance for 8 shopping malls in Ho Chi Minh City, Binh Duong, Hanoi and Hai Phong',
          'CCTV for 100 AEON retail stores in Ho Chi Minh City',
        ],
      ),
      zh: projectDoc(
        'Realtek 為 AEON 永旺越南建置購物中心智慧園區安防監控，涵蓋 AEON MALL 海防黎真、AEON MALL 河東、AEON 平陽及 AEON 阮文靈等據點。',
        '工作範圍',
        ['胡志明市、平陽、河內、海防等 8 座購物中心安防監控', '胡志明市 100 家 AEON 生活超市門市監控系統'],
      ),
    },
  },
  {
    slug: 'compal-vietnam-server-room',
    featuredImage: photo('baThienFactoryOffice'),
    gallery: [photo('baThienFactoryGate')],
    featured: true,
    title: { vi: 'Phòng máy nhà máy Compal', en: 'Compal plant server room', zh: '仁寶越南廠資料機房' },
    client: { vi: 'Compal', en: 'Compal', zh: '仁寶電腦' },
    location: {
      vi: 'KCN Bá Thiện, Bình Xuyên, Vĩnh Phúc',
      en: 'Ba Thien Industrial Park, Binh Xuyen, Vinh Phuc',
      zh: '永福省平川縣 Bá Thiện 工業區',
    },
    field: { vi: 'Trung tâm dữ liệu', en: 'Data center', zh: '資料中心' },
    excerpt: {
      vi: 'Phòng máy, UPS, giám sát môi trường và cáp cấu trúc cho nhà máy Compal tại miền Bắc Việt Nam.',
      en: 'Server room, UPS, environmental monitoring and structured cabling for Compal’s northern Vietnam plant.',
      zh: '仁寶北越廠資料機房、UPS、環控系統與綜合佈線工程。',
    },
    content: {
      vi: projectDoc(
        'Compal là khách hàng mà đội ngũ sáng lập Realtek phục vụ từ năm 2001. Tại nhà máy miền Bắc Việt Nam ở KCN Bá Thiện (Vĩnh Phúc), Realtek xây dựng hạ tầng phòng máy.',
        'Phạm vi công việc',
        ['Phòng máy dữ liệu', 'Hệ thống UPS', 'Hệ thống giám sát môi trường', 'Thi công cáp cấu trúc'],
      ),
      en: projectDoc(
        'Compal has been served by Realtek’s founding team since 2001. At its northern Vietnam plant in Ba Thien Industrial Park (Vinh Phuc), Realtek built the server-room infrastructure.',
        'Scope of work',
        ['Data room', 'UPS system', 'Environmental monitoring system', 'Structured cabling'],
      ),
      zh: projectDoc(
        '仁寶是 Realtek 創始團隊自 2001 年起服務的客戶。Realtek 於仁寶北越廠（永福省 Bá Thiện 工業區）完成機房基礎建設。',
        '工作範圍',
        ['資料機房', 'UPS', '環控系統', '綜合佈線工程'],
      ),
    },
  },
  {
    slug: 'hitachi-chemical-battery-plant',
    featuredImage: photo('nhonTrach3Factory'),
    gallery: [photo('nhonTrach3ProductionLine')],
    featured: true,
    title: {
      vi: 'Hạ tầng nhà máy pin Hitachi Chemical',
      en: 'Hitachi Chemical battery plant infrastructure',
      zh: 'Hitachi Chemical 電池廠基礎系統',
    },
    client: { vi: 'Hitachi Chemical', en: 'Hitachi Chemical', zh: 'Hitachi Chemical（日立化成）' },
    location: {
      vi: 'KCN Nhơn Trạch 3, Đồng Nai', // docx p.25: "Đường số 4, KCN Nhơn Trạch 3 – GĐ 2"
      en: 'Nhon Trach 3 Industrial Park, Dong Nai',
      zh: '同奈省仁澤三工業區',
    },
    field: { vi: 'Tích hợp hệ thống', en: 'System integration', zh: '系統整合' },
    excerpt: {
      vi: 'Xây dựng toàn bộ hệ thống nền tảng cho nhà máy sản xuất pin: mạng, tổng đài, camera, điện và cáp.',
      en: 'All base systems for a battery factory: network, telephony, CCTV, power and cabling.',
      zh: '電池生產工廠全基礎系統建置：網路、電話、監控、電力與佈線。',
    },
    content: {
      vi: projectDoc(
        'Tại nhà máy sản xuất pin của Hitachi Chemical ở KCN Nhơn Trạch (Đồng Nai), Realtek xây dựng toàn bộ hệ thống nền tảng.',
        'Phạm vi công việc',
        ['Hệ thống mạng', 'Hệ thống điện thoại', 'Camera giám sát', 'Hệ thống điện', 'Cáp cơ bản'],
      ),
      en: projectDoc(
        'At Hitachi Chemical’s battery plant in Nhon Trach Industrial Park (Dong Nai), Realtek built all of the base systems.',
        'Scope of work',
        ['Network', 'Telephone system', 'CCTV surveillance', 'Power', 'Basic cabling'],
      ),
      zh: projectDoc('Realtek 為 Hitachi Chemical 位於同奈省仁澤工業區的電池生產工廠完成全基礎系統建置。', '工作範圍', [
        '網路',
        '電話系統',
        '監控',
        '電力',
        '基礎佈線',
      ]),
    },
  },
  {
    slug: 'cymmetrik-vietnam-factories',
    featuredImage: photo('cymmetrikVsipFactory'),
    gallery: [photo('cymmetrikYenPhong'), photo('cymmetrikVsipGate'), photo('cymmetrikVsipSign')],
    featured: true,
    title: { vi: 'Nhà máy Cymmetrik Việt Nam', en: 'Cymmetrik Vietnam plants', zh: '正美科技越南廠' },
    client: { vi: 'Cymmetrik Việt Nam', en: 'Cymmetrik Vietnam', zh: '正美科技' },
    location: {
      vi: 'KCN Yên Phong, Bắc Ninh; VSIP, Bình Dương',
      en: 'Yen Phong IP, Bac Ninh; VSIP, Binh Duong',
      zh: '北寧安豐工業區；平陽越南新加坡工業園區（VSIP）',
    },
    field: { vi: 'Điện nhẹ & trung tâm dữ liệu', en: 'ELV & data center', zh: '弱電工程與資料中心' },
    excerpt: {
      vi: 'Phòng máy, điện nhẹ, thiết bị mạng, tổng đài, ra vào – chấm công và camera cho các nhà máy Cymmetrik tại Bắc Ninh và Bình Dương.',
      en: 'Server rooms, ELV, network, telephony, access control and CCTV for Cymmetrik’s plants in Bac Ninh and Binh Duong.',
      zh: '正美科技北寧與平陽廠：資料機房、弱電工程、網路設備、電話、門禁考勤與安防監控。',
    },
    content: {
      vi: projectDoc(
        'Realtek triển khai hạ tầng CNTT và điện nhẹ cho các nhà máy của Cymmetrik tại Việt Nam. Công ty cũng thực hiện phạm vi tương tự cho nhà máy Cymmetrik tại Thái Lan.',
        'Phạm vi công việc',
        [
          'Bắc Ninh (KCN Yên Phong): phòng máy trung tâm dữ liệu, điện nhẹ, thiết bị mạng, tổng đài, kiểm soát ra vào – chấm công, camera an ninh',
          'Bình Dương (KCN Việt Nam – Singapore): phòng máy, điện nhẹ toàn nhà máy, thiết bị mạng, tổng đài',
        ],
      ),
      en: projectDoc(
        'Realtek delivered IT and ELV infrastructure for Cymmetrik’s plants in Vietnam, and a similar scope for its plant in Thailand.',
        'Scope of work',
        [
          'Bac Ninh (Yen Phong Industrial Park): data-center room, ELV, network equipment, telephony, access control and attendance, security surveillance',
          'Binh Duong (Vietnam – Singapore Industrial Park): data room, plant-wide ELV, network equipment, telephony',
        ],
      ),
      zh: projectDoc('Realtek 為正美科技越南各廠建置資訊與弱電基礎設施，並於泰國廠執行相同範圍的工程。', '工作範圍', [
        '北寧（安豐工業區）：資料中心機房、弱電工程、網路設備、電話系統、門禁與考勤、安防監控系統',
        '平陽（越南新加坡工業園區）：資料機房、全廠弱電工程、網路設備、電話系統',
      ]),
    },
  },
  {
    slug: 'mowi-vietnam-ict-upgrade',
    featuredImage: photo('mowiLongBinh'),
    gallery: [],
    featured: true,
    title: { vi: 'Nâng cấp hạ tầng CNTT nhà máy MOWI', en: 'MOWI plant ICT upgrade', zh: '美威越南廠資通訊整改' },
    client: { vi: 'MOWI', en: 'MOWI', zh: 'MOWI 美威' },
    location: {
      vi: 'KCN Long Bình (Amata), Biên Hòa, Đồng Nai',
      en: 'Long Binh (Amata) Industrial Park, Bien Hoa, Dong Nai',
      zh: '同奈省邊和市 Long Bình（Amata）工業區',
    },
    field: { vi: 'Tích hợp hệ thống', en: 'System integration', zh: '系統整合' },
    excerpt: {
      vi: 'Cải tạo toàn bộ hệ thống thông tin – truyền thông, phòng máy, camera và giải pháp thiết bị kho lạnh cho nhà máy MOWI.',
      en: 'Plant-wide ICT overhaul, IT-room upgrade, CCTV renewal and cold-storage equipment for MOWI.',
      zh: '美威越南廠全廠區資通訊系統整改、機房環境改善、監控整改與冷凍庫設備方案。',
    },
    content: {
      vi: projectDoc(
        'Tại nhà máy MOWI ở KCN Long Bình (Amata), Đồng Nai, Realtek cải tạo toàn diện hạ tầng thông tin – truyền thông.',
        'Phạm vi công việc',
        [
          'Cải tạo hệ thống thông tin – truyền thông toàn khu nhà máy',
          'Cải thiện môi trường phòng máy CNTT',
          'Cải tạo hệ thống camera giám sát',
          'Giải pháp thiết bị cho kho lạnh',
        ],
      ),
      en: projectDoc(
        'At MOWI’s plant in Long Binh (Amata) Industrial Park, Dong Nai, Realtek carried out a complete overhaul of the ICT infrastructure.',
        'Scope of work',
        [
          'Plant-wide ICT system overhaul',
          'IT-room environment upgrade',
          'CCTV system renewal',
          'Equipment solution for cold storage',
        ],
      ),
      zh: projectDoc(
        'Realtek 為美威位於同奈省 Long Bình（Amata）工業區的越南工廠進行資通訊基礎設施全面整改。',
        '工作範圍',
        ['全廠區資通訊系統整改', '資訊機房環境改善', '監控系統整改', '冷凍庫設備方案建置'],
      ),
    },
  },
  {
    slug: 'otsuka-techno-new-plant',
    featuredImage: photo('otsukaNhonTrach6Entrance'),
    gallery: [photo('otsukaNhonTrach6Office')],
    featured: true,
    title: {
      vi: 'Hệ thống điện nhẹ nhà máy Otsuka Techno',
      en: 'Otsuka Techno new plant ELV',
      zh: 'Otsuka Techno 新廠弱電系統',
    },
    client: { vi: 'Otsuka Techno', en: 'Otsuka Techno', zh: 'Otsuka Techno' },
    location: {
      vi: 'KCN Nhơn Trạch 6, Đồng Nai',
      en: 'Nhon Trach 6 Industrial Park, Dong Nai',
      zh: '同奈省仁澤六工業區',
    },
    field: { vi: 'Điện nhẹ', en: 'ELV systems', zh: '弱電工程' },
    excerpt: {
      vi: 'Toàn bộ hệ thống điện nhẹ, mạng, tổng đài, kiểm soát ra vào và an ninh cho nhà máy mới của Otsuka Techno tại miền Nam.',
      en: 'All ELV, network, telephony, access-control and security systems for Otsuka Techno’s new plant in southern Vietnam.',
      zh: 'Otsuka Techno 南越新廠全弱電系統、網路、電話、門禁與安防系統建置。',
    },
    content: {
      vi: projectDoc(
        'Realtek xây dựng toàn bộ hệ thống điện nhẹ cho nhà máy mới của Otsuka Techno tại miền Nam Việt Nam.',
        'Phạm vi công việc',
        [
          'Hệ thống điện nhẹ toàn nhà máy',
          'Hệ thống mạng',
          'Hệ thống điện thoại',
          'Kiểm soát ra vào',
          'Hệ thống an ninh',
        ],
      ),
      en: projectDoc(
        'Realtek built the complete ELV systems for Otsuka Techno’s new plant in southern Vietnam.',
        'Scope of work',
        ['Plant-wide ELV systems', 'Network', 'Telephone system', 'Access control', 'Security systems'],
      ),
      zh: projectDoc('Realtek 為 Otsuka Techno 南越新廠完成全弱電系統建設。', '工作範圍', [
        '全廠弱電系統',
        '網路系統',
        '電話系統',
        '門禁系統',
        '安防系統',
      ]),
    },
  },
  {
    slug: 'pou-chen-alcatel-telephony',
    featuredImage: photo('teamTable'),
    gallery: [photo('officeDesk')],
    featured: false,
    title: {
      vi: 'Tổng đài 3.000 máy nhánh cho Pou Chen',
      en: '3,000-extension PBX for Pou Chen',
      zh: '寶成 3,000 門電話系統',
    },
    client: { vi: 'Pou Chen (Pou Sung Việt Nam)', en: 'Pou Chen (Pou Sung Vietnam)', zh: '寶成實業（越南寶崧）' },
    location: { vi: 'Việt Nam', en: 'Vietnam', zh: '越南' }, // document gives no city
    field: { vi: 'Tổng đài & truyền thông', en: 'Telephony & UC', zh: '電話與統一通訊' },
    excerpt: {
      vi: 'Hệ thống điện thoại Alcatel quy mô 3.000 máy nhánh cho Pou Sung Việt Nam, thuộc tập đoàn Pou Chen.',
      en: 'A 3,000-extension Alcatel telephone system for Pou Sung Vietnam, part of the Pou Chen group.',
      zh: '為寶成集團越南寶崧建置 Alcatel 3,000 門電話系統。',
    },
    content: {
      vi: projectDoc(
        'Pou Chen là một trong những khách hàng mà đội ngũ sáng lập Realtek phục vụ từ trước năm 2011. Tại Pou Sung Việt Nam, Realtek triển khai hệ thống điện thoại Alcatel quy mô lớn.',
        'Phạm vi công việc',
        ['Hệ thống điện thoại Alcatel 3.000 máy nhánh'],
      ),
      en: projectDoc(
        'Pou Chen is one of the groups Realtek’s founding team has served since before 2011. At Pou Sung Vietnam, Realtek deployed a large-scale Alcatel telephone system.',
        'Scope of work',
        ['Alcatel telephone system with 3,000 extensions'],
      ),
      zh: projectDoc(
        '寶成是 Realtek 創始團隊自 2011 年以前即服務的集團客戶。Realtek 於越南寶崧建置大型 Alcatel 電話系統。',
        '工作範圍',
        ['Alcatel 3,000 門電話系統'],
      ),
    },
  },
  {
    slug: 'pegatron-deep-c-hai-phong-network',
    featuredImage: photo('earth'),
    gallery: [photo('techPanel')],
    featured: false,
    title: { vi: 'Mạng nhà máy PEGATRON Hải Phòng', en: 'PEGATRON Hai Phong plant network', zh: '和碩海防廠區網路' },
    client: { vi: 'PEGATRON', en: 'PEGATRON', zh: '和碩科技' },
    location: { vi: 'KCN DEEP C, Hải Phòng', en: 'DEEP C Industrial Zone, Hai Phong', zh: '海防 DEEP C 工業區' },
    field: { vi: 'Hạ tầng mạng', en: 'Networking', zh: '網路' },
    excerpt: {
      vi: 'Lắp đặt và cấu hình thiết bị mạng cho toàn khu nhà máy PEGATRON tại KCN DEEP C, Hải Phòng.',
      en: 'Installation and configuration of network equipment across PEGATRON’s plant at DEEP C, Hai Phong.',
      zh: '和碩 DEEP C 海防全廠區網路設備安裝與設定服務。',
    },
    content: {
      vi: projectDoc(
        'Realtek lắp đặt và cấu hình thiết bị mạng cho toàn bộ khu nhà máy của PEGATRON tại KCN DEEP C, Hải Phòng.',
        'Phạm vi công việc',
        ['Lắp đặt thiết bị mạng toàn khu nhà máy', 'Cấu hình và đưa vào vận hành'],
      ),
      en: projectDoc(
        'Realtek installed and configured network equipment across PEGATRON’s entire plant site at DEEP C Industrial Zone, Hai Phong.',
        'Scope of work',
        ['Plant-wide network equipment installation', 'Configuration and commissioning'],
      ),
      zh: projectDoc('Realtek 為和碩海防 DEEP C 工業區全廠區進行網路設備安裝與設定。', '工作範圍', [
        '全廠區網路設備安裝',
        '設定與上線',
      ]),
    },
  },
  {
    slug: 'cathay-united-bank-china-network',
    featuredImage: photo('analyst'),
    gallery: [photo('womanMonitors')],
    featured: false,
    title: {
      vi: 'Hạ tầng mạng Cathay United Bank tại Trung Quốc',
      en: 'Cathay United Bank network in China',
      zh: '國泰世華銀行大陸網路建置',
    },
    client: { vi: 'Cathay United Bank', en: 'Cathay United Bank', zh: '國泰世華商業銀行' },
    location: { vi: 'Trung Quốc đại lục', en: 'Mainland China', zh: '中國大陸' },
    field: { vi: 'Tài chính – ngân hàng', en: 'Banking', zh: '金融業' },
    excerpt: {
      vi: 'Mạng lõi trung tâm dữ liệu, trung tâm dự phòng, mạng chi nhánh, tổng đài, SD-WAN, tường lửa và bảo trì hằng năm.',
      en: 'Data-center core and DR networks, branch networks, telephony, SD-WAN, firewalls and annual maintenance.',
      zh: '資料中心核心網路、備援中心網路、分行網路、電話系統、SD-WAN、防火牆與年度維護。',
    },
    content: {
      vi: projectDoc(
        'Realtek xây dựng và bảo trì hạ tầng mạng cho hoạt động của Cathay United Bank tại Trung Quốc đại lục.',
        'Phạm vi công việc',
        [
          'Mạng lõi trung tâm dữ liệu và mạng trung tâm dự phòng',
          'Mạng các chi nhánh tại Trung Quốc đại lục',
          'Hệ thống điện thoại, SD-WAN, hệ thống tường lửa',
          'Bảo trì hằng năm',
        ],
      ),
      en: projectDoc(
        'Realtek builds and maintains the network infrastructure behind Cathay United Bank’s operations in mainland China.',
        'Scope of work',
        [
          'Data-center core network and disaster-recovery network',
          'Branch networks across mainland China',
          'Telephony, SD-WAN and firewall systems',
          'Annual maintenance',
        ],
      ),
      zh: projectDoc('Realtek 為國泰世華商業銀行中國大陸營運建置並維護網路基礎架構。', '工作範圍', [
        '資料中心核心網路、備援中心網路',
        '大陸各分行網路',
        '電話系統、SD-WAN、防火牆系統',
        '年度維護',
      ]),
    },
  },
  {
    slug: 'iteq-thailand-plant-it',
    featuredImage: photo('whiteboard'),
    gallery: [photo('facilityEngineer')],
    featured: false,
    title: { vi: 'Hạ tầng CNTT nhà máy ITEQ Thái Lan', en: 'ITEQ Thailand plant IT', zh: '聯茂電子泰國廠資訊建置' },
    client: { vi: 'ITEQ', en: 'ITEQ', zh: '聯茂電子' },
    location: { vi: 'Thái Lan', en: 'Thailand', zh: '泰國' },
    field: { vi: 'Trung tâm dữ liệu & điện nhẹ', en: 'Data center & ELV', zh: '機房與弱電工程' },
    excerpt: {
      vi: 'Phòng máy, điện nhẹ, thiết bị mạng, nền tảng ảo hóa và hệ thống siêu hội tụ cho toàn nhà máy ITEQ tại Thái Lan.',
      en: 'IT room, ELV, network equipment, virtualization and hyper-converged systems for ITEQ’s plant in Thailand.',
      zh: '聯茂電子泰國廠全廠資訊機房、弱電工程、網通設備、虛擬化平臺與超融合系統。',
    },
    content: {
      vi: projectDoc(
        'Tại Thái Lan, Realtek xây dựng hạ tầng CNTT toàn diện cho nhà máy của ITEQ.',
        'Phạm vi công việc',
        ['Phòng máy CNTT toàn nhà máy', 'Điện nhẹ', 'Thiết bị mạng', 'Nền tảng ảo hóa', 'Hệ thống siêu hội tụ'],
      ),
      en: projectDoc('In Thailand, Realtek built the complete IT infrastructure for ITEQ’s plant.', 'Scope of work', [
        'Plant-wide IT room',
        'ELV systems',
        'Network equipment',
        'Virtualization platform',
        'Hyper-converged system',
      ]),
      zh: projectDoc('Realtek 於泰國為聯茂電子工廠建置完整資訊基礎架構。', '工作範圍', [
        '全廠資訊機房',
        '弱電工程',
        '網通設備',
        '虛擬化平臺',
        '超融合系統',
      ]),
    },
  },
].map((pr, i) => ({ ...pr, order: i }))

/* ---------- Posts ----------
   Company news uses only facts from the company's documents (business registration, ISO certificate);
   technology articles are general information. `date` (ISO) fixes the publish date of a dated event;
   otherwise the date is derived from `daysAgo`. */

export const posts = [
  {
    slug: 'realtek-launches-new-website',
    featuredImage: photo('teamTable'),
    category: 'company-news',
    title: { vi: 'Realtek ra mắt website mới', en: 'Realtek launches its new website', zh: 'Realtek 新網站上線' },
    excerpt: {
      vi: 'Website mới của Realtek có ba ngôn ngữ Việt, Anh, Trung, giới thiệu dịch vụ và dự án tiêu biểu, kèm thư viện tài liệu để tải hồ sơ năng lực và tài liệu giới thiệu công ty.',
      en: 'Realtek’s new website is available in Vietnamese, English and Chinese, presents our services and selected projects, and includes a document library for the company profile and company introduction.',
      zh: 'Realtek 新網站提供越南文、英文、中文三種語言，介紹服務項目與代表案例，並設有文件庫，供下載公司簡介與公司介紹資料。',
    },
    content: rich(
      [
        p(
          'Realtek chính thức đưa vào hoạt động website mới, nơi khách hàng và đối tác có thể tìm hiểu về công ty, các dịch vụ tích hợp hệ thống ICT và điện nhẹ, các dự án tiêu biểu, đồng thời liên hệ trực tiếp với đội ngũ kinh doanh và kỹ thuật.',
        ),
        h('Ba ngôn ngữ'),
        p(
          'Toàn bộ nội dung được trình bày bằng tiếng Việt, tiếng Anh và tiếng Trung phồn thể. Khách hàng chọn ngôn ngữ ở đầu trang; mỗi trang đều có phiên bản tương ứng ở cả ba ngôn ngữ nên dễ chia sẻ cho đồng nghiệp ở các quốc gia khác nhau.',
        ),
        h('Thư viện tài liệu'),
        ul([
          'Tìm tài liệu theo tên hoặc từ khóa, gõ có dấu hay không dấu đều được',
          'Lọc tài liệu theo danh mục',
          'Sắp xếp theo tài liệu mới nhất hoặc được tải nhiều nhất',
          'Mỗi tài liệu có trang giới thiệu nội dung trước khi tải về từ Google Drive hoặc OneDrive',
        ]),
        h('Liên hệ thuận tiện hơn'),
        p(
          'Trang Liên hệ có biểu mẫu gửi yêu cầu tư vấn, cho phép chọn dịch vụ quan tâm; yêu cầu được chuyển đến đội ngũ Realtek để phản hồi. Khách hàng cũng có thể gọi 028 3830 2678 hoặc gửi email đến sales@realtektelecom.com.',
        ),
        p('Mục Tin tức sẽ tiếp tục cập nhật hoạt động của công ty và các bài viết kỹ thuật hữu ích cho doanh nghiệp.'),
      ],
      [
        p(
          'Realtek’s new website is now live. Customers and partners can learn about the company, our ICT and ELV system integration services and selected projects, and get in touch directly with our sales and engineering teams.',
        ),
        h('Three languages'),
        p(
          'All content is available in Vietnamese, English and Traditional Chinese. Visitors pick a language at the top of the page, and every page has a matching version in all three languages, so it is easy to share with colleagues in other countries.',
        ),
        h('Document library'),
        ul([
          'Search documents by title or keyword, with or without Vietnamese diacritics',
          'Filter documents by category',
          'Sort by newest or most downloaded',
          'Each document has an overview page before you download it from Google Drive or OneDrive',
        ]),
        h('Easier to reach us'),
        p(
          'The Contact page has a consultation request form where you can choose the service you are interested in; requests are passed on to the Realtek team for a reply. You can also call 028 3830 2678 or email sales@realtektelecom.com.',
        ),
        p('The News section will keep sharing company updates and practical technical articles for businesses.'),
      ],
      [
        p(
          'Realtek 新網站正式上線。客戶與合作夥伴可在此了解公司、ICT 與弱電系統整合服務及代表案例，並直接與我們的業務和技術團隊聯繫。',
        ),
        h('三種語言'),
        p(
          '網站全部內容提供越南文、英文與繁體中文版本。訪客可在頁首切換語言，每個頁面在三種語言中都有對應版本，方便分享給不同國家的同事。',
        ),
        h('資料下載'),
        ul([
          '依名稱或關鍵字搜尋資料，越南文輸入時可省略聲調符號',
          '依類別篩選資料',
          '依最新上架或下載次數排序',
          '每份資料都有介紹頁，先了解內容再從 Google Drive 或 OneDrive 下載',
        ]),
        h('聯繫更便利'),
        p(
          '「聯絡我們」頁面設有諮詢表單，可選擇感興趣的服務項目，送出後將轉交 Realtek 團隊回覆。您也可以撥打 028 3830 2678 或寄信至 sales@realtektelecom.com。',
        ),
        p('「最新消息」單元將持續分享公司動態與實用的技術文章。'),
      ],
    ),
  },
  {
    slug: 'wifi-7-for-business',
    featuredImage: photo('womanPortrait'),
    category: 'technology',
    title: {
      vi: 'Wi-Fi 7 và lợi ích cho doanh nghiệp',
      en: 'Wi-Fi 7 and what it means for business',
      zh: 'Wi-Fi 7 對企業的意義',
    },
    excerpt: {
      vi: 'Wi-Fi 7 (IEEE 802.11be) mang lại kênh rộng hơn, điều chế bậc cao hơn và kết nối đa liên kết. Những điều doanh nghiệp cần biết trước khi nâng cấp mạng không dây.',
      en: 'Wi-Fi 7 (IEEE 802.11be) brings wider channels, denser modulation and multi-link operation. Here is what businesses should know before upgrading their wireless network.',
      zh: 'Wi-Fi 7（IEEE 802.11be）帶來更寬的通道、更高階的調變與多鏈路運作。本文整理企業升級無線網路前應了解的重點。',
    },
    content: rich(
      [
        p(
          'Wi-Fi 7 là tên thương mại của chuẩn IEEE 802.11be. Wi-Fi Alliance bắt đầu chương trình chứng nhận Wi-Fi CERTIFIED 7 từ đầu năm 2024, và điểm truy cập lẫn thiết bị đầu cuối hỗ trợ chuẩn này ngày càng phổ biến.',
        ),
        h('Những điểm mới chính'),
        ul([
          'Kênh rộng tới 320 MHz ở băng tần 6 GHz, gấp đôi độ rộng kênh tối đa của Wi-Fi 6E',
          'Điều chế 4096-QAM (4K-QAM), tăng khoảng 20% tốc độ so với 1024-QAM khi tín hiệu tốt',
          'Multi-Link Operation (MLO): thiết bị kết nối đồng thời trên nhiều băng tần, giảm độ trễ và tăng độ ổn định',
          'Multi-RU và preamble puncturing: vẫn tận dụng được phần kênh còn trống khi một phần kênh bị nhiễu',
        ]),
        h('Lợi ích cho doanh nghiệp'),
        p(
          'Lợi ích rõ nhất nằm ở các khu vực mật độ người dùng cao như phòng họp, hội trường, khu sản xuất có nhiều thiết bị di động, và ở các ứng dụng nhạy với độ trễ như họp trực tuyến, thực tế tăng cường hay xe tự hành trong nhà máy. Tốc độ lý thuyết tối đa rất cao, nhưng thông lượng thực tế phụ thuộc vào thiết bị đầu cuối, số người dùng và môi trường lắp đặt.',
        ),
        h('Cần chuẩn bị gì trước khi nâng cấp'),
        ul([
          'Kiểm tra quy định sử dụng băng tần 6 GHz tại quốc gia triển khai, vì kênh 320 MHz chỉ có ở băng tần này',
          'Bảo đảm switch có cổng multi-gigabit (2.5/5/10 GbE) và đủ công suất PoE cho điểm truy cập',
          'Rà soát thiết bị đầu cuối: chỉ thiết bị hỗ trợ Wi-Fi 7 mới dùng được các tính năng mới',
          'Dùng WPA3, bắt buộc khi hoạt động ở băng tần 6 GHz',
          'Khảo sát sóng lại thay vì lắp điểm truy cập mới vào đúng vị trí cũ',
        ]),
        p(
          'Với nhiều văn phòng, hệ thống Wi-Fi 6/6E vẫn đáp ứng tốt nhu cầu hiện tại; Wi-Fi 7 hợp lý nhất khi xây mới, mở rộng hoặc khi mạng hiện hữu đã quá tải. Liên hệ Realtek để được khảo sát và tư vấn phương án phù hợp.',
        ),
      ],
      [
        p(
          'Wi-Fi 7 is the trade name of the IEEE 802.11be standard. The Wi-Fi Alliance launched its Wi-Fi CERTIFIED 7 program in early 2024, and access points and client devices that support it are becoming common.',
        ),
        h('What is new'),
        ul([
          'Channels up to 320 MHz wide in the 6 GHz band, twice the maximum channel width of Wi-Fi 6E',
          '4096-QAM (4K-QAM) modulation, about 20% faster than 1024-QAM when the signal is strong',
          'Multi-Link Operation (MLO): devices connect over several bands at once, cutting latency and improving reliability',
          'Multi-RU and preamble puncturing: the clean part of a channel can still be used when part of it has interference',
        ]),
        h('Benefits for businesses'),
        p(
          'The clearest gains are in high-density areas such as meeting rooms, auditoriums and production floors with many mobile devices, and for latency-sensitive applications such as video meetings, augmented reality or autonomous vehicles in plants. Peak theoretical speeds are very high, but real-world throughput depends on client devices, the number of users and the installation environment.',
        ),
        h('Before you upgrade'),
        ul([
          'Check the rules for the 6 GHz band in the country of deployment, since 320 MHz channels exist only in that band',
          'Make sure switches have multi-gigabit ports (2.5/5/10 GbE) and enough PoE budget for the access points',
          'Review client devices: only Wi-Fi 7 devices can use the new features',
          'Use WPA3, which is mandatory for 6 GHz operation',
          'Run a new site survey rather than putting new access points in the old positions',
        ]),
        p(
          'For many offices, Wi-Fi 6/6E still meets today’s needs; Wi-Fi 7 makes most sense for new builds, expansions or networks that are already overloaded. Contact Realtek for a site survey and advice on the right design.',
        ),
      ],
      [
        p(
          'Wi-Fi 7 是 IEEE 802.11be 標準的商業名稱。Wi-Fi Alliance 於 2024 年初推出 Wi-Fi CERTIFIED 7 認證計畫，支援此標準的無線基地台與終端裝置日益普及。',
        ),
        h('主要新功能'),
        ul([
          '6 GHz 頻段通道寬度最高 320 MHz，為 Wi-Fi 6E 最大通道寬度的兩倍',
          '4096-QAM（4K-QAM）調變，訊號良好時速率較 1024-QAM 提升約 20%',
          '多鏈路運作（MLO）：裝置可同時透過多個頻段連線，降低延遲並提升穩定度',
          'Multi-RU 與前導碼打孔（preamble puncturing）：通道部分受干擾時，仍可使用其餘乾淨的部分',
        ]),
        h('對企業的效益'),
        p(
          '效益最明顯的是高密度使用區域，例如會議室、禮堂與大量行動裝置的生產區，以及對延遲敏感的應用，例如視訊會議、擴增實境或廠內無人搬運車。理論最高速率雖然很高，實際傳輸量仍取決於終端裝置、使用人數與安裝環境。',
        ),
        h('升級前的準備'),
        ul([
          '確認部署國家對 6 GHz 頻段的法規，因為 320 MHz 通道只存在於此頻段',
          '確認交換器具備多重 Gigabit 埠（2.5/5/10 GbE），並有足夠的 PoE 供電預算給無線基地台',
          '檢視終端裝置：只有支援 Wi-Fi 7 的裝置才能使用新功能',
          '使用 WPA3，這是在 6 GHz 頻段運作的必要條件',
          '重新進行無線勘測，而不是把新基地台裝在舊位置',
        ]),
        p(
          '對許多辦公室而言，Wi-Fi 6/6E 仍足以應付目前需求；Wi-Fi 7 最適合新建、擴建或現有網路已經超載的情況。歡迎聯繫 Realtek 安排現場勘測並提供合適的規劃建議。',
        ),
      ],
    ),
  },
  {
    slug: 'data-center-cooling-tips',
    featuredImage: photo('whiteboard'),
    category: 'technology',
    title: {
      vi: 'Giải pháp làm mát phòng máy chủ tiết kiệm điện',
      en: 'Energy-efficient server room cooling',
      zh: '節能機房冷卻方案',
    },
    excerpt: {
      vi: 'Làm mát thường là hạng mục tốn điện nhất của phòng máy chủ sau chính thiết bị IT. Một vài thay đổi về bố trí và vận hành có thể giảm chi phí mà không làm tăng rủi ro.',
      en: 'Cooling is often the largest power draw in a server room after the IT equipment itself. A few changes to layout and operation can cut costs without adding risk.',
      zh: '冷卻通常是機房中僅次於 IT 設備本身的最大耗電項目。調整配置與維運方式，就能在不增加風險的前提下降低成本。',
    },
    content: rich(
      [
        p(
          'Trong phòng máy chủ, hệ thống làm mát thường là hạng mục tiêu thụ điện lớn nhất sau chính thiết bị IT. Nhiều phòng máy đang được làm lạnh quá mức hoặc để khí nóng và khí lạnh trộn lẫn, khiến điều hòa phải chạy nhiều hơn cần thiết.',
        ),
        h('Tổ chức luồng khí'),
        ul([
          'Bố trí tủ rack theo lối nóng – lối lạnh: mặt trước các hàng tủ quay vào nhau',
          'Lắp tấm che (blanking panel) ở các khe U còn trống để khí nóng không quay lại mặt trước',
          'Bịt kín lỗ luồn cáp trên sàn nâng và vách tủ',
          'Cân nhắc quây kín lối nóng hoặc lối lạnh (containment) khi mật độ công suất tăng',
        ]),
        h('Đặt nhiệt độ hợp lý'),
        p(
          'Khuyến nghị của ASHRAE cho thiết bị IT là nhiệt độ khí cấp vào mặt trước máy chủ trong khoảng 18–27 °C. Nhiều phòng máy vẫn đặt điều hòa ở 18–20 °C theo thói quen; nâng dần điểm đặt trong giới hạn khuyến nghị, đồng thời theo dõi nhiệt độ tại mặt hút gió của thiết bị, giúp giảm đáng kể điện năng làm mát.',
        ),
        h('Giám sát và bảo trì'),
        ul([
          'Đặt cảm biến nhiệt độ, độ ẩm ở mặt trước tủ rack, không chỉ ở cửa gió điều hòa',
          'Theo dõi chỉ số PUE (tổng điện năng của phòng máy chia cho điện năng của thiết bị IT) để đo hiệu quả',
          'Vệ sinh lưới lọc, dàn trao đổi nhiệt và kiểm tra môi chất lạnh định kỳ',
          'Với tủ mật độ cao, cân nhắc điều hòa làm mát theo hàng (in-row) đặt sát nguồn nhiệt',
        ]),
        p(
          'Realtek thiết kế và triển khai phòng máy mô-đun, tủ rack, UPS, điều hòa và hệ thống giám sát môi trường. Liên hệ với chúng tôi để được đánh giá hiện trạng phòng máy của bạn.',
        ),
      ],
      [
        p(
          'In a server room, cooling is often the largest power draw after the IT equipment itself. Many rooms are overcooled or let hot and cold air mix, so the air conditioners run harder than they need to.',
        ),
        h('Manage the airflow'),
        ul([
          'Arrange racks in hot aisles and cold aisles, with the fronts of facing rows turned toward each other',
          'Fit blanking panels in empty rack units so hot exhaust air cannot recirculate to the front',
          'Seal cable openings in the raised floor and rack sides',
          'Consider hot-aisle or cold-aisle containment as power density grows',
        ]),
        h('Set sensible temperatures'),
        p(
          'ASHRAE recommends an inlet air temperature of 18–27 °C at the front of IT equipment. Many rooms still run their air conditioners at 18–20 °C out of habit; raising the set point step by step within the recommended range, while watching temperatures at the equipment inlets, can noticeably reduce cooling energy.',
        ),
        h('Monitor and maintain'),
        ul([
          'Place temperature and humidity sensors at the front of the racks, not only at the air-conditioner vents',
          'Track PUE (total facility power divided by IT equipment power) to measure efficiency',
          'Clean filters and heat-exchanger coils and check the refrigerant regularly',
          'For high-density racks, consider in-row cooling units placed close to the heat source',
        ]),
        p(
          'Realtek designs and delivers modular server rooms, racks, UPS, cooling and environmental monitoring systems. Contact us for an assessment of your server room.',
        ),
      ],
      [
        p(
          '在機房中，冷卻系統通常是僅次於 IT 設備本身的最大耗電項目。許多機房冷卻過度，或讓冷熱空氣混合，導致空調運轉超出實際需要。',
        ),
        h('規劃氣流'),
        ul([
          '機櫃採冷熱通道配置：相鄰兩排機櫃的正面相對',
          '在空的 U 位安裝盲板，避免熱排氣回流到機櫃正面',
          '封堵架高地板與機櫃側板上的走線開孔',
          '功率密度提高時，考慮採用熱通道或冷通道封閉',
        ]),
        h('設定合理溫度'),
        p(
          'ASHRAE 對 IT 設備建議的進風溫度為 18–27 °C。許多機房仍習慣將空調設定在 18–20 °C；在建議範圍內逐步調高設定溫度，同時監看設備進風口的溫度，即可明顯降低冷卻耗電。',
        ),
        h('監控與維護'),
        ul([
          '在機櫃正面設置溫溼度感測器，而不只是在空調出風口',
          '追蹤 PUE（機房總耗電量除以 IT 設備耗電量）以衡量能源效率',
          '定期清潔濾網與熱交換盤管，並檢查冷媒',
          '高密度機櫃可考慮貼近熱源的列間空調',
        ]),
        p('Realtek 提供模組化機房、機櫃、UPS、空調與環境監控系統的規劃與建置。歡迎與我們聯繫，評估您的機房現況。'),
      ],
    ),
  },
  {
    slug: 'network-security-checklist',
    featuredImage: photo('analyst'),
    category: 'technology',
    title: {
      vi: 'Danh sách kiểm tra bảo mật mạng cho văn phòng',
      en: 'A network security checklist for offices',
      zh: '辦公室網路安全檢查清單',
    },
    excerpt: {
      vi: 'Các hạng mục cơ bản giúp văn phòng giảm rủi ro an ninh mạng: mật khẩu thiết bị, cập nhật phần mềm, phân vùng mạng, sao lưu và đào tạo nhân viên.',
      en: 'The basics that lower an office’s cybersecurity risk: device passwords, software updates, network segmentation, backups and staff training.',
      zh: '降低辦公室資安風險的基本項目：設備密碼、軟體更新、網路分段、備份與員工教育訓練。',
    },
    content: rich(
      [
        p(
          'Nhiều sự cố an ninh mạng ở văn phòng bắt nguồn từ những thiếu sót cơ bản: mật khẩu mặc định, phần mềm chưa cập nhật, mạng không phân vùng hoặc không có bản sao lưu dùng được. Danh sách dưới đây giúp bạn tự rà soát nhanh.',
        ),
        h('Thiết bị và tài khoản'),
        ul([
          'Lập danh sách toàn bộ thiết bị kết nối mạng: máy tính, máy chủ, switch, điểm truy cập Wi-Fi, camera, máy in',
          'Đổi mật khẩu mặc định của mọi thiết bị mạng và vô hiệu hóa các tài khoản không còn sử dụng',
          'Bật xác thực đa yếu tố (MFA) cho email, VPN và tài khoản quản trị',
          'Cập nhật firmware, hệ điều hành và phần mềm định kỳ; thay thế thiết bị đã hết hỗ trợ',
        ]),
        h('Mạng và dữ liệu'),
        ul([
          'Tách mạng khách, camera và thiết bị IoT khỏi mạng nội bộ bằng VLAN và chính sách tường lửa',
          'Chỉ mở những cổng và dịch vụ thật sự cần thiết; rà soát quy tắc tường lửa định kỳ',
          'Dùng WPA3 hoặc WPA2-Enterprise cho Wi-Fi nội bộ',
          'Sao lưu theo nguyên tắc 3-2-1 (ba bản, hai loại phương tiện lưu trữ, một bản ở nơi khác) và thử khôi phục định kỳ',
        ]),
        h('Con người và quy trình'),
        ul([
          'Đào tạo nhân viên nhận biết email lừa đảo và biết cách báo cáo sự cố',
          'Lưu nhật ký của tường lửa, máy chủ và theo dõi các cảnh báo',
          'Chuẩn bị sẵn quy trình xử lý sự cố: liên hệ ai, cô lập thiết bị thế nào, khôi phục từ bản sao lưu nào',
        ]),
        p(
          'Realtek cung cấp giải pháp an ninh mạng và dịch vụ quản trị hệ thống IT (MSP) cho doanh nghiệp. Liên hệ với chúng tôi nếu bạn cần đánh giá hiện trạng hệ thống.',
        ),
      ],
      [
        p(
          'Many office security incidents start with basic gaps: default passwords, unpatched software, a flat network or no usable backup. The checklist below helps you run a quick self-review.',
        ),
        h('Devices and accounts'),
        ul([
          'Keep an inventory of every networked device: computers, servers, switches, Wi-Fi access points, cameras, printers',
          'Change the default password of every network device and disable accounts that are no longer used',
          'Turn on multi-factor authentication (MFA) for email, VPN and administrator accounts',
          'Update firmware, operating systems and software regularly; replace devices that are out of support',
        ]),
        h('Network and data'),
        ul([
          'Separate guest, camera and IoT networks from the internal network with VLANs and firewall policies',
          'Open only the ports and services you really need; review firewall rules regularly',
          'Use WPA3 or WPA2-Enterprise for the internal Wi-Fi',
          'Follow the 3-2-1 backup rule (three copies, two types of storage media, one copy off-site) and test restores regularly',
        ]),
        h('People and processes'),
        ul([
          'Train staff to recognize phishing emails and to report incidents',
          'Keep firewall and server logs and watch for alerts',
          'Prepare an incident response procedure: who to call, how to isolate devices, which backup to restore from',
        ]),
        p(
          'Realtek provides network security solutions and managed IT services (MSP) for businesses. Contact us if you need an assessment of your systems.',
        ),
      ],
      [
        p(
          '許多辦公室資安事件都源於基本疏漏：預設密碼、未更新的軟體、未分段的網路，或沒有可用的備份。以下清單可協助您快速自我檢查。',
        ),
        h('設備與帳號'),
        ul([
          '盤點所有連網設備：電腦、伺服器、交換器、無線基地台、攝影機、印表機',
          '變更所有網路設備的預設密碼，並停用不再使用的帳號',
          '為電子郵件、VPN 與管理員帳號啟用多因素驗證（MFA）',
          '定期更新韌體、作業系統與軟體；汰換已停止支援的設備',
        ]),
        h('網路與資料'),
        ul([
          '以 VLAN 與防火牆政策將訪客網路、攝影機與 IoT 裝置和內部網路隔離',
          '只開放真正需要的連接埠與服務；定期檢視防火牆規則',
          '內部 Wi-Fi 使用 WPA3 或 WPA2-Enterprise',
          '遵循 3-2-1 備份原則（三份資料、兩種儲存媒體、一份異地保存），並定期測試還原',
        ]),
        h('人員與流程'),
        ul([
          '對員工進行教育訓練，辨識釣魚郵件並知道如何通報事件',
          '保存防火牆與伺服器的日誌，並留意告警',
          '事先制定事件應變流程：聯絡誰、如何隔離設備、從哪一份備份還原',
        ]),
        p('Realtek 為企業提供網路資安解決方案與 IT 委外維運服務（MSP）。如需評估系統現況，歡迎與我們聯繫。'),
      ],
    ),
  },
  {
    slug: 'realtek-becomes-joint-stock-company',
    featuredImage: photo('womenTeam'),
    category: 'company-news',
    date: '2024-07-08T08:00:00.000Z', // business registration certificate: 3rd amendment, 08/07/2024
    title: {
      vi: 'Realtek chuyển đổi thành công ty cổ phần',
      en: 'Realtek becomes a joint stock company',
      zh: 'Realtek 改制為股份有限公司',
    },
    excerpt: {
      vi: 'Từ tháng 7/2024, Công ty TNHH Tin học Viễn thông Realtek chuyển đổi thành Công ty Cổ phần Tin học Viễn thông Realtek (REALTEK JSC), giữ nguyên mã số doanh nghiệp 0314140632.',
      en: 'In July 2024, Realtek Informatics Telecom Co., Ltd. was converted into Realtek Informatics Telecom Joint Stock Company (REALTEK JSC), keeping enterprise code 0314140632.',
      zh: '2024 年 7 月，Realtek 越南公司由有限責任公司改制為股份有限公司（REALTEK JSC），企業代碼 0314140632 維持不變。',
    },
    content: rich(
      [
        p(
          'Từ tháng 7/2024, Công ty TNHH Tin học Viễn thông Realtek chính thức chuyển đổi loại hình doanh nghiệp thành Công ty Cổ phần Tin học Viễn thông Realtek, tên tiếng Anh Realtek Informatics Telecom Joint Stock Company, tên viết tắt REALTEK JSC.',
        ),
        h('Thông tin doanh nghiệp'),
        ul([
          'Tên công ty: Công ty Cổ phần Tin học Viễn thông Realtek',
          'Tên viết tắt: REALTEK JSC',
          'Mã số doanh nghiệp: 0314140632, đăng ký lần đầu ngày 02/12/2016',
          'Trụ sở chính: Tòa nhà Vincom Center, 72 Lê Thánh Tôn, TP. Hồ Chí Minh',
        ]),
        h('Ý nghĩa đối với khách hàng và đối tác'),
        p(
          'Mã số doanh nghiệp được giữ nguyên. Theo quy định của pháp luật Việt Nam, công ty sau chuyển đổi kế thừa toàn bộ quyền, nghĩa vụ và hợp đồng của công ty trước chuyển đổi, vì vậy các hợp đồng, bảo hành và cam kết dịch vụ hiện có tiếp tục được thực hiện. Khách hàng chỉ cần dùng tên công ty mới trên hóa đơn và hợp đồng phát sinh sau thời điểm chuyển đổi.',
        ),
        h('Chặng đường phát triển'),
        ul([
          '2001: thành lập SunNet Telecom tại Đài Loan',
          '2011: thành lập Kunshan Ruihong Infocomm Technology tại Côn Sơn, Trung Quốc',
          '2016: thành lập công ty tại TP. Hồ Chí Minh, trung tâm phục vụ khách hàng ASEAN',
          '2019 và 2020: mở văn phòng đại diện tại Hà Nội và Hải Phòng',
          '2023: thành lập công ty tại Thái Lan',
          '2024: chuyển đổi thành công ty cổ phần',
        ]),
        p(
          'Realtek tiếp tục tư vấn, thiết kế, nhập khẩu, cung cấp, lắp đặt và bảo trì hệ thống công nghệ thông tin và điện nhẹ cho khách hàng tại Việt Nam và khu vực.',
        ),
      ],
      [
        p(
          'In July 2024, Realtek Informatics Telecom Co., Ltd. was officially converted into a joint stock company: Công ty Cổ phần Tin học Viễn thông Realtek, in English Realtek Informatics Telecom Joint Stock Company, abbreviated REALTEK JSC.',
        ),
        h('Company details'),
        ul([
          'Company name: Realtek Informatics Telecom Joint Stock Company',
          'Abbreviation: REALTEK JSC',
          'Enterprise code: 0314140632, first registered on 2 December 2016',
          'Head office: Vincom Center, 72 Le Thanh Ton Street, Ho Chi Minh City',
        ]),
        h('What it means for customers and partners'),
        p(
          'The enterprise code stays the same. Under Vietnamese law, the converted company inherits all rights, obligations and contracts of the company before conversion, so existing contracts, warranties and service commitments continue as before. Customers only need to use the new company name on invoices and contracts issued after the conversion.',
        ),
        h('Our journey'),
        ul([
          '2001: SunNet Telecom founded in Taiwan',
          '2011: Kunshan Ruihong Infocomm Technology founded in Kunshan, China',
          '2016: company established in Ho Chi Minh City as the hub for ASEAN clients',
          '2019 and 2020: representative offices opened in Hanoi and Hai Phong',
          '2023: company established in Thailand',
          '2024: converted into a joint stock company',
        ]),
        p(
          'Realtek continues to consult on, design, import, supply, install and maintain IT and ELV systems for customers in Vietnam and the region.',
        ),
      ],
      [
        p(
          '自 2024 年 7 月起，Realtek 越南公司正式由有限責任公司改制為股份有限公司，越南文名稱為 Công ty Cổ phần Tin học Viễn thông Realtek，英文名稱為 Realtek Informatics Telecom Joint Stock Company，簡稱 REALTEK JSC。',
        ),
        h('公司資料'),
        ul([
          '公司名稱：Realtek Informatics Telecom Joint Stock Company',
          '簡稱：REALTEK JSC',
          '企業代碼：0314140632，2016 年 12 月 2 日首次登記',
          '總公司：胡志明市黎聖宗街 72 號 Vincom Center',
        ]),
        h('對客戶與合作夥伴的意義'),
        p(
          '企業代碼維持不變。依越南法律規定，改制後的公司承接改制前公司的全部權利、義務與合約，因此現有合約、保固與服務承諾均照常履行。客戶僅需在改制後開立的發票與簽訂的合約上使用新的公司名稱。',
        ),
        h('發展歷程'),
        ul([
          '2001 年：SunNet Telecom 於臺灣成立',
          '2011 年：昆山睿宏網訊科技有限公司於中國昆山成立',
          '2016 年：於胡志明市成立公司，作為服務東協客戶的中心',
          '2019 與 2020 年：先後成立河內與海防代表處',
          '2023 年：於泰國成立公司',
          '2024 年：改制為股份有限公司',
        ]),
        p('Realtek 將持續為越南及區域客戶提供資訊與弱電系統的顧問、設計、進口、供應、安裝與維護服務。'),
      ],
    ),
  },
  {
    slug: 'realtek-iso-9001-2015-certification',
    featuredImage: photo('teamGroup'),
    category: 'company-news',
    date: '2024-09-17T08:00:00.000Z', // issue date on the ISOCERT certificate
    title: {
      vi: 'Realtek đạt chứng nhận ISO 9001:2015',
      en: 'Realtek achieves ISO 9001:2015 certification',
      zh: 'Realtek 取得 ISO 9001:2015 認證',
    },
    excerpt: {
      vi: 'Ngày 17/09/2024, hệ thống quản lý chất lượng của Realtek được ISOCERT chứng nhận phù hợp tiêu chuẩn ISO 9001:2015, hiệu lực đến 16/09/2027.',
      en: 'On 17 September 2024, ISOCERT certified Realtek’s quality management system to ISO 9001:2015; the certificate is valid until 16 September 2027.',
      zh: '2024 年 9 月 17 日，Realtek 的品質管理系統通過 ISOCERT 驗證，符合 ISO 9001:2015 標準，證書有效期至 2027 年 9 月 16 日。',
    },
    content: rich(
      [
        p(
          'Ngày 17/09/2024, Công ty Cổ phần Tin học Viễn thông Realtek được tổ chức chứng nhận ISOCERT cấp giấy chứng nhận hệ thống quản lý chất lượng phù hợp tiêu chuẩn ISO 9001:2015. Giấy chứng nhận có hiệu lực đến ngày 16/09/2027.',
        ),
        h('Phạm vi chứng nhận'),
        p(
          'Tư vấn, thiết kế, nhập khẩu, kinh doanh, lắp đặt và bảo trì hệ thống công nghệ thông tin và hệ thống điện nhẹ, tức toàn bộ chuỗi công việc Realtek thực hiện cho khách hàng, từ khảo sát nhu cầu đến bảo trì sau bàn giao.',
        ),
        h('ISO 9001:2015 là gì'),
        p(
          'ISO 9001 là tiêu chuẩn quốc tế về hệ thống quản lý chất lượng do Tổ chức Tiêu chuẩn hóa Quốc tế (ISO) ban hành. Phiên bản 2015 yêu cầu doanh nghiệp quản lý theo quá trình, tư duy dựa trên rủi ro, lấy khách hàng làm trọng tâm và cải tiến liên tục.',
        ),
        h('Ý nghĩa đối với khách hàng'),
        ul([
          'Quy trình thống nhất cho từng giai đoạn: tư vấn, thiết kế, cung cấp thiết bị, thi công, bàn giao và bảo trì',
          'Trách nhiệm rõ ràng và hồ sơ đầy đủ cho mỗi dự án',
          'Ý kiến phản hồi của khách hàng được ghi nhận, xử lý và dùng để cải tiến',
          'Hệ thống được đánh giá giám sát định kỳ trong thời hạn hiệu lực của chứng nhận',
        ]),
      ],
      [
        p(
          'On 17 September 2024, Realtek Informatics Telecom JSC was granted a certificate by the certification body ISOCERT confirming that its quality management system conforms to ISO 9001:2015. The certificate is valid until 16 September 2027.',
        ),
        h('Scope of certification'),
        p(
          'Consulting, designing, importing, trading, installing and maintaining information technology and low-voltage (ELV) electrical systems: the full range of work Realtek carries out for customers, from assessing needs to maintenance after handover.',
        ),
        h('What ISO 9001:2015 is'),
        p(
          'ISO 9001 is the international standard for quality management systems published by the International Organization for Standardization (ISO). The 2015 edition requires a process approach, risk-based thinking, a focus on customers and continual improvement.',
        ),
        h('What it means for customers'),
        ul([
          'Consistent processes for every stage: consulting, design, equipment supply, installation, handover and maintenance',
          'Clear responsibilities and complete records for each project',
          'Customer feedback is recorded, acted on and used for improvement',
          'The system is checked in regular surveillance audits while the certificate is valid',
        ]),
      ],
      [
        p(
          '2024 年 9 月 17 日，Realtek Informatics Telecom JSC 獲驗證機構 ISOCERT 頒發證書，確認其品質管理系統符合 ISO 9001:2015 標準。證書有效期至 2027 年 9 月 16 日。',
        ),
        h('驗證範圍'),
        p(
          '資訊系統與弱電系統的顧問、設計、進口、銷售、安裝與維護，涵蓋 Realtek 為客戶執行的完整工作流程，從需求評估到交付後的維護。',
        ),
        h('什麼是 ISO 9001:2015'),
        p(
          'ISO 9001 是國際標準化組織（ISO）發布的品質管理系統國際標準。2015 年版要求企業採用流程導向、以風險為基礎的思維、以客戶為中心，並持續改善。',
        ),
        h('對客戶的意義'),
        ul([
          '每個階段都有一致的流程：顧問、設計、設備供應、施工、交付與維護',
          '每個專案都有明確的權責與完整的紀錄',
          '客戶意見會被記錄、處理並用於改善',
          '證書有效期間內，系統會定期接受監督稽核',
        ]),
      ],
    ),
  },
].map((post, i) => ({ ...post, daysAgo: i * 9 }))

/* ---------- Documents ----------
   The company's two real documents (files in docs/; size unknown, so no `fileSize`). */

export const documents = [
  {
    slug: 'realtek-company-profile',
    category: 'company-profile',
    coverImage: photo('skylineHcmc'),
    fileFormat: 'docx',
    pageCount: 28,
    provider: 'gdrive',
    title: {
      vi: 'Hồ sơ năng lực Realtek Telecom',
      en: 'Realtek Telecom company profile',
      zh: 'Realtek Telecom 公司簡介',
    },
    summary: {
      vi: 'Hồ sơ năng lực song ngữ Việt – Anh (28 trang) của Công ty Cổ phần Tin học Viễn thông Realtek: thông tin công ty, lịch sử hình thành, dịch vụ, cơ sở pháp lý và chứng chỉ, năng lực nhân sự, đối tác và dự án tiêu biểu.',
      en: 'The 28-page bilingual Vietnamese–English profile of Realtek Informatics Telecom JSC: company information, history, services, legal basis and certificates, human capital, featured partners and projects.',
      zh: 'Realtek Informatics Telecom JSC 的越南文與英文雙語公司簡介（共 28 頁）：公司資料、發展歷程、服務項目、法律依據與證書、人力資源、代表合作夥伴與專案。',
    },
    content: rich(
      [
        p(
          'Hồ sơ năng lực chính thức của Công ty Cổ phần Tin học Viễn thông Realtek (REALTEK JSC), trình bày song ngữ tiếng Việt và tiếng Anh, dùng để giới thiệu công ty khi tham gia dự án và hồ sơ mời thầu.',
        ),
        h('Nội dung chính'),
        ul([
          'Thư ngỏ, thông tin công ty và lịch sử hình thành từ năm 2001',
          'Dịch vụ của chúng tôi; tầm nhìn, sứ mệnh và giá trị cốt lõi',
          'Mạng lưới hoạt động và các dòng sản phẩm chính',
          'Cơ sở pháp lý, chứng chỉ của công ty và của đội ngũ kỹ thuật; sơ đồ tổ chức và năng lực nhân sự',
          'Đối tác tiêu biểu và dự án tiêu biểu kèm hình ảnh',
        ]),
        h('Dành cho'),
        p(
          'Khách hàng, chủ đầu tư, nhà thầu chính và bộ phận mua hàng cần đánh giá năng lực nhà cung cấp trước khi hợp tác.',
        ),
      ],
      [
        p(
          'The official profile of Realtek Informatics Telecom JSC (REALTEK JSC), written in Vietnamese and English, used to introduce the company for projects and tender submissions.',
        ),
        h('Contents'),
        ul([
          'Open letter, company information and history since 2001',
          'Our services; vision, mission and core values',
          'Operating network and main product lines',
          'Legal basis, company and engineer certificates; organization chart and human capital',
          'Featured partners and featured projects with photos',
        ]),
        h('Intended for'),
        p(
          'Customers, project owners, main contractors and purchasing teams who need to assess a supplier’s capabilities before working together.',
        ),
      ],
      [
        p(
          'Realtek Informatics Telecom JSC（REALTEK JSC）的正式公司簡介，採越南文與英文雙語編寫，用於專案洽談與投標文件中介紹公司。',
        ),
        h('內容'),
        ul([
          '致客戶的一封信、公司資料與 2001 年以來的發展歷程',
          '服務項目；願景、使命與核心價值',
          '營運據點與主要產品線',
          '法律依據、公司與技術人員證照；組織架構與人力資源',
          '代表合作夥伴與代表專案（附照片）',
        ]),
        h('適用對象'),
        p('在合作前需要評估供應商能力的客戶、業主、總承包商與採購部門。'),
      ],
    ),
    keywords: {
      vi: 'hồ sơ năng lực, giới thiệu công ty, REALTEK JSC, chứng chỉ, dự án tiêu biểu',
      en: 'company profile, capability statement, REALTEK JSC, certificates, projects',
      zh: '公司簡介, 公司介紹, 能力, 證書, 專案',
    },
  },
  {
    slug: 'realtek-company-introduction-2026-zh',
    category: 'company-profile',
    coverImage: photo('earth'),
    fileFormat: 'pptx',
    pageCount: 14,
    provider: 'gdrive',
    title: {
      vi: 'Giới thiệu công ty Realtek 2026 (tiếng Trung)',
      en: 'Realtek company introduction 2026 (Chinese)',
      zh: 'RealTek 公司介紹 2026',
    },
    summary: {
      vi: 'Bộ slide giới thiệu công ty bằng tiếng Trung phồn thể (14 slide): văn phòng và lịch sử, phạm vi dịch vụ, khu công nghiệp thông minh, kiến trúc mạng, chứng nhận, thương hiệu phân phối và dự án tại Trung Quốc, Việt Nam, Thái Lan.',
      en: 'The 14-slide company introduction in Traditional Chinese: offices and history, service scope, smart campus, network architecture, certifications, distributed brands and case studies in China, Vietnam and Thailand.',
      zh: '繁體中文公司介紹簡報（共 14 頁）：據點與沿革、服務範圍、智慧園區、網路架構、認證資質、代理品牌，以及中國大陸、越南、泰國的客戶案例。',
    },
    content: rich(
      [
        p(
          'Bộ slide giới thiệu Realtek bằng tiếng Trung phồn thể, dùng khi làm việc với khách hàng và đối tác nói tiếng Trung.',
        ),
        h('Nội dung chính'),
        ul([
          'Văn phòng tại Đài Loan, Trung Quốc, Việt Nam, Thái Lan và lịch sử phát triển',
          'Phạm vi dịch vụ: hạ tầng IT, khu công nghiệp thông minh (điện nhẹ), phần mềm và dịch vụ thuê ngoài',
          'Các thành phần của khu công nghiệp thông minh; kiến trúc mạng và tích hợp ứng dụng',
          'Chứng nhận, tư cách đối tác và các thương hiệu phân phối',
          'Ngành khách hàng và dự án tiêu biểu tại Trung Quốc, Việt Nam, Thái Lan',
        ]),
        h('Dành cho'),
        p('Khách hàng, chủ đầu tư và đối tác đọc tiếng Trung muốn tìm hiểu nhanh năng lực của Realtek.'),
      ],
      [
        p(
          'Realtek’s company introduction deck in Traditional Chinese, used with Chinese-speaking customers and partners.',
        ),
        h('Contents'),
        ul([
          'Offices in Taiwan, China, Vietnam and Thailand, and company history',
          'Service scope: IT infrastructure, smart campus (ELV), software and outsourcing services',
          'Smart-campus elements; network architecture and application integration',
          'Certifications, partner status and distributed brands',
          'Client industries and case studies in China, Vietnam and Thailand',
        ]),
        h('Intended for'),
        p(
          'Chinese-reading customers, project owners and partners who want a quick overview of Realtek’s capabilities.',
        ),
      ],
      [
        p('Realtek 的繁體中文公司介紹簡報，適用於與華語客戶及合作夥伴洽談。'),
        h('內容'),
        ul([
          '臺灣、中國大陸、越南、泰國據點與發展沿革',
          '服務範圍：IT 基礎架構、智慧園區（弱電工程）、軟體與委外服務',
          '智慧園區元素；網路架構與應用整合',
          '相關認證、合作夥伴資格與代理品牌',
          '客戶產業分布，以及中國大陸、越南、泰國的客戶案例',
        ]),
        h('適用對象'),
        p('希望快速了解 Realtek 能力的華語客戶、業主與合作夥伴。'),
      ],
    ),
    keywords: {
      vi: 'giới thiệu công ty, tiếng Trung, hồ sơ năng lực, khu công nghiệp thông minh, dự án',
      en: 'company introduction, Chinese, company profile, smart campus, case studies',
      zh: '公司介紹, 簡報, 智慧園區, 客戶案例, 代理品牌',
    },
  },
].map((d, i) => ({
  ...d,
  provider: d.provider as 'gdrive' | 'onedrive',
  fileFormat: d.fileFormat as 'pdf' | 'docx' | 'xlsx' | 'pptx',
  downloadCount: 0,
  daysAgo: i * 5,
  // Placeholder links: the real files are not uploaded yet; replace with their public share links.
  externalUrl: d.provider === 'gdrive' ? 'https://drive.google.com/drive/my-drive' : 'https://onedrive.live.com/',
}))

/* ---------- Sliders ---------- */

type Slide = { image: PhotoRef; eyebrow?: L; heading?: L; text?: L; button?: { label: L; url: string } }

export const sliders: { placement: 'home' | 'about' | 'documents'; name: string; slides: Slide[] }[] = [
  {
    placement: 'home',
    name: 'Trang chủ',
    slides: [
      {
        image: photo('earth'), // unchanged
        eyebrow: {
          vi: 'Realtek Informatics Telecom',
          en: 'Realtek Informatics Telecom',
          zh: 'Realtek Informatics Telecom',
        },
        heading: {
          vi: 'Tích hợp hệ thống ICT cho doanh nghiệp',
          en: 'ICT system integration for business',
          zh: '企業 ICT 系統整合',
        },
        text: {
          vi: 'Tư vấn, thiết kế, cung cấp, lắp đặt và bảo trì hệ thống công nghệ thông tin và điện nhẹ — lấy Việt Nam làm trung tâm phục vụ khách hàng ASEAN.',
          en: 'Consulting, design, supply, installation and maintenance of IT and ELV systems — from our Vietnam hub to clients across ASEAN.',
          zh: '資訊與弱電系統的顧問、設計、供應、安裝與維護——以越南為中心，服務東協各地客戶。',
        },
        button: { label: { vi: 'Khám phá dịch vụ', en: 'Explore services', zh: '服務項目' }, url: '/services' },
      },
      {
        image: photo('facilityEngineer'), // unchanged
        eyebrow: { vi: 'Nhà máy & trung tâm thương mại', en: 'Plants & shopping malls', zh: '工廠與購物中心' },
        heading: {
          vi: 'Từ phòng máy đến khu công nghiệp thông minh',
          en: 'From server room to smart campus',
          zh: '從機房到智慧園區',
        },
        text: {
          vi: 'Phòng máy, UPS, cáp cấu trúc, mạng, tổng đài và camera an ninh cho Compal, Cymmetrik, MOWI, AEON và nhiều doanh nghiệp khác.',
          en: 'Server rooms, UPS, cabling, networks, telephony and security for Compal, Cymmetrik, MOWI, AEON and many more.',
          zh: '為仁寶、正美科技、美威、AEON 永旺等企業建置機房、UPS、佈線、網路、電話與安防系統。',
        },
        button: { label: { vi: 'Xem dự án', en: 'View projects', zh: '查看案例' }, url: '/projects' },
      },
      {
        image: photo('skylineHcmc'), // unchanged
        eyebrow: { vi: 'Mạng lưới khu vực', en: 'Regional network', zh: '區域據點' },
        heading: {
          vi: 'Trụ sở tại TP. Hồ Chí Minh, phục vụ khắp ASEAN',
          en: 'Headquartered in Ho Chi Minh City, serving ASEAN',
          zh: '總部位於胡志明市，服務東協',
        },
        text: {
          vi: 'Văn phòng tại TP. Hồ Chí Minh, Hà Nội, Hải Phòng, Thái Lan và Côn Sơn (Trung Quốc).',
          en: 'Offices in Ho Chi Minh City, Hanoi, Hai Phong, Thailand and Kunshan (China).',
          zh: '據點遍及胡志明市、河內、海防、泰國與昆山。',
        },
        // Alternative if the document library must stay promoted: keep the old slide-3 purpose with
        // heading "Hồ sơ năng lực Realtek" / "Realtek company profile" / "Realtek 公司簡介", url '/documents'.
        button: { label: { vi: 'Liên hệ', en: 'Contact us', zh: '聯絡我們' }, url: '/contact' },
      },
    ],
  },
  { placement: 'about', name: 'Giới thiệu', slides: [{ image: photo('meeting') }, { image: photo('teamTable') }] },
  {
    placement: 'documents',
    name: 'Tài liệu',
    slides: [{ image: photo('womanMonitors') }, { image: photo('analyst') }],
  },
]

/* ---------- Partners ----------
   Logos are PNG files in public/content/partners, cropped from the company profile and the Chinese deck
   (`partnerLogos` lists every file with its width/height). Partners are matched by name when updating the database. */

export const partnerLogos = {
  acer: [140, 65],
  aeon: [398, 123],
  'alcatel-lucent': [194, 53],
  aliyun: [600, 178],
  apc: [600, 302],
  aruba: [600, 216],
  asus: [447, 144],
  avaya: [201, 65],
  aver: [347, 112],
  aws: [600, 359],
  'bank-of-taiwan': [155, 45],
  'cal-comp': [119, 107],
  'cambium-networks': [134, 109],
  'cathay-united-bank': [241, 51],
  'check-point': [600, 269],
  'chi-hung': [281, 78],
  chicony: [459, 126],
  'chin-poon': [600, 91],
  cisco: [600, 318],
  citrix: [189, 75],
  commscope: [333, 138],
  compal: [600, 148],
  coretronic: [106, 34],
  cymmetrik: [182, 57],
  'dell-emc': [600, 106],
  dell: [154, 59],
  delta: [149, 54],
  deltapath: [600, 127],
  dintek: [455, 111],
  elastic: [498, 166],
  everich: [120, 72],
  f5: [73, 67],
  'fast-link-cabsys': [114, 106],
  fortinet: [271, 40],
  foxconn: [160, 101],
  'great-kingdom': [168, 104],
  h3c: [600, 150],
  hikvision: [208, 49],
  'hitachi-chemical': [202, 52],
  hpe: [169, 76],
  huawei: [84, 83],
  ibm: [202, 78],
  infortrend: [300, 49],
  'inventec-appliances': [150, 52],
  inventec: [106, 25],
  'ip-guard': [191, 51],
  iteq: [450, 201],
  'leo-paper-group': [156, 91],
  lilin: [179, 37],
  liteon: [174, 50],
  logitech: [140, 52],
  manageengine: [300, 52],
  'microsoft-azure': [600, 168],
  microsoft: [448, 105],
  'one-identity': [600, 105],
  openfind: [239, 60],
  otsuka: [172, 72],
  'palo-alto-networks': [600, 114],
  pegatron: [182, 40],
  'pou-chen': [122, 104],
  'progress-whatsup-gold': [381, 50],
  qnap: [183, 55],
  quest: [300, 84],
  ruckus: [129, 85],
  ruijie: [174, 55],
  sangfor: [415, 131],
  softnext: [183, 56],
  solarwinds: [600, 139],
  southco: [160, 36],
  symantec: [226, 67],
  toa: [154, 53],
  usi: [147, 65],
  veeam: [600, 116],
  vertiv: [555, 489],
  'vina-foods-kyoei': [126, 111],
  vmware: [600, 92],
  wistron: [600, 259],
  zkteco: [165, 47],
} satisfies Record<string, [number, number]>
export type PartnerLogoKey = keyof typeof partnerLogos

export type PartnerGroup = 'product' | 'partner'
export type PartnerEntry = { name: string; logo: PartnerLogoKey; group: PartnerGroup; url?: string }

/**
 * Home-page logo carousels, in the company profile's order: `product` = "Sản phẩm chính / Main products" (p.12),
 * `partner` = "Đối tác tiêu biểu / Featured partners" (p.23; two logos there are unidentified and left out).
 */
export const partners: PartnerEntry[] = [
  { name: 'Hikvision', logo: 'hikvision', group: 'product' },
  { name: 'LILIN', logo: 'lilin', group: 'product' },
  { name: 'Ruijie Networks', logo: 'ruijie', group: 'product' },
  { name: 'Avaya', logo: 'avaya', group: 'product' },
  { name: 'QNAP', logo: 'qnap', group: 'product' },
  { name: 'ASUS', logo: 'asus', group: 'product' },
  { name: 'Fortinet', logo: 'fortinet', group: 'product' },
  { name: 'Logitech', logo: 'logitech', group: 'product' },
  { name: 'Alcatel-Lucent', logo: 'alcatel-lucent', group: 'product' },
  { name: 'Dell', logo: 'dell', group: 'product' },
  { name: 'Cambium Networks', logo: 'cambium-networks', group: 'product' },
  { name: 'Cisco', logo: 'cisco', group: 'product' },
  { name: 'Hewlett Packard Enterprise', logo: 'hpe', group: 'product' },
  { name: 'ZKTeco', logo: 'zkteco', group: 'product' },
  { name: 'TOA', logo: 'toa', group: 'product' },
  { name: 'CommScope', logo: 'commscope', group: 'product' },
  { name: 'Fast Link Cabsys', logo: 'fast-link-cabsys', group: 'product' },
  { name: 'Delta', logo: 'delta', group: 'product' },
  { name: 'Ruckus Wireless', logo: 'ruckus', group: 'product' },
  { name: 'APC by Schneider Electric', logo: 'apc', group: 'product' },
  { name: 'Foxconn', logo: 'foxconn', group: 'partner' },
  { name: 'Pou Chen Group', logo: 'pou-chen', group: 'partner' },
  { name: 'Compal', logo: 'compal', group: 'partner' },
  { name: 'Acer', logo: 'acer', group: 'partner' },
  { name: 'Cal-Comp Electronics', logo: 'cal-comp', group: 'partner' },
  { name: 'Wistron', logo: 'wistron', group: 'partner' },
  { name: 'Delta Electronics', logo: 'delta', group: 'partner' },
  { name: 'USI', logo: 'usi', group: 'partner' },
  { name: 'AEON', logo: 'aeon', group: 'partner' },
  { name: 'PEGATRON', logo: 'pegatron', group: 'partner' },
  { name: 'LITEON', logo: 'liteon', group: 'partner' },
  { name: 'Cymmetrik', logo: 'cymmetrik', group: 'partner' },
  { name: 'Chi Hung Việt Nam', logo: 'chi-hung', group: 'partner' },
  { name: 'Great Kingdom', logo: 'great-kingdom', group: 'partner' },
  { name: 'Leo Paper Group', logo: 'leo-paper-group', group: 'partner' },
  { name: 'Otsuka', logo: 'otsuka', group: 'partner' },
  { name: 'Vina Foods Kyoei', logo: 'vina-foods-kyoei', group: 'partner' },
]

/** Name, website, group and logo file (path under public/, file name, size) of a partner entry. */
export function partnerInfo(entry: PartnerEntry) {
  const [width, height] = partnerLogos[entry.logo]
  const filename = `${entry.logo}.png`
  return { ...entry, src: `/content/partners/${filename}`, filename, width, height }
}

/* ---------- Globals ---------- */

// Registered head office (business registration + ISO certificate: "Lầu 15, Phòng 1508 … Phường Bến Nghé, Quận 1"),
// written with the ward name in force since 07/2025 (Bến Nghé merged into Phường Sài Gòn, districts abolished).
const address: L = {
  vi: 'Phòng 1508, Lầu 15, Tòa nhà Vincom Center, 72 Lê Thánh Tôn, Phường Sài Gòn, TP. Hồ Chí Minh',
  en: 'Room 1508, 15th Floor, Vincom Center, 72 Le Thanh Ton Street, Sai Gon Ward, Ho Chi Minh City, Vietnam',
  zh: '越南胡志明市西貢坊黎聖宗街 72 號 Vincom Center 15 樓 1508 室',
}

export const siteSettings = {
  companyName: {
    // Legal names on the business registration certificate (abbreviation: REALTEK JSC).
    vi: 'Công ty Cổ phần Tin học Viễn thông Realtek',
    en: 'Realtek Informatics Telecom Joint Stock Company',
    // The documents give no Chinese name; this rendering must be approved. Never 瑞昱 (Realtek Semiconductor).
    zh: 'Realtek 資訊電信股份有限公司',
  },
  shortName: 'Realtek Telecom',
  tagline: {
    vi: 'Tích hợp hệ thống ICT chuyên nghiệp',
    en: 'Professional ICT system integration',
    zh: '專業 ICT 系統整合',
  },
  description: {
    vi: 'Realtek tư vấn, thiết kế, cung cấp, lắp đặt và bảo trì hệ thống công nghệ thông tin và điện nhẹ cho doanh nghiệp tại Việt Nam và khu vực ASEAN.',
    en: 'Realtek consults on, designs, supplies, installs and maintains IT and ELV systems for businesses in Vietnam and across ASEAN.',
    zh: 'Realtek 為越南及東協企業提供資訊與弱電系統的顧問、設計、供應、安裝與維護服務。',
  },
  taxCode: '0314140632',
  address,
  hotline: '028 3830 2678',
  email: 'sales@realtektelecom.com', // service desk: vnservices@realtektelecom.com
  workingHours: null, // not stated in the company's documents
  mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Vincom Center, 72 Lê Thánh Tôn, TP. Hồ Chí Minh')}`,
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent('Vincom Center, 72 Lê Thánh Tôn, TP. Hồ Chí Minh')}&output=embed`,
  defaultMetaTitle: {
    vi: 'Realtek Telecom — Tích hợp hệ thống ICT & điện nhẹ',
    en: 'Realtek Telecom — ICT & ELV system integration',
    zh: 'Realtek — ICT 與弱電系統整合',
  },
  defaultMetaDescription: {
    vi: 'Công ty Cổ phần Tin học Viễn thông Realtek: hạ tầng mạng, trung tâm dữ liệu, tổng đài, an ninh mạng, điện nhẹ và dịch vụ MSP cho doanh nghiệp tại Việt Nam và ASEAN. Chứng nhận ISO 9001:2015.',
    en: 'Realtek Informatics Telecom JSC: networking, data centers, telephony, security, ELV systems and managed services for businesses in Vietnam and ASEAN. ISO 9001:2015 certified.',
    zh: 'Realtek 為越南及東協企業提供網路、資料中心、電話系統、資安、弱電工程與 MSP 維運服務，通過 ISO 9001:2015 認證。',
  },
  defaultOgImage: photo('earth'),
}

/* ---------- Home page ---------- */

export const homePage = {
  intro: {
    eyebrow: { vi: 'Về Realtek', en: 'About Realtek', zh: '關於 Realtek' },
    heading: {
      vi: 'Tích hợp hệ thống ICT cho doanh nghiệp tại Việt Nam và ASEAN',
      en: 'ICT system integration for businesses in Vietnam and ASEAN',
      zh: '服務越南與東協企業的 ICT 系統整合商',
    },
    text: {
      vi: 'Realtek tư vấn, thiết kế, cung cấp, lắp đặt và bảo trì hệ thống công nghệ thông tin và điện nhẹ — mạng, trung tâm dữ liệu, tổng đài, camera an ninh — cho nhà máy, ngân hàng, chuỗi bán lẻ và văn phòng. Đội ngũ sáng lập đã đồng hành cùng các tập đoàn điện tử như Compal, Wistron và LiteOn từ năm 2001.',
      en: 'Realtek consults on, designs, supplies, installs and maintains IT and ELV systems — networks, data centers, telephony and security — for factories, banks, retailers and offices. Our founding team has worked with electronics groups such as Compal, Wistron and LITEON since 2001.',
      zh: 'Realtek 為工廠、銀行、零售與辦公室提供資訊與弱電系統——網路、資料中心、電話與安防——的顧問、設計、供應、安裝與維護。創始團隊自 2001 年起即服務仁寶、緯創、光寶等電子集團。',
    },
    image: photo('meeting'),
    link: { label: { vi: 'Tìm hiểu thêm', en: 'Learn more', zh: '了解更多' }, url: '/about' },
    stats: [
      // 2026 − 2011 (Kunshan company founded, docx p.6 / pptx slide 2) = 15. Counting from SunNet Telecom (2001) would give 25 — not used, relation unclear.
      { value: 15, suffix: '+', label: { vi: 'Năm kinh nghiệm', en: 'Years of experience', zh: '年產業經驗' } },
      // pptx slide 8: 12 finance + 12 retail + 50+ traditional mfg + 13+ electronics + 4 groups + 7 semiconductor + 6 biotech = 104+
      // (excluding "合作 6"); the slide itself says "數百家企業" (hundreds). Rounded down to 100+.
      { value: 100, suffix: '+', label: { vi: 'Khách hàng doanh nghiệp', en: 'Enterprise clients', zh: '企業客戶' } },
      // pptx slide 2: 目前員工總數 27 (sales 4, technical 16, platform 4, PM 3). Alternative stat: 16 technical staff.
      { value: 27, suffix: '', label: { vi: 'Nhân sự', en: 'Employees', zh: '員工' } },
      // Operating network of profile p.11: Vietnam, Thailand, China.
      {
        value: 3,
        suffix: '',
        label: { vi: 'Quốc gia có văn phòng', en: 'Countries with offices', zh: '設有據點的國家' },
      },
    ],
  },
  highlight: {
    image: photo('skylineFlowers'),
    eyebrow: { vi: 'Năng lực điều hành', en: 'How we deliver', zh: '執行能力' },
    heading: {
      vi: 'Giá trị từ thiết kế,\ntriển khai đã kiểm chứng',
      en: 'Value from design,\nverified implementation',
      zh: '價值始於設計\n建置經過驗證',
    },
    text: {
      vi: 'Mỗi dự án được quản lý và giám sát theo quy trình đã kiểm chứng, với nguyên tắc tác động thấp – phục hồi nhanh, để hệ thống của bạn ổn định ngay từ ngày đầu vận hành.',
      en: 'Every project is managed and monitored through proven processes, on a low-impact, fast-recovery principle, so your systems are stable from day one.',
      zh: '每個專案皆依經驗證的流程管理與監控，秉持低影響、快速恢復的原則，讓系統自上線第一天起穩定運行。',
    },
    link: { label: { vi: 'Liên hệ tư vấn', en: 'Talk to us', zh: '聯絡我們' }, url: '/contact' },
  },
}

/** Realtek VN next-generation products (profile p.10), shown on the about page. */
const productLines = [
  {
    title: {
      vi: 'Hạ tầng siêu hội tụ',
      en: 'Hyper-converged infrastructure',
      zh: '超融合基礎架構',
    },
    items: (
      [
        ['Lưu trữ', 'Storage', '儲存'],
        ['Máy chủ', 'Server', '伺服器'],
        ['Mạng', 'Network', '網路'],
        ['NFV (ảo hóa chức năng mạng)', 'NFV (network functions virtualization)', 'NFV（網路功能虛擬化）'],
      ] as Tri[]
    ).map((item) => ({ title: tri(item) })),
    note: null,
  },
  {
    title: {
      vi: 'Hạ tầng CNTT & ứng dụng doanh nghiệp hội tụ',
      en: 'Converged IT infrastructure & enterprise applications',
      zh: '資訊基礎架構與企業應用整合',
    },
    items: (
      [
        ['Tối ưu hóa mạng WAN', 'WAN optimization', '廣域網路最佳化'],
        ['Tường lửa bảo mật NGFW', 'Next-generation firewall (NGFW)', '新世代防火牆（NGFW）'],
        ['Quản lý truy cập Internet (lớp 7)', 'Internet access management (Layer 7)', '上網行為管理（Layer 7）'],
        ['Định tuyến mạng lõi', 'Core network routing', '核心網路路由'],
        ['Máy chủ ứng dụng ảo', 'Virtual application servers', '虛擬應用伺服器'],
        ['Tổng đài doanh nghiệp UC-PBX', 'Enterprise telephone system (UC-PBX)', '企業電話交換系統（UC-PBX）'],
        ['Hệ thống lưu trữ dữ liệu ảo', 'Virtual data storage system', '虛擬資料儲存系統'],
        [
          'Kiểm soát an ninh – giám sát CCTV',
          'Central security control – CCTV surveillance',
          '中央安全控管－CCTV 監控',
        ],
        [
          'Điện toán đám mây – máy tính để bàn ảo (VDI)',
          'Cloud computing – virtual desktop (VDI)',
          '雲端運算－虛擬桌面（VDI）',
        ],
      ] as Tri[]
    ).map((item) => ({ title: tri(item) })),
    note: {
      vi: 'Các hệ thống vận hành trên nền tảng phần cứng có kiến trúc sẵn sàng cao (HA).',
      en: 'All systems run on a high-availability (HA) hardware base platform.',
      zh: '所有系統皆運行於高可用性（HA）硬體平臺。',
    },
  },
]

/* ---------- About page: operating network and people ---------- */

/** Head office (profile p.4, business registration) and the operating network of profile p.11. */
const offices = [
  {
    name: { vi: 'Trụ sở chính – TP. Hồ Chí Minh', en: 'Head office – Ho Chi Minh City', zh: '總部－胡志明市' },
    address,
    phone: '028 3830 2678',
  },
  {
    name: { vi: 'Văn phòng Hồ Chí Minh', en: 'Ho Chi Minh City office', zh: '胡志明市辦公室' },
    address: {
      vi: 'Tầng 2, Số 487–489 Điện Biên Phủ, Phường 3, Quận 3, TP. Hồ Chí Minh',
      en: '2nd Floor, No. 487–489 Dien Bien Phu Street, Ward 3, District 3, Ho Chi Minh City',
      zh: '胡志明市第三郡第三坊奠邊府街 487–489 號 2 樓',
    },
  },
  {
    name: { vi: 'Văn phòng Hà Nội', en: 'Hanoi office', zh: '河內辦公室' },
    address: {
      vi: 'Tầng 3, Số 35-37-39 Phố Nguyễn Xiển, Phường Hạ Đình, Quận Thanh Xuân, TP. Hà Nội',
      en: '3rd Floor, No. 35-37-39 Nguyen Xien Street, Ha Dinh Ward, Thanh Xuan District, Hanoi',
      zh: '河內市青春郡 Ha Dinh 坊 Nguyen Xien 街 35-37-39 號 3 樓',
    },
  },
  {
    name: { vi: 'Văn phòng Hải Phòng', en: 'Hai Phong office', zh: '海防辦公室' },
    address: {
      vi: 'Tầng 2, Số 26 Ngô Kim Tài, Phường Kênh Dương, Quận Lê Chân, TP. Hải Phòng',
      en: '2nd Floor, No. 26 Ngo Kim Tai Street, Kenh Duong Ward, Le Chan District, Hai Phong',
      zh: '海防市黎真郡 Kenh Duong 坊 Ngo Kim Tai 街 26 號 2 樓',
    },
  },
  {
    name: { vi: 'Văn phòng Thái Lan', en: 'Thailand office', zh: '泰國辦公室' },
    address: {
      vi: 'Số 89/23-25 Supalai Novo Ville, Klong 5, Moo 17, Bueng Kham Phroi, Lam Luk Ka, Pathum Thani 12150',
      en: 'No. 89/23-25 Supalai Novo Ville, Klong 5, Moo 17, Bueng Kham Phroi, Lam Luk Ka, Pathum Thani 12150',
      zh: '巴吞他尼府 Lam Luk Ka 縣 Bueng Kham Phroi 區 Klong 5, Moo 17, Supalai Novo Ville 89/23-25 號（12150）',
    },
  },
  {
    name: { vi: 'Văn phòng Trung Quốc', en: 'China office', zh: '中國大陸辦公室' },
    address: {
      vi: 'Kunshan Ruihong Infocomm Technology Co., Ltd. — Phòng 3607, Tòa 2, Trung tâm thương mại China Resources, Số 1288 đường Tiền Tiến Tây, trấn Ngọc Sơn, Côn Sơn, Trung Quốc',
      en: 'Kunshan Ruihong Infocomm Technology Co., Ltd. — Room 3607, Building 2, China Resources Business Center, No. 1288 Qianjin West Road, Yushan Town, Kunshan, China',
      zh: '昆山睿宏網訊科技有限公司——昆山市玉山鎮前進西路 1288 號華潤萬象匯商務中心 2 幢 3607 室',
    },
  },
]

/** Staff by department (profile p.19–21). `details` holds one point per line. */
const lines = (vi: string[], en: string[], zh: string[]): L => ({
  vi: vi.join('\n'),
  en: en.join('\n'),
  zh: zh.join('\n'),
})
const years = (n: number): L => ({ vi: `${n} năm kinh nghiệm`, en: `${n} years of experience`, zh: `${n} 年經驗` })

const teamIntro: L = {
  vi: 'Realtek có 27 nhân sự: 16 kỹ thuật, 4 kinh doanh, 4 nền tảng và 3 quản lý dự án. Các chuyên gia có từ 16 đến 28 năm kinh nghiệm về mạng, tổng đài và hạ tầng ICT.',
  en: 'Realtek has 27 staff: 16 technical, 4 sales, 4 platform and 3 project managers. Our specialists bring 16 to 28 years of experience in networking, telephony and ICT infrastructure.',
  zh: 'Realtek 現有員工 27 人：技術 16 人、業務 4 人、平臺 4 人、PM 3 人。專家團隊在網路、電話系統與 ICT 基礎架構領域擁有 16 至 28 年經驗。',
}

const teams = [
  {
    title: { vi: 'Chuyên gia kỹ thuật nước ngoài', en: 'Overseas technical specialists', zh: '海外技術專家' },
    members: [
      {
        name: 'Arnold Chung',
        role: years(28),
        details: lines(['Mạng và hệ thống điện thoại'], ['Networks and telephone systems'], ['網路與電話系統']),
      },
      {
        name: 'Peter Zhang',
        role: years(22),
        details: lines(
          ['Hạ tầng điện thoại và ICT (Alcatel, Avaya, Panasonic, Soundwin, MOSA)'],
          ['Telephone and ICT infrastructure (Alcatel, Avaya, Panasonic, Soundwin, MOSA)'],
          ['電話與 ICT 基礎架構（Alcatel、Avaya、Panasonic、Soundwin、MOSA）'],
        ),
      },
      {
        name: 'Shen Hua',
        role: years(16),
        details: lines(
          ['Hạ tầng điện thoại và ICT (Nortel, Avaya, trung tâm dữ liệu, giám sát, bảo mật)'],
          ['Telephone and ICT infrastructure (Nortel, Avaya, data center, surveillance, security)'],
          ['電話與 ICT 基礎架構（Nortel、Avaya、資料中心、監控、資安）'],
        ),
      },
      {
        name: 'Zhang WeiJian',
        role: years(24),
        details: lines(['Hệ thống điện thoại và ứng dụng'], ['Telephone systems and applications'], ['電話系統與應用']),
      },
      {
        name: 'Sun Shiping',
        role: years(19),
        details: lines(['Hệ thống điện thoại và ứng dụng'], ['Telephone systems and applications'], ['電話系統與應用']),
      },
    ],
  },
  {
    title: { vi: 'Kinh doanh & tư vấn giải pháp', en: 'Business & presales', zh: '業務與售前技術' },
    members: [
      {
        name: 'Lục Khai Quyền (Raymond Luk)',
        role: {
          vi: 'Trưởng nhóm kinh doanh Việt Nam & trưởng nhóm tư vấn giải pháp kỹ thuật',
          en: 'Vietnam business leader & technical presales leader',
          zh: '越南業務主管暨技術售前主管',
        },
        details: lines(
          [
            '4 năm trưởng nhóm kinh doanh Việt Nam và trưởng nhóm tư vấn giải pháp kỹ thuật tại Realtek Việt Nam',
            '2 năm quản lý hệ thống điện thoại (Nortel, Panasonic) tại trụ sở tập đoàn Pou Chen',
            '2 năm hỗ trợ CNTT và quản lý hệ thống điện thoại tại 11 cơ sở của tập đoàn Pou Chen',
            '1 năm triển khai và quản lý hạ tầng CNTT tại Công ty Cổ phần Tường Minh (hơn 10 dự án)',
            '3 năm tư vấn giải pháp các hệ thống ICT và trưởng nhóm tại Vinafore Corp. (thiết kế hơn 100 dự án và giải pháp)',
            '1 năm quản lý sản phẩm Avaya tại Vinafore Corp. (20 kênh khách hàng, 100 bộ thiết bị)',
            'Phụ trách: Cisco, HP, IBM, Dell, QNAP, Avaya, Siemens, Panasonic, Vivotek, ZKTeco, Schneider – APC, Fortinet, Sangfor, Ruijie, trung tâm dữ liệu, điện UPS',
          ],
          [
            '4 years as Vietnam business leader and technical presales leader at Realtek Vietnam',
            '2 years managing telephone systems (Nortel, Panasonic) at the Pou Chen Group head office',
            '2 years of IT support and telephone system management at 11 Pou Chen Group sites',
            '1 year implementing and managing ICT infrastructure at Tuong Minh Corp. (over 10 projects)',
            '3 years in ICT presales and as team leader at Vinafore Corp. (over 100 project and solution designs)',
            '1 year as Avaya product manager at Vinafore Corp. (20 customer channels, 100 sets deployed)',
            'In charge of: Cisco, HP, IBM, Dell, QNAP, Avaya, Siemens, Panasonic, Vivotek, ZKTeco, Schneider – APC, Fortinet, Sangfor, Ruijie, data centers, UPS power',
          ],
          [
            '於 Realtek 越南擔任越南業務主管暨技術售前主管 4 年',
            '於寶成集團總部負責電話系統（Nortel、Panasonic）管理 2 年',
            '於寶成集團 11 個據點負責資訊支援與電話系統管理 2 年',
            '於 Tuong Minh 公司負責 ICT 基礎架構建置與管理 1 年（逾 10 個專案）',
            '於 Vinafore 公司擔任 ICT 系統售前顧問暨組長 3 年（設計逾 100 個專案與方案）',
            '於 Vinafore 公司擔任 Avaya 產品經理 1 年（20 個客戶通路、100 套設備）',
            '負責：Cisco、HP、IBM、Dell、QNAP、Avaya、Siemens、Panasonic、Vivotek、ZKTeco、Schneider – APC、Fortinet、Sangfor、Ruijie、資料中心、UPS 電力',
          ],
        ),
      },
    ],
  },
  {
    title: { vi: 'Phòng kỹ thuật triển khai', en: 'Technical deployment department', zh: '技術建置部' },
    members: [
      {
        name: 'Dương Tiến Trung (Roy)',
        details: lines(
          [
            'Chứng chỉ: CCNA',
            'Phụ trách: hệ thống camera CCTV, hệ thống an ninh toàn diện, Dintek, CommScope, Cisco, HP, Hikvision, ZKTeco, Sangfor',
          ],
          [
            'Certificate: CCNA',
            'In charge of: CCTV camera systems, integrated security systems, Dintek, CommScope, Cisco, HP, Hikvision, ZKTeco, Sangfor',
          ],
          [
            '證照：CCNA',
            '負責：CCTV 攝影機系統、整合安防系統、Dintek、CommScope、Cisco、HP、Hikvision、ZKTeco、Sangfor',
          ],
        ),
      },
      {
        name: 'Nguyễn Văn Cường (Rick)',
        details: lines(
          ['Phụ trách: hệ thống mạng, camera CCTV, Dintek, CommScope, Cisco, HP, Ruijie, Hikvision'],
          ['In charge of: network systems, CCTV cameras, Dintek, CommScope, Cisco, HP, Ruijie, Hikvision'],
          ['負責：網路系統、CCTV 攝影機、Dintek、CommScope、Cisco、HP、Ruijie、Hikvision'],
        ),
      },
      {
        name: 'Trần Văn Long (Ryan)',
        details: lines(
          [
            'Phụ trách: hệ thống an ninh toàn diện, hệ thống năng lượng xanh & tự động hóa, Dintek, CommScope, Cisco, HP, ZKTeco, điện UPS',
          ],
          [
            'In charge of: integrated security systems, green energy & automation systems, Dintek, CommScope, Cisco, HP, ZKTeco, UPS power',
          ],
          ['負責：整合安防系統、綠色能源與自動化系統、Dintek、CommScope、Cisco、HP、ZKTeco、UPS 電力'],
        ),
      },
      {
        name: 'Vương Minh Hoàng (Hary)',
        details: lines(
          ['Phụ trách: Dintek, CommScope, Ruijie, Hikvision, công nghệ cáp quang'],
          ['In charge of: Dintek, CommScope, Ruijie, Hikvision, fiber-optic technology'],
          ['負責：Dintek、CommScope、Ruijie、Hikvision、光纖技術'],
        ),
      },
      {
        name: 'Mai Tiến Đạt (Dominic)',
        details: lines(
          ['Phụ trách: Dintek, AMP, Ruijie, công nghệ cáp quang'],
          ['In charge of: Dintek, AMP, Ruijie, fiber-optic technology'],
          ['負責：Dintek、AMP、Ruijie、光纖技術'],
        ),
      },
    ],
  },
  {
    title: { vi: 'Phòng dịch vụ MSP', en: 'MSP department', zh: 'MSP 服務部' },
    members: [
      {
        name: 'Nguyễn Văn Thái (Brian)',
        details: lines(
          [
            'Chứng chỉ: ACNA, CCNA, CCNP, MCITP',
            'Phụ trách: Microsoft, Cisco, Fortinet, Ruijie, HPE Aruba, IBM, Dell EMC, Alcatel, Avaya, Hikvision, mạng LAN/WAN/Wi-Fi',
          ],
          [
            'Certificates: ACNA, CCNA, CCNP, MCITP',
            'In charge of: Microsoft, Cisco, Fortinet, Ruijie, HPE Aruba, IBM, Dell EMC, Alcatel, Avaya, Hikvision, LAN/WAN/Wi-Fi networking',
          ],
          [
            '證照：ACNA、CCNA、CCNP、MCITP',
            '負責：Microsoft、Cisco、Fortinet、Ruijie、HPE Aruba、IBM、Dell EMC、Alcatel、Avaya、Hikvision、LAN/WAN/Wi-Fi 網路',
          ],
        ),
      },
      {
        name: 'Huỳnh Lê Thiện Hòa (Kent)',
        details: lines(
          ['Chứng chỉ: CCNA, MCSA', 'Phụ trách: Microsoft, Cisco, Fortinet, Ruckus, Aruba, Dell, Ruijie, Hikvision'],
          [
            'Certificates: CCNA, MCSA',
            'In charge of: Microsoft, Cisco, Fortinet, Ruckus, Aruba, Dell, Ruijie, Hikvision',
          ],
          ['證照：CCNA、MCSA', '負責：Microsoft、Cisco、Fortinet、Ruckus、Aruba、Dell、Ruijie、Hikvision'],
        ),
      },
      {
        name: 'Dương Tiến Bảo (Kay)',
        details: lines(
          [
            'Chứng chỉ: MCSA, CCNA',
            'Phụ trách: hệ thống an ninh toàn diện, hệ thống mạng, máy chủ, PC, Ruijie, Cisco, Hikvision, công nghệ cáp quang',
          ],
          [
            'Certificates: MCSA, CCNA',
            'In charge of: integrated security systems, network systems, servers, PCs, Ruijie, Cisco, Hikvision, fiber-optic technology',
          ],
          ['證照：MCSA、CCNA', '負責：整合安防系統、網路系統、伺服器、個人電腦、Ruijie、Cisco、Hikvision、光纖技術'],
        ),
      },
    ],
  },
]

/* ---------- About page ---------- */

/* ---------- Certificates (home and about pages) ----------
   Hikvision / Ruijie partner certificates (public/content/certificates) expired on 31/12/2024: add them once renewed.
   Matched by Vietnamese title when updating the database. */

export type CertificateEntry = { title: L; image: PhotoRef; orientation: 'portrait' | 'landscape' }

export const certificates: CertificateEntry[] = [
  {
    title: {
      vi: 'Chứng nhận ISO 9001:2015 (tiếng Việt)',
      en: 'ISO 9001:2015 certificate (Vietnamese)',
      zh: 'ISO 9001:2015 證書（越南文版）',
    },
    image: photo('certIso9001Vi'),
    orientation: 'portrait',
  },
  {
    title: {
      vi: 'Chứng nhận ISO 9001:2015 (tiếng Anh)',
      en: 'ISO 9001:2015 certificate (English)',
      zh: 'ISO 9001:2015 證書（英文版）',
    },
    image: photo('certIso9001En'),
    orientation: 'portrait',
  },
]

export const aboutPage = {
  heading: { vi: 'Về Realtek', en: 'About Realtek', zh: '關於 Realtek' },
  lead: {
    vi: 'Công ty Cổ phần Tin học Viễn thông Realtek (REALTEK JSC) chuyên tích hợp hệ thống và cung cấp dịch vụ ICT chuyên nghiệp, lấy Việt Nam làm trung tâm phục vụ khách hàng doanh nghiệp khu vực ASEAN.',
    en: 'Realtek Informatics Telecom JSC (REALTEK JSC) specializes in ICT system integration and professional ICT services, with Vietnam as its hub for enterprise clients across ASEAN.',
    zh: 'Realtek 資訊電信股份有限公司（REALTEK JSC）專注於 ICT 系統整合與專業 ICT 服務，以越南為中心服務東協企業客戶。',
  },
  image: photo('teamGroup'),
  content: rich(
    [
      h('Thư ngỏ'),
      p('Kính gửi Quý khách hàng và Đối tác,'),
      p(
        'Công ty Cổ phần Tin học Viễn thông Realtek tự hào là nhà cung cấp dịch vụ hệ thống thông tin và truyền thông, chuyên thiết kế, lắp đặt và phát triển các giải pháp CNTT chuyên nghiệp tại châu Á. Với tầm nhìn dài hạn và sự tận tâm, chúng tôi cam kết mang đến những giải pháp toàn diện, hiệu quả, phù hợp với nhu cầu cụ thể của từng khách hàng.',
      ),
      p(
        'Bằng cách ứng dụng công nghệ tiên tiến, chúng tôi đã góp phần giải quyết nhiều bài toán khó trong các lĩnh vực tài chính, bán lẻ, thiết kế bán dẫn, chăm sóc sức khỏe và nhiều ngành công nghiệp khác. Những dự án thành công là minh chứng cho năng lực của REALTEK JSC và sự tín nhiệm mà khách hàng dành cho chúng tôi.',
      ),
      p(
        'Sự hài lòng của khách hàng là mục tiêu phát triển của chúng tôi. REALTEK JSC mong tiếp tục hợp tác cùng Quý khách hàng và đối tác để tạo ra những giá trị vượt trội, góp phần vào sự phát triển bền vững của ngành công nghệ thông tin và truyền thông.',
      ),
      h('Tầm nhìn'),
      p(
        'Trở thành nhà cung cấp dịch vụ hệ thống thông tin và truyền thông hàng đầu châu Á, tiên phong ứng dụng công nghệ hiện đại để xây dựng các giải pháp CNTT chuyên nghiệp, sáng tạo, bền vững, đáp ứng mọi nhu cầu của khách hàng toàn cầu.',
      ),
      h('Sứ mệnh'),
      ul([
        'Cung cấp các giải pháp CNTT toàn diện',
        'Đồng hành phát triển cùng khách hàng',
        'Góp phần phát triển lĩnh vực CNTT – truyền thông',
      ]),
      h('Năng lực điều hành'),
      p(
        'Với mạng lưới hoạt động tại Đài Loan, Trung Quốc, Việt Nam và khu vực ASEAN, Realtek đáp ứng nhanh chóng và an toàn nhu cầu của khách hàng trong chuỗi ứng dụng toàn cầu, dựa trên bốn nguyên tắc:',
      ),
      ul([
        'Giá trị từ thiết kế: tối ưu trải nghiệm và gia tăng giá trị ngay từ bản thiết kế',
        'Triển khai đã kiểm chứng: quy trình được kiểm chứng, bảo đảm hiệu quả và độ tin cậy',
        'Quản lý và giám sát: duy trì chất lượng cao trong suốt dự án',
        'Tác động thấp – phục hồi nhanh: giảm thiểu ảnh hưởng và nhanh chóng ổn định',
      ]),
      h('Pháp lý & chứng nhận'),
      ul([
        'Mã số doanh nghiệp: 0314140632, đăng ký lần đầu ngày 02/12/2016; chuyển đổi thành công ty cổ phần tháng 7/2024',
        'Chứng nhận hệ thống quản lý chất lượng ISO 9001:2015 (ISOCERT, hiệu lực đến 16/09/2027) cho phạm vi tư vấn, thiết kế, nhập khẩu, kinh doanh, lắp đặt và bảo trì hệ thống công nghệ thông tin và hệ thống điện nhẹ',
      ]),
    ],
    [
      h('Open letter'),
      p('Dear valued customers and partners,'),
      p(
        'Realtek Informatics Telecom JSC is proud to be a provider of information technology and telecommunication systems, specializing in designing, installing and developing professional IT solutions across Asia. With a long-term vision and unwavering dedication, we deliver comprehensive, effective solutions tailored to each customer’s needs.',
      ),
      p(
        'By applying advanced technologies, we have helped solve complex challenges in finance, retail, semiconductor design, healthcare and many other industries. Our successful projects are a testament to the capabilities of REALTEK JSC and the trust our clients place in us.',
      ),
      p(
        'Customer satisfaction is at the heart of our business. REALTEK JSC looks forward to continuing to work with you to create exceptional value and contribute to the sustainable development of the information technology and telecommunications industry.',
      ),
      h('Vision'),
      p(
        'To become Asia’s leading provider of information technology and telecommunications services, pioneering the adoption of cutting-edge technology to build professional, innovative and sustainable IT solutions that meet the diverse needs of our global customers.',
      ),
      h('Mission'),
      ul([
        'Offer end-to-end IT solutions',
        'Grow together with our clients',
        'Contribute to the growth of the ICT sector',
      ]),
      h('How we deliver'),
      p(
        'With a presence in Taiwan, China, Vietnam and across ASEAN, Realtek responds quickly and safely to clients’ needs across global supply chains, guided by four principles:',
      ),
      ul([
        'Value from design: optimizing the experience and adding value from the first drawing',
        'Verified implementation: proven processes that ensure efficiency and reliability',
        'Management and monitoring: maintaining high quality throughout every project',
        'Low impact, fast recovery: minimizing disruption and stabilizing quickly',
      ]),
      h('Legal & certifications'),
      ul([
        'Enterprise code 0314140632, first registered on 2 December 2016; converted into a joint stock company in July 2024',
        'ISO 9001:2015 quality management certification (ISOCERT, valid until 16 September 2027) for consulting, designing, importing, trading, installing and maintaining information technology and low-voltage electrical systems',
      ]),
    ],
    [
      h('致客戶與合作夥伴'),
      p('親愛的客戶與合作夥伴：'),
      p(
        'Realtek 以身為資訊與通訊系統服務供應商為榮，專注於在亞洲設計、安裝與開發專業 IT 解決方案。秉持長遠願景與用心，我們致力提供全面且有效、貼合每位客戶需求的解決方案。',
      ),
      p(
        '我們運用先進技術，協助金融、零售、半導體設計、醫療照護等眾多產業解決複雜課題。一個個成功專案，證明了 REALTEK JSC 的實力與客戶給予的信任。',
      ),
      p(
        '客戶滿意是我們發展的目標。REALTEK JSC 期盼與您持續合作，共同創造卓越價值，為資訊與通訊產業的永續發展貢獻心力。',
      ),
      h('願景'),
      p(
        '成為亞洲領先的資訊與通訊服務供應商，率先導入前瞻技術，打造專業、創新、永續的 IT 解決方案，滿足全球客戶的多元需求。',
      ),
      h('使命'),
      ul(['提供全方位 IT 解決方案', '與客戶攜手成長', '推動資通訊產業發展']),
      h('執行能力'),
      p('Realtek 據點遍及臺灣、中國大陸、越南與東協地區，能快速且安全地回應客戶在全球供應鏈中的需求，並堅守四項原則：'),
      ul([
        '價值始於設計：從設計階段即優化體驗、創造價值',
        '建置經過驗證：以驗證過的流程確保效率與可靠性',
        '管理與監控：全程維持高品質',
        '低影響、快速恢復：將影響降到最低並迅速恢復穩定',
      ]),
      h('法定資訊與認證'),
      ul([
        '企業代碼（稅務編號）0314140632，2016 年 12 月 2 日首次登記；2024 年 7 月改制為股份有限公司',
        'ISO 9001:2015 品質管理系統認證（ISOCERT，有效期至 2027 年 9 月 16 日），範圍涵蓋資訊系統與弱電系統的顧問、設計、進口、銷售、安裝與維護',
      ]),
    ],
  ),
  // Core values of profile p.5 (the profile gives titles only).
  values: [
    { title: { vi: 'Chất lượng vượt trội', en: 'Superior quality', zh: '卓越品質' }, text: null },
    { title: { vi: 'Khách hàng là trung tâm', en: 'Customer-focused', zh: '以客戶為中心' }, text: null },
    { title: { vi: 'Đổi mới sáng tạo', en: 'Innovation & creativity', zh: '創新與創意' }, text: null },
    { title: { vi: 'Chính trực và trách nhiệm', en: 'Integrity & responsibility', zh: '誠信與責任' }, text: null },
  ],
  milestones: [
    {
      year: '2001',
      title: { vi: 'Khởi nguồn tại Đài Loan', en: 'Roots in Taiwan', zh: '源自臺灣' },
      text: {
        vi: 'Thành lập SunNet Telecom tại Đài Loan, cung cấp sản phẩm Nortel, Cisco, Euphony, BlueCoat và bắt đầu phục vụ Compal, Wistron, LITEON.',
        en: 'SunNet Telecom founded in Taiwan, supplying Nortel, Cisco, Euphony and BlueCoat and starting to serve Compal, Wistron and LITEON.',
        zh: 'SunNet Telecom 於臺灣成立，代理 Nortel、Cisco、Euphony、BlueCoat 產品，開始服務仁寶、緯創、光寶。',
      },
    },
    {
      year: '2011',
      title: { vi: 'Thành lập công ty tại Côn Sơn', en: 'Kunshan company founded', zh: '昆山睿宏成立' },
      text: {
        vi: 'Thành lập Kunshan Ruihong Infocomm Technology (Trung Quốc), tập trung vào khu công nghiệp thông minh và tích hợp hệ thống truyền thông.',
        en: 'Kunshan Ruihong Infocomm Technology founded in China, focused on smart campuses and communications system integration.',
        zh: '昆山睿宏網訊科技有限公司成立，專注智慧園區與通訊系統整合。',
      },
    },
    {
      year: '2016',
      title: { vi: 'Trụ sở Việt Nam', en: 'Vietnam headquarters', zh: '越南總部成立' },
      text: {
        vi: 'Thành lập Công ty TNHH Tin học Viễn thông Realtek tại TP. Hồ Chí Minh — trung tâm phục vụ khách hàng ASEAN; mở rộng văn phòng Thành Đô.',
        en: 'Realtek Informatics Telecom Co., Ltd. established in Ho Chi Minh City as the hub for ASEAN clients; Chengdu office expanded.',
        zh: '於胡志明市成立越南公司，作為服務東協客戶的中心；擴大成都辦事處。',
      },
    },
    {
      year: '2019',
      title: { vi: 'Văn phòng Hà Nội', en: 'Hanoi office', zh: '河內代表處' },
      text: {
        vi: 'Thành lập văn phòng đại diện tại Hà Nội.',
        en: 'Representative office opened in Hanoi.',
        zh: '成立河內代表處。',
      },
    },
    {
      year: '2020',
      title: { vi: 'Văn phòng Hải Phòng', en: 'Hai Phong office', zh: '海防代表處' },
      text: {
        vi: 'Thành lập văn phòng đại diện tại Hải Phòng, mở rộng phục vụ khách hàng miền Bắc.',
        en: 'Representative office opened in Hai Phong to serve clients in northern Vietnam.',
        zh: '成立海防代表處，延伸服務北越客戶。',
      },
    },
    {
      year: '2023',
      title: { vi: 'Mở rộng sang Thái Lan', en: 'Expansion to Thailand', zh: '進軍泰國' },
      text: {
        vi: 'Thành lập RealTek Information Technology Co., Ltd. để phục vụ khách hàng tại Thái Lan.',
        en: 'RealTek Information Technology Co., Ltd. established to serve clients in Thailand.',
        zh: '成立 RealTek Information Technology Co., Ltd.，服務泰國客戶。',
      },
    },
    {
      year: '2024',
      title: {
        vi: 'Công ty cổ phần & ISO 9001',
        en: 'Joint stock company & ISO 9001',
        zh: '改制股份有限公司與 ISO 9001',
      },
      text: {
        vi: 'Tháng 7/2024 chuyển đổi thành Công ty Cổ phần Tin học Viễn thông Realtek; tháng 9/2024 đạt chứng nhận ISO 9001:2015.',
        en: 'Converted into Realtek Informatics Telecom JSC in July 2024 and certified to ISO 9001:2015 in September 2024.',
        zh: '2024 年 7 月改制為股份有限公司，同年 9 月取得 ISO 9001:2015 認證。',
      },
    },
  ],
  productLines,
  offices,
  teamIntro,
  teams,
}

/* ---------- Localization helper ---------- */

export type Loc = keyof L

function isLocalized(value: unknown): value is L {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 3 &&
    'vi' in value &&
    'en' in value &&
    'zh' in value
  )
}

/**
 * Deep-copies content for one locale: `{ vi, en, zh }` becomes the string for `locale`,
 * `photo()` references go through `resolvePhoto` (a Payload media id when seeding, a media object in demo mode).
 */
export function localize<T>(value: T, locale: Loc, resolvePhoto: (key: PhotoKey) => unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => localize(v, locale, resolvePhoto))
  if (isLocalized(value)) return value[locale]
  if (value && typeof value === 'object') {
    if ('$photo' in value) return resolvePhoto((value as PhotoRef).$photo)
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, locale, resolvePhoto)]))
  }
  return value
}
