-- Seed the editorially rewritten garden inspiration + Shopee affiliate tutorial as a draft.
-- Safe to run again while the article remains a draft; published content is never overwritten.

insert into public.articles as existing (
  author_id, title, slug, excerpt, content, content_blocks, cover_url, status, article_type,
  category, difficulty, duration_minutes, tools, is_featured, seo_title, seo_description,
  author_name, author_bio, source_references, reviewed_at, published_at, updated_at
) values (
  (select id from public.users where role = 'admin' order by created_at asc limit 1),
  'Tạo video khu vườn chữa lành bằng ChatGPT và Google Flow',
  'tao-video-khu-vuon-chatgpt-google-flow-affiliate-shopee',
  'Quy trình tạo video khu vườn thư giãn, giữ bối cảnh đồng nhất và gắn affiliate hạt giống/cây giống minh bạch — chỉ với ChatGPT và Google Flow.',
  $article$Một khu vườn sau mưa có đủ chất liệu để giữ người xem lại chỉ trong vài giây: giọt nước trượt trên lá, đất sẫm màu, tiếng bình tưới chạm vào đá và ánh chiều xuyên qua giàn cây. Đây là kiểu nội dung ngắn có thể kết hợp tự nhiên với sản phẩm làm vườn — nếu người làm không biến hình ảnh AI thành lời hứa sai về hạt giống hoặc cây giống thật.

Trong bài này, chúng ta dùng đúng hai công cụ:

• ChatGPT: xây concept, garden bible, storyboard, prompt và nội dung affiliate.
• Google Flow: tạo hình tham chiếu, các clip chuyển động và âm thanh môi trường nguyên bản.

Không cần tải nhạc từ video khác, không cần mua chatbot mẫu và không cần tạo hàng trăm clip gần giống nhau. Mục tiêu là một series có thế giới nhận diện rõ, hình ảnh nhất quán và mỗi video mang lại một khoảnh khắc thư giãn riêng.

Lưu ý: Cảnh cây trĩu quả do AI tạo chỉ là hình minh họa. Không dùng nó làm bằng chứng rằng sản phẩm hạt giống hoặc cây giống trong link sẽ nảy mầm, phát triển hay cho năng suất giống video.

## Concept mẫu: “Khu Vườn Sau Mưa”

• Nhân vật: Linh, người làm vườn 28 tuổi, áo linen chàm, tạp dề nâu đất.
• Bối cảnh: khu vườn nhỏ cạnh căn nhà gỗ, có luống rau cao, giàn leo và lối đá ướt.
• Nhịp nội dung: chậm, quan sát, không thoại hoặc chỉ một câu rất ngắn.
• Âm thanh: nước, lá, đất, chim xa và dụng cụ gỗ; không dùng nhạc sao chép.
• Định dạng: 15–30 giây, dọc 9:16.
• Sản phẩm phù hợp: bình tưới, găng tay, khay ươm, dụng cụ cầm tay hoặc hạt giống có thông tin listing rõ ràng.

Tập mẫu: “Thu hoạch rau thơm sau cơn mưa chiều.”

## Ba nguyên tắc để affiliate không làm hỏng nội dung

## 1. Video truyền cảm hứng, listing cung cấp thông tin sản phẩm

Video AI tạo cảm giác và bối cảnh. Các dữ kiện như giống cây, số lượng hạt, thời gian nảy mầm, điều kiện trồng hoặc chính sách đổi trả phải lấy từ trang sản phẩm thật — không suy ra từ hình ảnh.

## 2. Không hứa kết quả canh tác

Kết quả phụ thuộc khí hậu, đất, cách chăm sóc, chất lượng giống và nhiều biến số khác. Tránh các câu “gieo là lên”, “30 ngày đầy quả” hoặc “ai trồng cũng thành công” nếu không có bằng chứng phù hợp.

## 3. Công khai affiliate gần CTA

Người xem cần biết bạn có thể nhận hoa hồng nếu họ mua qua link. Một disclosure rõ ràng không làm nội dung kém hấp dẫn; nó giúp xây lòng tin lâu dài.

## Workflow 7 bước

## Master Prompt 1 — Tạo Product Truth Sheet

Đây là bước tách thông tin thật khỏi lời quảng cáo trên listing.

Bạn là affiliate product researcher và fact-check editor cho nội dung làm vườn.

Tôi sẽ cung cấp:
- URL hoặc nội dung listing Shopee: [DÁN THÔNG TIN]
- Loại sản phẩm: [HẠT GIỐNG / CÂY GIỐNG / BÌNH TƯỚI / KHAY ƯƠM / DỤNG CỤ]
- Thị trường/người xem: [THÔNG TIN]

Chỉ sử dụng dữ kiện có trong nội dung tôi cung cấp. Không tự đoán, không bổ sung từ trí nhớ.

Hãy tạo PRODUCT_TRUTH_SHEET gồm:
1. Tên sản phẩm và biến thể
2. Đặc tính vật lý có thể xác nhận
3. Thông tin người bán công bố nhưng chưa được xác minh độc lập
4. Điều kiện sử dụng hoặc trồng được nêu rõ
5. Dữ kiện còn thiếu
6. Claim được phép dùng
7. Claim không được dùng
8. Câu hỏi người mua nên kiểm tra trước khi đặt hàng
9. Câu disclosure affiliate ngắn, rõ

Đánh dấu KHÔNG ĐỦ DỮ LIỆU đối với mọi thông tin không xuất hiện trong listing.
Không coi hình ảnh AI, đánh giá ẩn danh hoặc lời quảng cáo tuyệt đối là bằng chứng về kết quả.

## Master Prompt 2 — Xây series garden inspiration

Bạn là creative strategist cho một series video khu vườn chữa lành, nguyên bản và phù hợp nội dung ngắn.

Thông tin đầu vào:
- Khán giả: [KHÁN GIẢ]
- Khí hậu/bối cảnh mong muốn: [BỐI CẢNH]
- Sản phẩm có thể giới thiệu: [SẢN PHẨM]
- Product Truth Sheet: [DÁN TRUTH SHEET]
- Thời lượng: [15–30 GIÂY]
- Tỷ lệ: 9:16

Hãy tạo 15 ý tưởng khác nhau.

Quy tắc:
- Mỗi video có một nghi thức làm vườn chính và một cảm xúc.
- Chỉ tối đa 5/15 video có CTA affiliate.
- Không mô tả kết quả cây trồng như cam kết sản phẩm.
- Không dùng before/after giả làm bằng chứng.
- Không sao chép khu vườn, âm nhạc, nhân vật hoặc shot list của video khác.
- Mỗi ý tưởng phải khác về thời tiết, thời điểm, hành động, loại cây và ngôn ngữ máy quay.

Trả về bảng:
IDEA_ID | HOOK 2 GIÂY | GARDEN_RITUAL | VISUAL_PAYOFF | ASMR_AUDIO | PRODUCT_ROLE | AFFILIATE? | CLAIM_RISK | ENDING_LOOP

Chọn 3 ý tưởng có khả năng xây nhận diện series tốt nhất và giải thích ngắn.

## Master Prompt 3 — Khóa Garden Bible và nhân vật

Bạn là production designer cho series garden cinema nguyên bản.

CONCEPT ĐÃ CHỌN:
[DÁN CONCEPT]

Hãy tạo bộ continuity anchor gồm:

1. GARDENER_IDENTITY_ANCHOR tiếng Anh 80–120 từ:
- người trưởng thành
- khuôn mặt, tóc, trang phục, bảng màu, giày, găng tay, đạo cụ nhận diện

2. GARDEN_MAP:
- vị trí tương đối của căn nhà, luống rau, giàn leo, lối đá, thùng nước và hàng rào

3. BOTANICAL_ANCHOR:
- danh sách tối đa 5 loài cây xuất hiện
- màu lá, kích thước, giai đoạn phát triển và vị trí cố định

4. WEATHER_LIGHT_ANCHOR:
- thời điểm, hướng sáng, độ ẩm, trạng thái mặt đất và màu bầu trời

5. VISUAL_ANCHOR:
- garden cinema chân thực, dịu, giàu chất liệu, không fantasy quá mức

6. AUDIO_ANCHOR:
- âm thanh gần, âm thanh xa, mức gió và những âm thanh bị cấm

7. NEGATIVE_ANCHOR:
- no text, no logo, no watermark, no brand packaging, no impossible fruit, no plant morphing, no extra fingers, no costume change, no garden layout drift, no copyrighted music

Các anchor phải đủ cụ thể để lặp nguyên văn trong mọi prompt Google Flow.

## Master Prompt 4 — Storyboard ngắn có thể nối mượt

Bạn là đạo diễn video dọc garden ASMR.

Ý tưởng: [DÁN Ý TƯỞNG]
Garden Bible + Anchors: [DÁN TÀI LIỆU]
Thời lượng mục tiêu: [15–30 GIÂY]
Số cảnh: [3–5]

Hãy tạo storyboard theo cấu trúc:
1. Hook macro hoặc âm thanh trong 2 giây đầu
2. Hành động chuẩn bị
3. Nghi thức làm vườn chính
4. Visual payoff
5. End frame có thể nối lại opening frame

Quy tắc:
- Mỗi cảnh chỉ có một hành động chính.
- Mỗi cảnh tối đa một chuyển động camera.
- Cây không được lớn lên hoặc ra quả phi thực tế trong vài giây.
- Không đưa bao bì sản phẩm có chữ AI tự sinh vào khung hình.
- Không dùng video làm bằng chứng cho hiệu quả của hạt/cây giống.
- Nếu có sản phẩm affiliate, chỉ mô tả vai trò thật từ Product Truth Sheet.

Trả về bảng:
SCENE_ID | DURATION | FIRST_FRAME | SUBJECT_ACTION | CAMERA | LIGHTING | BOTANICAL_CONTINUITY | ASMR_AUDIO | PRODUCT_VISIBLE? | END_FRAME | TRANSITION

## Master Prompt 5 — Prompt tạo ảnh tham chiếu trong Flow

Bạn là image prompt designer cho Google Flow.

INPUT:
- Garden Bible và toàn bộ anchor: [DÁN]
- Storyboard: [DÁN]
- Tỷ lệ: 9:16

Với từng cảnh, viết KEYFRAME_PROMPT bằng tiếng Anh theo thứ tự:
subject identity → single frozen action → exact garden location → botanical details → foreground/midground/background → camera and lens feeling → weather → lighting → material texture → continuity → aspect ratio → negative anchor

Yêu cầu:
- Lặp nguyên văn Gardener Identity Anchor trong mọi cảnh có nhân vật.
- Lặp đúng tên cây, giai đoạn phát triển và vị trí trong Botanical Anchor.
- Không tạo quả/cây vượt quá mô tả.
- Không có chữ, logo, nhãn hoặc bao bì thương hiệu.
- Không nhắc tên nhiếp ảnh gia, phim hoặc thương hiệu làm chỉ dẫn phong cách.

Trả về:
SCENE_ID | KEYFRAME_PROMPT | REFERENCE_NEEDED | CONTINUITY_CHECK | REJECT_IF

## Master Prompt 6 — Prompt video và âm thanh nguyên bản cho Flow

Bạn là AI film director và ASMR sound designer cho Google Flow.

INPUT:
- Keyframe đã duyệt: [MÔ TẢ/ẢNH THAM CHIẾU]
- Storyboard: [DÁN]
- Tất cả anchor: [DÁN]

Tạo FLOW_VIDEO_PROMPT tiếng Anh cho từng cảnh theo cấu trúc:
A. Continuity: giữ nguyên nhân vật, cây, bố cục và thời tiết từ keyframe
B. Primary motion: một hành động chính có tốc độ, hướng và trọng lượng
C. Secondary motion: tối đa hai chuyển động nhỏ của lá, nước hoặc vải
D. Camera: tĩnh hoặc một chuyển động chậm
E. Plant physics: lá, thân, quả, đất và nước phản ứng thực tế
F. Audio: âm hành động cận + âm môi trường xa; không nhạc có bản quyền
G. First frame và end frame
H. Negative anchor

Quy tắc:
- Không time-lapse nảy mầm hoặc thu hoạch phi thực tế trừ khi ghi rõ là hình ảnh minh họa fantasy.
- Không thay giống cây giữa cảnh.
- Không thêm chữ, watermark hoặc logo.
- Không lấy hoặc mô phỏng một bản nhạc cụ thể từ video khác.
- Ưu tiên âm thanh nguyên bản: nước, lá, đất, chim xa, bước chân, dụng cụ gỗ.

Trả về bảng:
SCENE_ID | FLOW_VIDEO_PROMPT | AUDIO_PRIORITY | FIRST_FRAME | END_FRAME | RETRY_HINT

## Master Prompt 7 — Packaging và CTA affiliate minh bạch

Bạn là content packaging editor cho video garden inspiration có affiliate.

INPUT:
- Nội dung video: [DÁN STORYBOARD]
- Product Truth Sheet: [DÁN]
- Nền tảng đăng: [NỀN TẢNG]

Hãy tạo:
1. 12 tiêu đề ngắn, không dùng số liệu view/thu nhập
2. 5 caption mô tả đúng những gì xuất hiện
3. 5 CTA không gây áp lực mua
4. 3 disclosure affiliate rõ ràng
5. Một mô tả đầy đủ gồm disclosure, lưu ý hình ảnh AI và câu nhắc kiểm tra listing

Quy tắc:
- Không nói sản phẩm trong link đã tạo ra khu vườn trong video nếu chưa thật sự thử nghiệm.
- Không cam kết nảy mầm, năng suất, tốc độ phát triển hoặc độ phù hợp mọi khí hậu.
- Không tạo khan hiếm giả hoặc giá giả.
- Không dùng “link bio” thay cho disclosure.
- CTA chỉ dùng đặc tính có trong Product Truth Sheet.
- Nhắc rõ video là garden inspiration có sử dụng hình ảnh tổng hợp bằng AI.

Chấm từng CTA theo: rõ ràng, trung thực, liên quan và ít gây áp lực. Chọn phương án tốt nhất.

## Bộ prompt mẫu: “Thu hoạch rau thơm sau mưa”

## Cảnh 01 — Giọt nước trên lá

Vertical 9:16 original cinematic garden after a gentle summer rain. Macro close-up of realistic basil leaves at mature but not oversized growth, fixed in the front-left raised bed beside a wet gray stone path. One clear droplet hangs beneath a leaf tip. The warm wooden cottage remains softly out of focus in the upper-right background. Natural botanical proportions, dark moist soil, soft golden late-afternoon light from camera left, subtle humid haze, premium realistic garden cinema, no text, no logo, no brand packaging, no impossible fruit, no plant morphing.

Keep the basil plant, wet stone path and cottage placement identical to the reference frame. One droplet slowly gathers and falls from the basil leaf onto the dark soil; this is the only primary action. Two nearby leaves move slightly in a light breeze. Locked macro camera. Close water drop, faint leaf rustle, distant birds and a quiet wooden wind chime made for this scene, no music. End immediately after the droplet darkens one small point of soil. Avoid plant growth, new leaves, camera shake, text, logos or layout changes.

## Cảnh 02 — Linh bước vào luống rau

Vertical 9:16 original cinematic garden scene. Linh is a 28-year-old Vietnamese gardener with an oval adult face, warm medium skin, dark-brown eyes, black hair in a low practical braid, an indigo linen shirt with rolled sleeves, a soil-brown cross-back apron, dark canvas trousers, tan garden gloves and one small brass pruning tool clipped at the right hip. Linh takes one slow step onto the wet stone path while carrying a shallow woven basket. The raised basil bed stays front-left and the warm wooden cottage stays upper-right. Medium full shot, soft golden light from camera left, realistic wet fabric and stone textures, no text, no logo, no costume change, 9:16.

Preserve Linh's exact adult face, braid, indigo linen shirt, brown apron, gloves, basket and the established garden map. Linh takes one careful step and kneels beside the front-left basil bed; one continuous action. The basket settles with realistic weight. Very slow side tracking movement of a few centimeters. Wet shoe on stone, cloth movement, basket fiber creak, light leaves and distant birds, no music or speech. End with Linh's gloved hand hovering beside one mature basil stem. Avoid extra fingers, costume drift, plant growth, new garden objects or fast camera movement.

## Cảnh 03 — Thu hoạch vừa đủ

Keep Linh and the basil bed identical. Close-up of one tan-gloved hand using the small brass pruning tool to cut a single mature basil stem above a visible leaf node. One precise cutting action only; neighboring leaves respond gently and the plant remains intact. Static camera at plant height, soft late-afternoon rim light, realistic plant and glove texture. Close metal snip, leaf rustle, one soft breath and distant water dripping, no music. End with the cut stem held above the woven basket. No excessive harvest, no instant regrowth, no extra fingers, no text, no logo.

## Cảnh 04 — Kết thúc và CTA

Linh places a small, realistic bundle of freshly cut basil into the shallow woven basket beside the wet stone path. The garden map, cottage, clothing, light direction and plant maturity remain unchanged. One slow placement action, followed by a gentle pause. Static overhead three-quarter shot. Basket fiber, soft leaves, distant birds and fading water drops, no music. End on a composition that includes the same basil leaf position from Scene 01 for a smooth visual loop. No branded seed packet, no exaggerated harvest, no text, no logo and no product-performance implication.

## Caption mẫu

Một buổi chiều sau mưa ở khu vườn nhỏ — chỉ có tiếng lá, đất ẩm và một lần thu hoạch vừa đủ.

Video là garden inspiration có sử dụng hình ảnh tổng hợp bằng AI; không phải minh chứng về kết quả của một loại hạt giống hoặc cây giống cụ thể.

Một số liên kết sản phẩm là affiliate. Nếu bạn mua qua link, mình có thể nhận hoa hồng và giá của bạn không thay đổi. Hãy đọc kỹ thông tin giống, điều kiện trồng, đánh giá người bán và chọn sản phẩm phù hợp khu vực của bạn.

## Checklist trước khi đăng

Video không sử dụng nhạc hoặc âm thanh lấy từ nội dung của người khác.
Đã kiểm tra quyền sử dụng mọi hình ảnh, âm thanh và tài liệu tham chiếu.
Cây, quả và kết quả thu hoạch không bị phóng đại phi thực tế.
Không dùng video AI như bằng chứng cho sản phẩm thật.
CTA chỉ nhắc đặc tính có trong Product Truth Sheet.
Disclosure affiliate nằm gần link hoặc lời kêu gọi hành động.
Có ghi chú hình ảnh/video được tổng hợp bằng AI khi phù hợp.
Không có chữ sai, logo giả hoặc bao bì thương hiệu do AI tạo.
Nhân vật, khu vườn, thời tiết và cây giữ đồng nhất giữa các cảnh.
Mỗi video có một ý tưởng riêng, không chỉ thay loại cây rồi nhân bản hàng loạt.
Người thật đã xem lại toàn bộ video trước khi xuất bản.

## Hệ thống tốt hơn “video hàng loạt”

Listing thật
→ Product Truth Sheet
→ một garden ritual nguyên bản
→ Garden Bible cố định
→ keyframe được duyệt
→ clip Flow có âm thanh nguyên bản
→ kiểm tra continuity và claim
→ disclosure affiliate
→ xuất bản có chọn lọc

ChatGPT giúp biến dữ liệu rời rạc thành một quy trình có cấu trúc. Google Flow giúp tạo hình ảnh, chuyển động và âm thanh cho thế giới đó. Nhưng thứ khiến series có giá trị không phải số lượng clip sản xuất mỗi ngày; đó là khả năng giữ một khu vườn đáng nhớ, một nhịp kể riêng và sự trung thực giữa hình ảnh truyền cảm hứng với sản phẩm thật trong liên kết.$article$,
  $blocks$[{"id":"garden-flow-001","type":"paragraph","text":"Một khu vườn sau mưa có đủ chất liệu để giữ người xem lại chỉ trong vài giây: giọt nước trượt trên lá, đất sẫm màu, tiếng bình tưới chạm vào đá và ánh chiều xuyên qua giàn cây. Đây là kiểu nội dung ngắn có thể kết hợp tự nhiên với sản phẩm làm vườn — nếu người làm không biến hình ảnh AI thành lời hứa sai về hạt giống hoặc cây giống thật."},{"id":"garden-flow-002","type":"paragraph","text":"Trong bài này, chúng ta dùng đúng hai công cụ:"},{"id":"garden-flow-003","type":"paragraph","text":"• ChatGPT: xây concept, garden bible, storyboard, prompt và nội dung affiliate.\n• Google Flow: tạo hình tham chiếu, các clip chuyển động và âm thanh môi trường nguyên bản."},{"id":"garden-flow-004","type":"paragraph","text":"Không cần tải nhạc từ video khác, không cần mua chatbot mẫu và không cần tạo hàng trăm clip gần giống nhau. Mục tiêu là một series có thế giới nhận diện rõ, hình ảnh nhất quán và mỗi video mang lại một khoảnh khắc thư giãn riêng."},{"id":"garden-flow-005","type":"warning","text":"Lưu ý: Cảnh cây trĩu quả do AI tạo chỉ là hình minh họa. Không dùng nó làm bằng chứng rằng sản phẩm hạt giống hoặc cây giống trong link sẽ nảy mầm, phát triển hay cho năng suất giống video."},{"id":"garden-flow-006","type":"heading","text":"Concept mẫu: “Khu Vườn Sau Mưa”"},{"id":"garden-flow-007","type":"paragraph","text":"• Nhân vật: Linh, người làm vườn 28 tuổi, áo linen chàm, tạp dề nâu đất.\n• Bối cảnh: khu vườn nhỏ cạnh căn nhà gỗ, có luống rau cao, giàn leo và lối đá ướt.\n• Nhịp nội dung: chậm, quan sát, không thoại hoặc chỉ một câu rất ngắn.\n• Âm thanh: nước, lá, đất, chim xa và dụng cụ gỗ; không dùng nhạc sao chép.\n• Định dạng: 15–30 giây, dọc 9:16.\n• Sản phẩm phù hợp: bình tưới, găng tay, khay ươm, dụng cụ cầm tay hoặc hạt giống có thông tin listing rõ ràng."},{"id":"garden-flow-008","type":"paragraph","text":"Tập mẫu: “Thu hoạch rau thơm sau cơn mưa chiều.”"},{"id":"garden-flow-009","type":"heading","text":"Ba nguyên tắc để affiliate không làm hỏng nội dung"},{"id":"garden-flow-010","type":"heading","text":"1. Video truyền cảm hứng, listing cung cấp thông tin sản phẩm"},{"id":"garden-flow-011","type":"paragraph","text":"Video AI tạo cảm giác và bối cảnh. Các dữ kiện như giống cây, số lượng hạt, thời gian nảy mầm, điều kiện trồng hoặc chính sách đổi trả phải lấy từ trang sản phẩm thật — không suy ra từ hình ảnh."},{"id":"garden-flow-012","type":"heading","text":"2. Không hứa kết quả canh tác"},{"id":"garden-flow-013","type":"paragraph","text":"Kết quả phụ thuộc khí hậu, đất, cách chăm sóc, chất lượng giống và nhiều biến số khác. Tránh các câu “gieo là lên”, “30 ngày đầy quả” hoặc “ai trồng cũng thành công” nếu không có bằng chứng phù hợp."},{"id":"garden-flow-014","type":"heading","text":"3. Công khai affiliate gần CTA"},{"id":"garden-flow-015","type":"paragraph","text":"Người xem cần biết bạn có thể nhận hoa hồng nếu họ mua qua link. Một disclosure rõ ràng không làm nội dung kém hấp dẫn; nó giúp xây lòng tin lâu dài."},{"id":"garden-flow-016","type":"heading","text":"Workflow 7 bước"},{"id":"garden-flow-017","type":"heading","text":"Master Prompt 1 — Tạo Product Truth Sheet"},{"id":"garden-flow-018","type":"paragraph","text":"Đây là bước tách thông tin thật khỏi lời quảng cáo trên listing."},{"id":"garden-flow-019","type":"prompt","text":"Bạn là affiliate product researcher và fact-check editor cho nội dung làm vườn.\n\nTôi sẽ cung cấp:\n- URL hoặc nội dung listing Shopee: [DÁN THÔNG TIN]\n- Loại sản phẩm: [HẠT GIỐNG / CÂY GIỐNG / BÌNH TƯỚI / KHAY ƯƠM / DỤNG CỤ]\n- Thị trường/người xem: [THÔNG TIN]\n\nChỉ sử dụng dữ kiện có trong nội dung tôi cung cấp. Không tự đoán, không bổ sung từ trí nhớ.\n\nHãy tạo PRODUCT_TRUTH_SHEET gồm:\n1. Tên sản phẩm và biến thể\n2. Đặc tính vật lý có thể xác nhận\n3. Thông tin người bán công bố nhưng chưa được xác minh độc lập\n4. Điều kiện sử dụng hoặc trồng được nêu rõ\n5. Dữ kiện còn thiếu\n6. Claim được phép dùng\n7. Claim không được dùng\n8. Câu hỏi người mua nên kiểm tra trước khi đặt hàng\n9. Câu disclosure affiliate ngắn, rõ\n\nĐánh dấu KHÔNG ĐỦ DỮ LIỆU đối với mọi thông tin không xuất hiện trong listing.\nKhông coi hình ảnh AI, đánh giá ẩn danh hoặc lời quảng cáo tuyệt đối là bằng chứng về kết quả."},{"id":"garden-flow-020","type":"heading","text":"Master Prompt 2 — Xây series garden inspiration"},{"id":"garden-flow-021","type":"prompt","text":"Bạn là creative strategist cho một series video khu vườn chữa lành, nguyên bản và phù hợp nội dung ngắn.\n\nThông tin đầu vào:\n- Khán giả: [KHÁN GIẢ]\n- Khí hậu/bối cảnh mong muốn: [BỐI CẢNH]\n- Sản phẩm có thể giới thiệu: [SẢN PHẨM]\n- Product Truth Sheet: [DÁN TRUTH SHEET]\n- Thời lượng: [15–30 GIÂY]\n- Tỷ lệ: 9:16\n\nHãy tạo 15 ý tưởng khác nhau.\n\nQuy tắc:\n- Mỗi video có một nghi thức làm vườn chính và một cảm xúc.\n- Chỉ tối đa 5/15 video có CTA affiliate.\n- Không mô tả kết quả cây trồng như cam kết sản phẩm.\n- Không dùng before/after giả làm bằng chứng.\n- Không sao chép khu vườn, âm nhạc, nhân vật hoặc shot list của video khác.\n- Mỗi ý tưởng phải khác về thời tiết, thời điểm, hành động, loại cây và ngôn ngữ máy quay.\n\nTrả về bảng:\nIDEA_ID | HOOK 2 GIÂY | GARDEN_RITUAL | VISUAL_PAYOFF | ASMR_AUDIO | PRODUCT_ROLE | AFFILIATE? | CLAIM_RISK | ENDING_LOOP\n\nChọn 3 ý tưởng có khả năng xây nhận diện series tốt nhất và giải thích ngắn."},{"id":"garden-flow-022","type":"heading","text":"Master Prompt 3 — Khóa Garden Bible và nhân vật"},{"id":"garden-flow-023","type":"prompt","text":"Bạn là production designer cho series garden cinema nguyên bản.\n\nCONCEPT ĐÃ CHỌN:\n[DÁN CONCEPT]\n\nHãy tạo bộ continuity anchor gồm:\n\n1. GARDENER_IDENTITY_ANCHOR tiếng Anh 80–120 từ:\n- người trưởng thành\n- khuôn mặt, tóc, trang phục, bảng màu, giày, găng tay, đạo cụ nhận diện\n\n2. GARDEN_MAP:\n- vị trí tương đối của căn nhà, luống rau, giàn leo, lối đá, thùng nước và hàng rào\n\n3. BOTANICAL_ANCHOR:\n- danh sách tối đa 5 loài cây xuất hiện\n- màu lá, kích thước, giai đoạn phát triển và vị trí cố định\n\n4. WEATHER_LIGHT_ANCHOR:\n- thời điểm, hướng sáng, độ ẩm, trạng thái mặt đất và màu bầu trời\n\n5. VISUAL_ANCHOR:\n- garden cinema chân thực, dịu, giàu chất liệu, không fantasy quá mức\n\n6. AUDIO_ANCHOR:\n- âm thanh gần, âm thanh xa, mức gió và những âm thanh bị cấm\n\n7. NEGATIVE_ANCHOR:\n- no text, no logo, no watermark, no brand packaging, no impossible fruit, no plant morphing, no extra fingers, no costume change, no garden layout drift, no copyrighted music\n\nCác anchor phải đủ cụ thể để lặp nguyên văn trong mọi prompt Google Flow."},{"id":"garden-flow-024","type":"heading","text":"Master Prompt 4 — Storyboard ngắn có thể nối mượt"},{"id":"garden-flow-025","type":"prompt","text":"Bạn là đạo diễn video dọc garden ASMR.\n\nÝ tưởng: [DÁN Ý TƯỞNG]\nGarden Bible + Anchors: [DÁN TÀI LIỆU]\nThời lượng mục tiêu: [15–30 GIÂY]\nSố cảnh: [3–5]\n\nHãy tạo storyboard theo cấu trúc:\n1. Hook macro hoặc âm thanh trong 2 giây đầu\n2. Hành động chuẩn bị\n3. Nghi thức làm vườn chính\n4. Visual payoff\n5. End frame có thể nối lại opening frame\n\nQuy tắc:\n- Mỗi cảnh chỉ có một hành động chính.\n- Mỗi cảnh tối đa một chuyển động camera.\n- Cây không được lớn lên hoặc ra quả phi thực tế trong vài giây.\n- Không đưa bao bì sản phẩm có chữ AI tự sinh vào khung hình.\n- Không dùng video làm bằng chứng cho hiệu quả của hạt/cây giống.\n- Nếu có sản phẩm affiliate, chỉ mô tả vai trò thật từ Product Truth Sheet.\n\nTrả về bảng:\nSCENE_ID | DURATION | FIRST_FRAME | SUBJECT_ACTION | CAMERA | LIGHTING | BOTANICAL_CONTINUITY | ASMR_AUDIO | PRODUCT_VISIBLE? | END_FRAME | TRANSITION"},{"id":"garden-flow-026","type":"heading","text":"Master Prompt 5 — Prompt tạo ảnh tham chiếu trong Flow"},{"id":"garden-flow-027","type":"prompt","text":"Bạn là image prompt designer cho Google Flow.\n\nINPUT:\n- Garden Bible và toàn bộ anchor: [DÁN]\n- Storyboard: [DÁN]\n- Tỷ lệ: 9:16\n\nVới từng cảnh, viết KEYFRAME_PROMPT bằng tiếng Anh theo thứ tự:\nsubject identity → single frozen action → exact garden location → botanical details → foreground/midground/background → camera and lens feeling → weather → lighting → material texture → continuity → aspect ratio → negative anchor\n\nYêu cầu:\n- Lặp nguyên văn Gardener Identity Anchor trong mọi cảnh có nhân vật.\n- Lặp đúng tên cây, giai đoạn phát triển và vị trí trong Botanical Anchor.\n- Không tạo quả/cây vượt quá mô tả.\n- Không có chữ, logo, nhãn hoặc bao bì thương hiệu.\n- Không nhắc tên nhiếp ảnh gia, phim hoặc thương hiệu làm chỉ dẫn phong cách.\n\nTrả về:\nSCENE_ID | KEYFRAME_PROMPT | REFERENCE_NEEDED | CONTINUITY_CHECK | REJECT_IF"},{"id":"garden-flow-028","type":"heading","text":"Master Prompt 6 — Prompt video và âm thanh nguyên bản cho Flow"},{"id":"garden-flow-029","type":"prompt","text":"Bạn là AI film director và ASMR sound designer cho Google Flow.\n\nINPUT:\n- Keyframe đã duyệt: [MÔ TẢ/ẢNH THAM CHIẾU]\n- Storyboard: [DÁN]\n- Tất cả anchor: [DÁN]\n\nTạo FLOW_VIDEO_PROMPT tiếng Anh cho từng cảnh theo cấu trúc:\nA. Continuity: giữ nguyên nhân vật, cây, bố cục và thời tiết từ keyframe\nB. Primary motion: một hành động chính có tốc độ, hướng và trọng lượng\nC. Secondary motion: tối đa hai chuyển động nhỏ của lá, nước hoặc vải\nD. Camera: tĩnh hoặc một chuyển động chậm\nE. Plant physics: lá, thân, quả, đất và nước phản ứng thực tế\nF. Audio: âm hành động cận + âm môi trường xa; không nhạc có bản quyền\nG. First frame và end frame\nH. Negative anchor\n\nQuy tắc:\n- Không time-lapse nảy mầm hoặc thu hoạch phi thực tế trừ khi ghi rõ là hình ảnh minh họa fantasy.\n- Không thay giống cây giữa cảnh.\n- Không thêm chữ, watermark hoặc logo.\n- Không lấy hoặc mô phỏng một bản nhạc cụ thể từ video khác.\n- Ưu tiên âm thanh nguyên bản: nước, lá, đất, chim xa, bước chân, dụng cụ gỗ.\n\nTrả về bảng:\nSCENE_ID | FLOW_VIDEO_PROMPT | AUDIO_PRIORITY | FIRST_FRAME | END_FRAME | RETRY_HINT"},{"id":"garden-flow-030","type":"heading","text":"Master Prompt 7 — Packaging và CTA affiliate minh bạch"},{"id":"garden-flow-031","type":"prompt","text":"Bạn là content packaging editor cho video garden inspiration có affiliate.\n\nINPUT:\n- Nội dung video: [DÁN STORYBOARD]\n- Product Truth Sheet: [DÁN]\n- Nền tảng đăng: [NỀN TẢNG]\n\nHãy tạo:\n1. 12 tiêu đề ngắn, không dùng số liệu view/thu nhập\n2. 5 caption mô tả đúng những gì xuất hiện\n3. 5 CTA không gây áp lực mua\n4. 3 disclosure affiliate rõ ràng\n5. Một mô tả đầy đủ gồm disclosure, lưu ý hình ảnh AI và câu nhắc kiểm tra listing\n\nQuy tắc:\n- Không nói sản phẩm trong link đã tạo ra khu vườn trong video nếu chưa thật sự thử nghiệm.\n- Không cam kết nảy mầm, năng suất, tốc độ phát triển hoặc độ phù hợp mọi khí hậu.\n- Không tạo khan hiếm giả hoặc giá giả.\n- Không dùng “link bio” thay cho disclosure.\n- CTA chỉ dùng đặc tính có trong Product Truth Sheet.\n- Nhắc rõ video là garden inspiration có sử dụng hình ảnh tổng hợp bằng AI.\n\nChấm từng CTA theo: rõ ràng, trung thực, liên quan và ít gây áp lực. Chọn phương án tốt nhất."},{"id":"garden-flow-032","type":"heading","text":"Bộ prompt mẫu: “Thu hoạch rau thơm sau mưa”"},{"id":"garden-flow-033","type":"heading","text":"Cảnh 01 — Giọt nước trên lá"},{"id":"garden-flow-034","type":"prompt","text":"Vertical 9:16 original cinematic garden after a gentle summer rain. Macro close-up of realistic basil leaves at mature but not oversized growth, fixed in the front-left raised bed beside a wet gray stone path. One clear droplet hangs beneath a leaf tip. The warm wooden cottage remains softly out of focus in the upper-right background. Natural botanical proportions, dark moist soil, soft golden late-afternoon light from camera left, subtle humid haze, premium realistic garden cinema, no text, no logo, no brand packaging, no impossible fruit, no plant morphing."},{"id":"garden-flow-035","type":"prompt","text":"Keep the basil plant, wet stone path and cottage placement identical to the reference frame. One droplet slowly gathers and falls from the basil leaf onto the dark soil; this is the only primary action. Two nearby leaves move slightly in a light breeze. Locked macro camera. Close water drop, faint leaf rustle, distant birds and a quiet wooden wind chime made for this scene, no music. End immediately after the droplet darkens one small point of soil. Avoid plant growth, new leaves, camera shake, text, logos or layout changes."},{"id":"garden-flow-036","type":"heading","text":"Cảnh 02 — Linh bước vào luống rau"},{"id":"garden-flow-037","type":"prompt","text":"Vertical 9:16 original cinematic garden scene. Linh is a 28-year-old Vietnamese gardener with an oval adult face, warm medium skin, dark-brown eyes, black hair in a low practical braid, an indigo linen shirt with rolled sleeves, a soil-brown cross-back apron, dark canvas trousers, tan garden gloves and one small brass pruning tool clipped at the right hip. Linh takes one slow step onto the wet stone path while carrying a shallow woven basket. The raised basil bed stays front-left and the warm wooden cottage stays upper-right. Medium full shot, soft golden light from camera left, realistic wet fabric and stone textures, no text, no logo, no costume change, 9:16."},{"id":"garden-flow-038","type":"prompt","text":"Preserve Linh's exact adult face, braid, indigo linen shirt, brown apron, gloves, basket and the established garden map. Linh takes one careful step and kneels beside the front-left basil bed; one continuous action. The basket settles with realistic weight. Very slow side tracking movement of a few centimeters. Wet shoe on stone, cloth movement, basket fiber creak, light leaves and distant birds, no music or speech. End with Linh's gloved hand hovering beside one mature basil stem. Avoid extra fingers, costume drift, plant growth, new garden objects or fast camera movement."},{"id":"garden-flow-039","type":"heading","text":"Cảnh 03 — Thu hoạch vừa đủ"},{"id":"garden-flow-040","type":"prompt","text":"Keep Linh and the basil bed identical. Close-up of one tan-gloved hand using the small brass pruning tool to cut a single mature basil stem above a visible leaf node. One precise cutting action only; neighboring leaves respond gently and the plant remains intact. Static camera at plant height, soft late-afternoon rim light, realistic plant and glove texture. Close metal snip, leaf rustle, one soft breath and distant water dripping, no music. End with the cut stem held above the woven basket. No excessive harvest, no instant regrowth, no extra fingers, no text, no logo."},{"id":"garden-flow-041","type":"heading","text":"Cảnh 04 — Kết thúc và CTA"},{"id":"garden-flow-042","type":"prompt","text":"Linh places a small, realistic bundle of freshly cut basil into the shallow woven basket beside the wet stone path. The garden map, cottage, clothing, light direction and plant maturity remain unchanged. One slow placement action, followed by a gentle pause. Static overhead three-quarter shot. Basket fiber, soft leaves, distant birds and fading water drops, no music. End on a composition that includes the same basil leaf position from Scene 01 for a smooth visual loop. No branded seed packet, no exaggerated harvest, no text, no logo and no product-performance implication."},{"id":"garden-flow-043","type":"heading","text":"Caption mẫu"},{"id":"garden-flow-044","type":"prompt","text":"Một buổi chiều sau mưa ở khu vườn nhỏ — chỉ có tiếng lá, đất ẩm và một lần thu hoạch vừa đủ.\n\nVideo là garden inspiration có sử dụng hình ảnh tổng hợp bằng AI; không phải minh chứng về kết quả của một loại hạt giống hoặc cây giống cụ thể.\n\nMột số liên kết sản phẩm là affiliate. Nếu bạn mua qua link, mình có thể nhận hoa hồng và giá của bạn không thay đổi. Hãy đọc kỹ thông tin giống, điều kiện trồng, đánh giá người bán và chọn sản phẩm phù hợp khu vực của bạn."},{"id":"garden-flow-045","type":"heading","text":"Checklist trước khi đăng"},{"id":"garden-flow-046","type":"checklist","text":"Video không sử dụng nhạc hoặc âm thanh lấy từ nội dung của người khác.\nĐã kiểm tra quyền sử dụng mọi hình ảnh, âm thanh và tài liệu tham chiếu.\nCây, quả và kết quả thu hoạch không bị phóng đại phi thực tế.\nKhông dùng video AI như bằng chứng cho sản phẩm thật.\nCTA chỉ nhắc đặc tính có trong Product Truth Sheet.\nDisclosure affiliate nằm gần link hoặc lời kêu gọi hành động.\nCó ghi chú hình ảnh/video được tổng hợp bằng AI khi phù hợp.\nKhông có chữ sai, logo giả hoặc bao bì thương hiệu do AI tạo.\nNhân vật, khu vườn, thời tiết và cây giữ đồng nhất giữa các cảnh.\nMỗi video có một ý tưởng riêng, không chỉ thay loại cây rồi nhân bản hàng loạt.\nNgười thật đã xem lại toàn bộ video trước khi xuất bản."},{"id":"garden-flow-047","type":"heading","text":"Hệ thống tốt hơn “video hàng loạt”"},{"id":"garden-flow-048","type":"code","text":"Listing thật\n→ Product Truth Sheet\n→ một garden ritual nguyên bản\n→ Garden Bible cố định\n→ keyframe được duyệt\n→ clip Flow có âm thanh nguyên bản\n→ kiểm tra continuity và claim\n→ disclosure affiliate\n→ xuất bản có chọn lọc","language":"text"},{"id":"garden-flow-049","type":"paragraph","text":"ChatGPT giúp biến dữ liệu rời rạc thành một quy trình có cấu trúc. Google Flow giúp tạo hình ảnh, chuyển động và âm thanh cho thế giới đó. Nhưng thứ khiến series có giá trị không phải số lượng clip sản xuất mỗi ngày; đó là khả năng giữ một khu vườn đáng nhớ, một nhịp kể riêng và sự trung thực giữa hình ảnh truyền cảm hứng với sản phẩm thật trong liên kết."}]$blocks$::jsonb,
  null,
  'draft',
  'blog',
  'Creative AI',
  'intermediate',
  22,
  '["ChatGPT","Google Flow"]'::jsonb,
  false,
  'Video khu vườn bằng ChatGPT và Google Flow',
  'Hướng dẫn tạo video khu vườn chữa lành với ChatGPT và Google Flow, kèm master prompt giữ cảnh đồng nhất, âm thanh nguyên bản và affiliate minh bạch.',
  'Đội ngũ AINextGen',
  'Nội dung được biên tập và kiểm chứng bởi đội ngũ AINextGen.',
  $sources$[{"label":"Google Flow — công cụ làm phim AI","url":"https://labs.google/fx/tools/flow"},{"label":"OpenAI — hướng dẫn prompting","url":"https://developers.openai.com/api/docs/guides/prompting"},{"label":"Shopee Affiliate Program Việt Nam","url":"https://affiliate.shopee.vn/"},{"label":"YouTube — công khai nội dung tổng hợp hoặc chỉnh sửa","url":"https://support.google.com/youtube/answer/14328491"},{"label":"FTC — công khai quan hệ quảng cáo cho người sáng tạo","url":"https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers"}]$sources$::jsonb,
  timestamptz '2026-08-16 05:00:00+00',
  null,
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  content_blocks = excluded.content_blocks,
  category = excluded.category,
  difficulty = excluded.difficulty,
  duration_minutes = excluded.duration_minutes,
  tools = excluded.tools,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  author_name = excluded.author_name,
  author_bio = excluded.author_bio,
  source_references = excluded.source_references,
  reviewed_at = excluded.reviewed_at,
  updated_at = now()
where existing.status = 'draft';
