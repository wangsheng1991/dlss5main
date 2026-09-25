export type ShowcaseCase = {
  id: string;
  category: string;
  categoryZh: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  prompt: string;
  before: string;
  after: string;
  alt: string;
};

/**
 * Original illustrative cases used to explain what an enhancement pass should be
 * checked for. The low-res files are deliberately derived from the same source
 * image; they are demonstrations, not claimed model benchmarks.
 */
const generated = (group: string, index: number) => ({
  before: `/examples/generated/${group}-${index}-before.jpg`,
  after: `/examples/generated/${group}-${index}-after.jpg`,
});

export const SHOWCASE_CASES: ShowcaseCase[] = [
  {
    id: 'architecture-kitchen', category: 'Architecture', categoryZh: '建筑与室内', title: 'Kitchen render edges', titleZh: '厨房效果图边缘',
    description: 'Recover cabinet seams, stone texture and window light without moving the island or changing the room layout.', descriptionZh: '恢复柜体接缝、石材纹理和窗光，同时保持中岛与房间布局不变。',
    prompt: 'Preserve the exact kitchen geometry; sharpen cabinet seams and countertop texture; do not add objects.', ...generated('architecture', 1), alt: 'Kitchen interior before and after an illustrative AI upscaling pass',
  },
  {
    id: 'architecture-apartment', category: 'Architecture', categoryZh: '建筑与室内', title: 'Apartment facade lines', titleZh: '公寓立面直线',
    description: 'A useful check for window spacing, balcony rails and perspective when an architectural preview is small.', descriptionZh: '适合检查小尺寸建筑预览中的窗间距、阳台栏杆和透视。',
    prompt: 'Keep the facade perspective and window spacing exact; reduce halos on straight lines; preserve materials.', ...generated('architecture', 2), alt: 'Apartment facade before and after an illustrative AI upscaling pass',
  },
  {
    id: 'architecture-living-room', category: 'Architecture', categoryZh: '建筑与室内', title: 'Living room material texture', titleZh: '客厅材质纹理',
    description: 'Inspect fabric, wood grain and small light transitions instead of judging the result only at thumbnail size.', descriptionZh: '检查布料、木纹和细小的光影变化，不要只看缩略图判断结果。',
    prompt: 'Restore fabric and wood texture while keeping the furniture silhouette, lighting and camera framing unchanged.', ...generated('architecture', 3), alt: 'Living room before and after an illustrative AI upscaling pass',
  },
  {
    id: 'architecture-office', category: 'Architecture', categoryZh: '建筑与室内', title: 'Glass office repetition', titleZh: '玻璃办公楼重复结构',
    description: 'Repeated glass panels reveal ringing and invented geometry quickly; compare at 100% before delivery.', descriptionZh: '重复玻璃面板很容易暴露振铃和伪造结构，交付前要按 100% 检查。',
    prompt: 'Preserve every glass panel and mullion; sharpen the facade without adding windows or changing perspective.', ...generated('architecture', 4), alt: 'Glass office building before and after an illustrative AI upscaling pass',
  },
  {
    id: 'product-headphones', category: 'Product', categoryZh: '商品与电商', title: 'Headphone product edge', titleZh: '耳机商品轮廓',
    description: 'The product silhouette and leather texture should become clearer without inventing a new hinge or button.', descriptionZh: '提升商品轮廓和皮革纹理，但不要凭空生成新的转轴或按键。',
    prompt: 'Keep the headphone silhouette, seams and buttons unchanged; remove compression noise; do not invent branding.', ...generated('product', 1), alt: 'Headphones before and after an illustrative AI product photo enhancement',
  },
  {
    id: 'product-bottle', category: 'Product', categoryZh: '商品与电商', title: 'Cosmetic bottle cleanup', titleZh: '护肤瓶细节清理',
    description: 'A clean test for specular highlights, rounded packaging and the blank label area used in a listing image.', descriptionZh: '用于检查高光、圆弧包装和电商主图留白标签区域。',
    prompt: 'Preserve the bottle shape, cap alignment and blank label; reduce JPEG artifacts; keep the warm studio light.', ...generated('product', 2), alt: 'Cosmetic bottle before and after an illustrative AI product photo enhancement',
  },
  {
    id: 'product-shoe', category: 'Product', categoryZh: '商品与电商', title: 'Shoe mesh and sole', titleZh: '鞋面网眼与鞋底',
    description: 'Fine mesh and sole edges are high-risk areas for over-sharpening; compare the original before publishing.', descriptionZh: '网眼和鞋底边缘容易过度锐化，发布前请和原图对照。',
    prompt: 'Keep the shoe silhouette and lace placement; recover mesh texture; no new seams, logos or text.', ...generated('product', 3), alt: 'Running shoe before and after an illustrative AI product photo enhancement',
  },
  {
    id: 'product-watch', category: 'Product', categoryZh: '商品与电商', title: 'Wood watch grain', titleZh: '木质手表纹理',
    description: 'Use the dial and repeated links to check whether texture is consistent rather than merely sharp.', descriptionZh: '通过表盘和重复表链检查纹理是否一致，而不是只追求锐度。',
    prompt: 'Preserve the watch face, hand positions and link geometry; recover wood grain without changing the product.', ...generated('product', 4), alt: 'Wood watch before and after an illustrative AI product photo enhancement',
  },
  {
    id: 'portrait-outdoor', category: 'Portrait', categoryZh: '人像与照片', title: 'Outdoor portrait detail', titleZh: '户外人像细节',
    description: 'Keep identity, expression and hairline stable while making a soft source easier to reuse.', descriptionZh: '保持身份、表情和发际线稳定，让偏软原图更适合复用。',
    prompt: 'Preserve facial identity and expression; restore natural hair and skin texture; do not change age or face shape.', ...generated('portrait', 1), alt: 'Outdoor portrait before and after an illustrative AI enhancement',
  },
  {
    id: 'portrait-cafe', category: 'Portrait', categoryZh: '人像与照片', title: 'Cafe window portrait', titleZh: '咖啡馆窗边人像',
    description: 'Check eyes, beard texture and the background bokeh for invented detail after enhancement.', descriptionZh: '检查眼睛、胡须纹理和背景虚化，防止增强后出现伪造细节。',
    prompt: 'Keep the face and expression recognizable; reduce compression; preserve the cafe lighting and background blur.', ...generated('portrait', 2), alt: 'Cafe portrait before and after an illustrative AI enhancement',
  },
  {
    id: 'portrait-library', category: 'Portrait', categoryZh: '人像与照片', title: 'Candid library photo', titleZh: '图书馆抓拍照片',
    description: 'A family-photo style case where natural skin, clothing and the book should remain believable.', descriptionZh: '适合家庭照片场景，皮肤、衣物和书本内容都应保持自然可信。',
    prompt: 'Preserve the candid pose, clothing pattern and book shape; add restrained detail without changing the scene.', ...generated('portrait', 3), alt: 'Candid library photo before and after an illustrative AI enhancement',
  },
  {
    id: 'portrait-older-adult', category: 'Portrait', categoryZh: '人像与照片', title: 'Natural gray hair', titleZh: '自然灰发与皮肤',
    description: 'Fine gray hair and skin texture are useful stress tests for an enhancer that should avoid plastic retouching.', descriptionZh: '灰发和皮肤纹理是检验增强器是否出现塑料磨皮的好场景。',
    prompt: 'Preserve age, gray hair and facial lines; remove softness without glamour retouching or changing identity.', ...generated('portrait', 4), alt: 'Older adult portrait before and after an illustrative AI enhancement',
  },
  {
    id: 'nature-lake', category: 'Travel', categoryZh: '旅行与自然', title: 'Mountain lake texture', titleZh: '山湖自然纹理',
    description: 'Compare tree branches, mountain ridges and reflected detail to spot halos in landscape work.', descriptionZh: '通过树枝、山脊和倒影细节发现风景图中的光晕。',
    prompt: 'Keep the mountain silhouette and lake reflection; recover tree texture; avoid invented peaks or clouds.', ...generated('nature', 1), alt: 'Mountain lake before and after an illustrative AI enhancement',
  },
  {
    id: 'nature-lighthouse', category: 'Travel', categoryZh: '旅行与自然', title: 'Coastal lighthouse', titleZh: '海岸灯塔',
    description: 'Use the lighthouse edge and rock texture to check geometry and denoising on a sunset image.', descriptionZh: '用灯塔边缘和岩石纹理检查日落图的几何稳定性和降噪效果。',
    prompt: 'Preserve the lighthouse geometry, shoreline and sunset colors; sharpen rocks without adding structures.', ...generated('nature', 2), alt: 'Coastal lighthouse before and after an illustrative AI enhancement',
  },
  {
    id: 'nature-market', category: 'Travel', categoryZh: '旅行与自然', title: 'Market stall detail', titleZh: '集市摊位细节',
    description: 'Colorful repeated objects expose over-smoothing; inspect fabric, produce and stall edges at full size.', descriptionZh: '彩色重复物体容易暴露过度平滑，建议查看织物、果蔬和摊位边缘。',
    prompt: 'Preserve the market layout and colors; recover fabric and produce texture; do not add readable signs.', ...generated('nature', 3), alt: 'Tropical market before and after an illustrative AI enhancement',
  },
  {
    id: 'nature-waterfall', category: 'Travel', categoryZh: '旅行与自然', title: 'Waterfall and foliage', titleZh: '瀑布与森林植被',
    description: 'Leaves, rocks and moving water make a good visual check for texture consistency and ringing.', descriptionZh: '树叶、岩石和流水可用来检查纹理一致性与边缘振铃。',
    prompt: 'Preserve the waterfall flow and forest composition; restore leaf and rock texture without surreal detail.', ...generated('nature', 4), alt: 'Forest waterfall before and after an illustrative AI enhancement',
  },
  {
    id: 'creative-city', category: 'Creative render', categoryZh: '创意渲染', title: 'Neon city reflections', titleZh: '霓虹城市倒影',
    description: 'A game-style render where wet pavement, neon light and straight architecture reveal temporal-looking artifacts.', descriptionZh: '游戏风格画面中，湿地反光、霓虹光和直线建筑能快速暴露伪影。',
    prompt: 'Preserve the city geometry and lighting direction; sharpen reflections without adding signs or vehicles.', ...generated('creative', 1), alt: 'Neon city render before and after an illustrative AI enhancement',
  },
  {
    id: 'creative-castle', category: 'Creative render', categoryZh: '创意渲染', title: 'Castle courtyard stone', titleZh: '城堡庭院石材',
    description: 'Use repeating stone blocks, banners and arches to check whether detail stays anchored to the scene.', descriptionZh: '通过重复石块、旗帜和拱门检查细节是否锚定在场景中。',
    prompt: 'Keep every arch and tower in place; recover stone texture and foliage; no new characters or flags.', ...generated('creative', 2), alt: 'Castle courtyard render before and after an illustrative AI enhancement',
  },
  {
    id: 'creative-hangar', category: 'Creative render', categoryZh: '创意渲染', title: 'Spaceship hangar geometry', titleZh: '太空机库几何结构',
    description: 'A high-contrast scene for checking mechanical edges, floor lines and repeated hangar details.', descriptionZh: '适合检查机械边缘、地面线条和机库重复结构的高对比场景。',
    prompt: 'Preserve the spacecraft silhouette and hangar floor lines; sharpen materials; do not add ships or people.', ...generated('creative', 3), alt: 'Spaceship hangar render before and after an illustrative AI enhancement',
  },
  {
    id: 'creative-botanical', category: 'Creative render', categoryZh: '创意渲染', title: 'Botanical illustration layers', titleZh: '植物插画分层',
    description: 'Flat illustration edges and layered leaves make it easy to see whether enhancement preserves shape boundaries.', descriptionZh: '扁平插画的边缘和叶片分层能清楚显示增强是否保持形状边界。',
    prompt: 'Preserve the illustration palette and leaf silhouettes; clean edges without inventing text or extra flowers.', ...generated('creative', 4), alt: 'Botanical illustration before and after an illustrative AI enhancement',
  },
];
