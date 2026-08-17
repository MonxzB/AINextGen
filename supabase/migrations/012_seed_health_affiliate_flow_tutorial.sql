-- Seed the editorially rewritten health education + affiliate tutorial as a draft.
-- Safe to run again while the article remains a draft; published content is never overwritten.

insert into public.articles as existing (
  author_id, title, slug, excerpt, content, content_blocks, cover_url, status, article_type,
  category, difficulty, duration_minutes, tools, is_featured, seo_title, seo_description,
  author_name, author_bio, source_references, reviewed_at, published_at, updated_at
) values (
  (select id from public.users where role = 'admin' order by created_at asc limit 1),
  'Tạo video AI giáo dục sức khỏe bằng ChatGPT và Google Flow',
  'tao-video-ai-giao-duc-suc-khoe-chatgpt-google-flow-affiliate',
  'Quy trình tạo video sức khỏe có nhân vật nhất quán, kiểm soát claim và gắn affiliate minh bạch — chỉ với ChatGPT và Google Flow.',
  $article$Một bộ não than phiền vì nhận quá nhiều thông báo. Một trái tim vận hành như phòng điều phối. Một cốc nước xuất hiện đúng lúc “trạm cơ thể” bước vào ca làm việc buổi chiều. Cách nhân hóa kiến thức sức khỏe có thể giúp chủ đề khô trở nên dễ hiểu — nhưng đây cũng là ngách rất dễ trượt sang phóng đại, chẩn đoán hoặc quảng cáo sản phẩm như thuốc chữa bệnh.

Trong hướng dẫn này, chúng ta xây một workflow chỉ với:

• ChatGPT: nghiên cứu theo nguồn được cung cấp, lập bảng claim, viết kịch bản, thiết kế nhân vật và tạo prompt.
• Google Flow: tạo các clip dọc có hình ảnh, chuyển động, thoại ngắn và âm thanh môi trường.

Khác với quy trình “tạo hàng trăm video”, mục tiêu ở đây là xây một series có tiêu chuẩn biên tập. Mỗi tập phải có ý tưởng nguyên bản, claim truy xuất được nguồn và lời giới thiệu affiliate không đánh tráo với tư vấn y tế.

Cảnh báo: Bài này hướng dẫn sản xuất nội dung, không đưa ra chẩn đoán hay phác đồ điều trị. Với triệu chứng, bệnh lý, thuốc hoặc thực phẩm bổ sung, hãy dùng nguồn y khoa phù hợp và mời người có chuyên môn kiểm duyệt trước khi xuất bản.

## Dự án mẫu: “Trạm Điều Phối Cơ Thể”

Để minh họa, ta xây một series hoạt hình 3D nguyên bản:

• Bối cảnh: phòng điều phối tượng trưng bên trong cơ thể một người trưởng thành.
• Nhân vật: các “điều phối viên” lấy cảm hứng từ chức năng cơ thể, không mô phỏng giải phẫu kinh dị.
• Giọng điệu: dí dỏm vừa phải, không hù dọa, không đóng vai bác sĩ.
• Định dạng: video dọc 45–75 giây.
• Tập mẫu: “Ca chiều thiếu nước: bảng điều phối bắt đầu nhấp nháy”.
• Sản phẩm affiliate mẫu: bình nước có vạch nhắc giờ — một sản phẩm hỗ trợ thói quen, không phải thuốc hoặc thực phẩm bổ sung.

## Bốn ranh giới phải khóa trước khi viết

## 1. Giáo dục không phải chẩn đoán

Không suy ra người xem mắc bệnh từ một triệu chứng chung. Tránh các câu như “nếu bạn mệt, gan đang quá tải” hoặc “đau lưng nghĩa là thận yếu”. Một triệu chứng có thể có nhiều nguyên nhân và cần bối cảnh chuyên môn.

## 2. Không biến liên tưởng thành sự thật sinh học

Nhân hóa chỉ là thủ pháp kể chuyện. Khi nói “bộ não đang xin nghỉ”, phần kiến thức phía sau vẫn phải được diễn đạt đúng và không gán cảm xúc hư cấu thành cơ chế y khoa.

## 3. Affiliate phải được công khai

Người xem cần biết bạn có thể nhận hoa hồng từ liên kết. Công khai phải dễ thấy, dùng ngôn ngữ đơn giản và đặt gần lời kêu gọi hành động — không chôn ở cuối phần mô tả.

## 4. Không dùng sản phẩm làm lời giải cho mọi vấn đề

Sản phẩm chỉ nên xuất hiện khi liên quan tự nhiên đến hành vi trong video. Không được chuyển từ một nội dung giáo dục sang kết luận “vì vậy hãy mua sản phẩm này” nếu chưa có căn cứ.

## Workflow 8 bước

## Master Prompt 1 — Lập hồ sơ sản phẩm và vùng claim an toàn

Trước khi nghĩ ý tưởng, hãy bắt ChatGPT tách dữ kiện sản phẩm khỏi câu quảng cáo.

Bạn là biên tập viên kiểm chứng nội dung sức khỏe và affiliate compliance reviewer.

Tôi sẽ cung cấp:
- Tên và loại sản phẩm: [SẢN PHẨM]
- Trang bán hàng chính thức: [URL]
- Tài liệu nhà sản xuất: [DÁN NỘI DUNG]
- Nguồn y khoa/nguồn cơ quan công quyền đã chọn: [DÁN URL HOẶC NỘI DUNG]
- Thị trường và nền tảng đăng: [QUỐC GIA + YOUTUBE/TIKTOK/...]

Nhiệm vụ:
1. Chỉ sử dụng dữ kiện có trong tài liệu tôi cung cấp; không tự bổ sung kiến thức từ trí nhớ.
2. Tạo bảng CLAIM_LEDGER gồm:
   CLAIM | LOẠI CLAIM | NGUỒN HỖ TRỢ | MỨC CHỨNG CỨ | CÁCH DIỄN ĐẠT AN TOÀN | CẤM DÙNG
3. Phân loại từng claim:
   - đặc tính vật lý có thể quan sát
   - hỗ trợ thói quen
   - claim sức khỏe cần nguồn
   - claim điều trị/chẩn đoán không được dùng
4. Đánh dấu mọi từ tuyệt đối như chữa khỏi, thải độc, phục hồi, bảo vệ hoàn toàn, cam kết, chắc chắn.
5. Nếu thiếu bằng chứng, ghi rõ KHÔNG ĐỦ DỮ LIỆU thay vì đoán.
6. Viết một câu công khai affiliate ngắn, rõ và không gây hiểu nhầm.

Không viết kịch bản ở bước này. Chỉ trả về claim ledger, vùng nội dung được phép và danh sách câu bị cấm.

Với bình nước, vùng claim an toàn thường tập trung vào những đặc tính nhìn thấy được: dung tích, chất liệu theo công bố, nắp, vạch đánh dấu và khả năng hỗ trợ người dùng theo dõi thói quen. Không biến nó thành lời hứa chữa đau đầu, cải thiện thận hoặc “thải độc”.

## Master Prompt 2 — Tạo ý tưởng giáo dục trước, sản phẩm sau

Bạn là creative strategist cho series video hoạt hình giáo dục sức khỏe dành cho người trưởng thành.

SERIES CONCEPT:
[DÁN CONCEPT]

CLAIM_LEDGER ĐÃ DUYỆT:
[DÁN CLAIM LEDGER]

Hãy đề xuất 12 ý tưởng video dọc 45–75 giây.

Quy tắc:
- Mỗi video chỉ giải thích một hành vi hoặc khái niệm sức khỏe phổ thông.
- Không chẩn đoán từ triệu chứng.
- Không dùng nỗi sợ bệnh tật để bán hàng.
- Không cho nhân vật mặc áo blouse hoặc tự nhận là bác sĩ.
- Không nhắc sản phẩm ở hook và phần lớn nội dung giáo dục.
- Chỉ 4/12 ý tưởng được phép có CTA affiliate.
- CTA phải dựa trên đặc tính sản phẩm đã có trong claim ledger.
- Mỗi ý tưởng cần khác nhau về tình huống, xung đột và kết thúc; không chỉ thay tên bộ phận cơ thể.

Trả về bảng:
IDEA_ID | HOOK | KIẾN THỨC TRUNG TÂM | ẨN DỤ HOẠT HÌNH | NHÂN VẬT | RỦI RO CLAIM | CÓ AFFILIATE? | CTA AN TOÀN | NGUỒN CẦN KIỂM TRA

Cuối cùng, chọn 3 ý tưởng có giá trị giáo dục cao nhất và giải thích vì sao.

## Master Prompt 3 — Xây Character Bible đồng nhất

Thay vì mô tả lại nhân vật bằng câu khác nhau, hãy tạo một identity anchor và lặp nguyên văn trong tất cả prompt có nhân vật đó.

Bạn là character designer cho một series hoạt hình 3D giáo dục sức khỏe nguyên bản.

Hãy thiết kế tối đa 3 nhân vật dựa trên concept sau:
[DÁN CONCEPT TẬP]

Yêu cầu:
- Nhân vật biểu tượng hóa chức năng cơ thể nhưng không phải mô hình giải phẫu thực tế.
- Dành cho người xem trưởng thành; thân thiện nhưng không quá trẻ con.
- Không giống nhân vật, studio hoặc thương hiệu đã tồn tại.
- Không mặc áo bác sĩ, không cầm dụng cụ y tế nếu không cần thiết.
- Mỗi nhân vật có silhouette, bảng màu, khuôn mặt, trang phục và đạo cụ nhận diện khác nhau.

Trả về:
1. CHARACTER_BIBLE tiếng Việt
2. IDENTITY_ANCHOR tiếng Anh 90–130 từ cho từng nhân vật
3. VOICE_ANCHOR tiếng Anh gồm tuổi giọng, cao độ, tốc độ, năng lượng, accent trung tính và điều phải tránh
4. WORLD_ANCHOR cho phòng điều phối
5. VISUAL_ANCHOR cho toàn series
6. NEGATIVE_ANCHOR gồm no text, no logo, no gore, no medical diagnosis, no white coat, no character drift, no duplicate limbs, no brand packaging

Các anchor phải sẵn sàng để copy nguyên văn vào mọi prompt Google Flow.

## Master Prompt 4 — Viết kịch bản có cổng kiểm chứng

Bạn là health education scriptwriter làm việc dưới sự giám sát của một fact-check editor.

Ý TƯỞNG ĐƯỢC CHỌN:
[DÁN Ý TƯỞNG]

CLAIM_LEDGER:
[DÁN CLAIM LEDGER]

CHARACTER + WORLD + VOICE ANCHOR:
[DÁN ANCHOR]

Hãy viết video dọc dài [45–75] giây, gồm [7–10] cảnh.

Cấu trúc:
1. Hook tình huống trong 3 giây đầu, không hù dọa bệnh tật
2. Vấn đề đời thường
3. Ẩn dụ hoạt hình giải thích khái niệm
4. Hai hành động phổ thông, thận trọng và phù hợp nguồn
5. Tóm tắt không chẩn đoán
6. CTA affiliate tùy chọn, chỉ dùng claim đã duyệt
7. Câu công khai affiliate rõ ràng

Quy tắc:
- Mỗi cảnh chỉ có một hành động hình ảnh chính.
- Mỗi câu thoại tối đa 14 từ để phù hợp clip ngắn.
- Không nói sản phẩm phòng, chữa hoặc giảm bệnh.
- Không so sánh sản phẩm với thuốc.
- Không dùng “bác sĩ khuyên”, “khoa học chứng minh” nếu không có nguồn tương ứng.
- Nếu claim không có trong ledger, thay bằng [CẦN KIỂM CHỨNG] và không đưa vào thoại cuối.
- Có một câu: “Nội dung mang tính giáo dục chung, không thay thế tư vấn y tế.”

Trả về bảng:
SCENE_ID | DURATION | VISUAL_BEAT | DIALOGUE | FACT_ID | SOURCE | PRODUCT_VISIBLE? | DISCLOSURE | TRANSITION

Sau bảng, tạo CLAIM_AUDIT liệt kê từng câu sức khỏe và nguồn hỗ trợ của câu đó.

## Master Prompt 5 — Chuyển kịch bản thành prompt Google Flow

Bạn là AI film director viết prompt cho Google Flow.

INPUT:
- Kịch bản đã qua kiểm chứng: [DÁN KỊCH BẢN]
- Identity, Voice, World, Visual và Negative Anchor: [DÁN ANCHOR]
- Tỷ lệ: 9:16

Tạo một FLOW_VIDEO_PROMPT tiếng Anh cho từng cảnh theo cấu trúc:
A. Lặp nguyên văn IDENTITY_ANCHOR của mọi nhân vật xuất hiện
B. Một hành động chính
C. Biểu cảm và eye line
D. Bối cảnh, foreground, midground, background
E. Một chuyển động camera đơn giản
F. Ánh sáng, màu sắc và vật liệu
G. Thoại chính xác trong dấu ngoặc kép, tối đa một câu
H. Lặp nguyên văn VOICE_ANCHOR nếu cảnh có thoại
I. Âm thanh hành động và môi trường
J. First frame và end frame để nối cảnh
K. Negative anchor

Quy tắc:
- Không tự thêm chữ, subtitle, logo hoặc bao bì thương hiệu.
- Không thêm claim sức khỏe ngoài câu thoại đã duyệt.
- Không thay đổi màu, khuôn mặt, giọng, đạo cụ hoặc tỷ lệ nhân vật.
- Không gore, giải phẫu gây sốc hoặc hình ảnh hù dọa.
- Một clip chỉ có một người nói.
- Nếu câu thoại quá dài, đánh dấu SPLIT thay vì rút gọn làm sai nghĩa.

Trả về:
SCENE_ID | FLOW_VIDEO_PROMPT | FIRST_FRAME | END_FRAME | VOICE_CHECK | CLAIM_CHECK | RETRY_HINT

## Master Prompt 6 — Viết CTA affiliate minh bạch

Bạn là affiliate disclosure editor.

Thông tin sản phẩm:
[DÁN ĐẶC TÍNH ĐƯỢC PHÉP TỪ CLAIM LEDGER]

Ngữ cảnh video:
[DÁN TÓM TẮT]

Hãy tạo 5 CTA, mỗi CTA gồm:
1. Một câu chuyển tiếp tự nhiên từ nội dung giáo dục
2. Một câu mô tả đúng đặc tính sản phẩm, không thêm lợi ích y tế
3. Một câu công khai affiliate rõ ràng
4. Một câu khuyến khích người xem tự xem thông tin và lựa chọn phù hợp

Yêu cầu:
- Không tạo khan hiếm giả, không đếm ngược, không cam kết kết quả.
- Không dùng trải nghiệm cá nhân làm bằng chứng chữa bệnh.
- Không nói “tốt cho gan/thận/tim/não” nếu claim ledger không có bằng chứng phù hợp.
- Không giấu disclosure bằng hashtag mơ hồ.
- Viết tự nhiên, không gây áp lực mua.

Chọn CTA an toàn nhất và giải thích từng claim đã lấy từ dòng nào trong ledger.

Ví dụ CTA cho bình nước:

“Nếu bạn muốn một vật nhắc mình theo dõi thói quen uống nước, mình để mẫu bình có vạch giờ ở mô tả. Đây là liên kết affiliate; nếu bạn mua qua link, mình có thể nhận hoa hồng và giá của bạn không thay đổi. Hãy xem kỹ dung tích, chất liệu và chọn loại phù hợp nhu cầu của bạn.”

## Master Prompt 7 — Kiểm duyệt y tế, nền tảng và nội dung AI

Bạn là senior reviewer phụ trách health accuracy, platform policy và AI disclosure.

Hãy kiểm tra gói nội dung sau:
[DÁN KỊCH BẢN + CLAIM LEDGER + FLOW PROMPTS + CTA + MÔ TẢ VIDEO]

Audit theo 10 nhóm:
1. Chẩn đoán hoặc suy luận bệnh từ triệu chứng
2. Claim điều trị, phòng bệnh, thải độc hoặc phục hồi
3. Claim tuyệt đối hoặc thiếu nguồn
4. Sản phẩm bị trình bày như thuốc
5. Hình ảnh giả dạng bác sĩ/chuyên gia
6. CTA và disclosure affiliate
7. Nội dung AI tổng hợp cần công khai
8. Lỗi đồng nhất nhân vật/giọng nói
9. Câu thoại không khớp nguồn
10. Nội dung lặp lại, sản xuất hàng loạt hoặc thiếu giá trị biên tập

Trả về bảng:
ITEM | PASS/REVISE/REMOVE | RỦI RO | ĐOẠN GỐC | PHIÊN BẢN SỬA | NGUỒN CẦN CÓ | NGƯỜI DUYỆT

Sau bảng, chỉ xuất bản bản FINAL_SCRIPT nếu:
- không còn mục REMOVE
- mọi claim sức khỏe đều có FACT_ID và nguồn
- affiliate disclosure xuất hiện gần CTA
- đã có ghi chú về nội dung AI khi phù hợp

Nếu chưa đạt, ghi BLOCKED và liệt kê chính xác dữ liệu còn thiếu.

## Ví dụ 6 cảnh: “Ca chiều thiếu nước”

Phần ví dụ dưới đây minh họa hình thức kể chuyện, không đặt mục tiêu tư vấn lượng nước cụ thể cho từng người.

## Cảnh 01 — Bảng điều phối nhấp nháy

Vertical 9:16 original cinematic 3D animation inside a rounded body control station. A small teal brain operator with a faceted soft-rubber silhouette, large dark-brown adult eyes, navy utility vest and one silver earpiece sits before a hydration status console made only of abstract blue droplets, with no readable text. The operator notices one amber light pulsing slowly and leans forward once. Medium close-up, subtle camera push-in, clean cyan and warm coral lighting, soft mechanical ambience and one gentle alert tone. In a calm Vietnamese adult voice with medium-low pitch and measured pace, the character says: “Ca chiều rồi, mình kiểm tra lại thói quen uống nước nhé.” No diagnosis, no medical claim, no logo, no text, no gore, no copyrighted character.

## Cảnh 02 — Người dùng bị cuốn vào công việc

Vertical 9:16 original cinematic 3D animation of an adult Vietnamese office worker at a tidy desk, wearing a beige shirt and dark-green trousers, focused on a laptop while an untouched clear water bottle sits within reach. One action only: the worker moves a finished task card aside and pauses. Static side camera, natural afternoon light, muted office ambience, no brand logo and no readable interface text. The narrator says in a neutral educational tone: “Khi tập trung, ta dễ quên những thói quen đơn giản.” Do not imply symptoms, disease, dehydration diagnosis or treatment.

## Cảnh 03 — Trạm điều phối đề xuất một tín hiệu

Return to the identical body control station and repeat the exact teal brain operator identity. The operator presses one round blue reminder button; a single soft droplet icon lights up without text. Overhead three-quarter camera, one slow tilt down, subtle console click and quiet ventilation hum. The character says: “Một tín hiệu dễ thấy có thể giúp bạn nhớ kiểm tra lại.” Keep the statement behavioral and general. No numerical intake recommendation, no diagnosis, no product, no white coat, no medical device.

## Cảnh 04 — Hành động nhỏ

The same adult office worker reaches for the clear bottle, checks it and takes one comfortable sip. One continuous action, realistic hand and liquid physics, close-up at desk height, afternoon window light and soft room tone. The narrator says: “Hãy lắng nghe nhu cầu của cơ thể và điều kiện của chính bạn.” No forced drinking, no quantity claim, no promise of improved organs or symptoms.

## Cảnh 05 — Sản phẩm xuất hiện đúng vai trò

Clean product-neutral shot of a reusable transparent bottle with simple time-marker shapes but no readable words, no logo and no medical imagery, placed beside the laptop. The worker turns the bottle slightly to check its size and lid. Slow five-centimeter side dolly, soft natural light, quiet lid click. The narrator says: “Nếu thích công cụ nhắc thói quen, hãy chọn dung tích và chất liệu phù hợp.” Do not claim detoxification, disease prevention, organ protection or guaranteed hydration.

## Cảnh 06 — Disclosure và kết thúc

The adult office worker places the bottle back within reach and returns calmly to work. The body control station appears as a small imaginative reflection in the bottle, using the same teal and coral palette. Static camera, soft office ambience, no music swell. The narrator says clearly: “Link ở mô tả là affiliate; mình có thể nhận hoa hồng, giá của bạn không đổi.” End with the bottle and worker in a balanced frame. No urgency, no medical outcome, no text, no logo.

## Mô tả video mẫu

Một câu chuyện hoạt hình ngắn về cách tín hiệu môi trường có thể hỗ trợ ta nhớ những thói quen đời thường.

Nội dung mang tính giáo dục chung, không thay thế tư vấn y tế. Nhu cầu của mỗi người có thể khác nhau; nếu bạn có bệnh lý hoặc câu hỏi về sức khỏe, hãy trao đổi với người có chuyên môn phù hợp.

Liên kết sản phẩm trong mô tả là affiliate. Nếu bạn mua qua link, kênh có thể nhận hoa hồng và giá của bạn không thay đổi. Hãy kiểm tra thông tin sản phẩm và lựa chọn theo nhu cầu của bạn.

Video có sử dụng hình ảnh/âm thanh tổng hợp bằng AI.

## Checklist trước khi xuất bản

Mọi câu sức khỏe đều có FACT_ID và nguồn đã mở để kiểm tra.
Không suy luận bệnh từ dấu hiệu chung.
Không dùng “thải độc”, “chữa”, “phục hồi”, “cam kết” nếu không có căn cứ và quyền sử dụng phù hợp.
Sản phẩm không được trình bày như thuốc hoặc thay thế điều trị.
Disclosure affiliate nằm gần CTA và dễ hiểu.
Đã bật khai báo nội dung tổng hợp/chỉnh sửa khi nền tảng yêu cầu.
Không dùng hình ảnh bác sĩ, bệnh nhân hoặc lời chứng thực giả.
Nhân vật, giọng nói và màu sắc đồng nhất qua các clip.
Không có chữ AI sai chính tả, logo hoặc bao bì thương hiệu ngoài ý muốn.
Video có giá trị giáo dục và biên tập riêng, không chỉ thay tên cơ quan để nhân bản hàng loạt.
Có người thật xem lại toàn bộ video trước khi đăng.

## Công thức xây kênh bền vững

Một quy trình đáng tin không phải:

Chọn bệnh phổ biến → tạo nỗi sợ → gắn sản phẩm → nhân bản hàng trăm video

Thay vào đó:

Chọn một câu hỏi đời thường
→ thu thập nguồn đáng tin
→ lập claim ledger
→ viết câu chuyện nguyên bản
→ khóa nhân vật và giọng nói
→ tạo clip trong Flow
→ kiểm duyệt y tế + affiliate + AI disclosure
→ xuất bản và cập nhật khi nguồn thay đổi

ChatGPT giúp chuẩn hóa tư duy và kiểm tra cấu trúc; Google Flow giúp biến kịch bản thành hình ảnh. Trách nhiệm cuối cùng vẫn thuộc về người xuất bản: chọn nguồn, kiểm duyệt claim, công khai lợi ích thương mại và quyết định điều gì đủ an toàn để đưa tới người xem.$article$,
  $blocks$[{"id":"health-flow-001","type":"paragraph","text":"Một bộ não than phiền vì nhận quá nhiều thông báo. Một trái tim vận hành như phòng điều phối. Một cốc nước xuất hiện đúng lúc “trạm cơ thể” bước vào ca làm việc buổi chiều. Cách nhân hóa kiến thức sức khỏe có thể giúp chủ đề khô trở nên dễ hiểu — nhưng đây cũng là ngách rất dễ trượt sang phóng đại, chẩn đoán hoặc quảng cáo sản phẩm như thuốc chữa bệnh."},{"id":"health-flow-002","type":"paragraph","text":"Trong hướng dẫn này, chúng ta xây một workflow chỉ với:"},{"id":"health-flow-003","type":"paragraph","text":"• ChatGPT: nghiên cứu theo nguồn được cung cấp, lập bảng claim, viết kịch bản, thiết kế nhân vật và tạo prompt.\n• Google Flow: tạo các clip dọc có hình ảnh, chuyển động, thoại ngắn và âm thanh môi trường."},{"id":"health-flow-004","type":"paragraph","text":"Khác với quy trình “tạo hàng trăm video”, mục tiêu ở đây là xây một series có tiêu chuẩn biên tập. Mỗi tập phải có ý tưởng nguyên bản, claim truy xuất được nguồn và lời giới thiệu affiliate không đánh tráo với tư vấn y tế."},{"id":"health-flow-005","type":"warning","text":"Cảnh báo: Bài này hướng dẫn sản xuất nội dung, không đưa ra chẩn đoán hay phác đồ điều trị. Với triệu chứng, bệnh lý, thuốc hoặc thực phẩm bổ sung, hãy dùng nguồn y khoa phù hợp và mời người có chuyên môn kiểm duyệt trước khi xuất bản."},{"id":"health-flow-006","type":"heading","text":"Dự án mẫu: “Trạm Điều Phối Cơ Thể”"},{"id":"health-flow-007","type":"paragraph","text":"Để minh họa, ta xây một series hoạt hình 3D nguyên bản:"},{"id":"health-flow-008","type":"paragraph","text":"• Bối cảnh: phòng điều phối tượng trưng bên trong cơ thể một người trưởng thành.\n• Nhân vật: các “điều phối viên” lấy cảm hứng từ chức năng cơ thể, không mô phỏng giải phẫu kinh dị.\n• Giọng điệu: dí dỏm vừa phải, không hù dọa, không đóng vai bác sĩ.\n• Định dạng: video dọc 45–75 giây.\n• Tập mẫu: “Ca chiều thiếu nước: bảng điều phối bắt đầu nhấp nháy”.\n• Sản phẩm affiliate mẫu: bình nước có vạch nhắc giờ — một sản phẩm hỗ trợ thói quen, không phải thuốc hoặc thực phẩm bổ sung."},{"id":"health-flow-009","type":"heading","text":"Bốn ranh giới phải khóa trước khi viết"},{"id":"health-flow-010","type":"heading","text":"1. Giáo dục không phải chẩn đoán"},{"id":"health-flow-011","type":"paragraph","text":"Không suy ra người xem mắc bệnh từ một triệu chứng chung. Tránh các câu như “nếu bạn mệt, gan đang quá tải” hoặc “đau lưng nghĩa là thận yếu”. Một triệu chứng có thể có nhiều nguyên nhân và cần bối cảnh chuyên môn."},{"id":"health-flow-012","type":"heading","text":"2. Không biến liên tưởng thành sự thật sinh học"},{"id":"health-flow-013","type":"paragraph","text":"Nhân hóa chỉ là thủ pháp kể chuyện. Khi nói “bộ não đang xin nghỉ”, phần kiến thức phía sau vẫn phải được diễn đạt đúng và không gán cảm xúc hư cấu thành cơ chế y khoa."},{"id":"health-flow-014","type":"heading","text":"3. Affiliate phải được công khai"},{"id":"health-flow-015","type":"paragraph","text":"Người xem cần biết bạn có thể nhận hoa hồng từ liên kết. Công khai phải dễ thấy, dùng ngôn ngữ đơn giản và đặt gần lời kêu gọi hành động — không chôn ở cuối phần mô tả."},{"id":"health-flow-016","type":"heading","text":"4. Không dùng sản phẩm làm lời giải cho mọi vấn đề"},{"id":"health-flow-017","type":"paragraph","text":"Sản phẩm chỉ nên xuất hiện khi liên quan tự nhiên đến hành vi trong video. Không được chuyển từ một nội dung giáo dục sang kết luận “vì vậy hãy mua sản phẩm này” nếu chưa có căn cứ."},{"id":"health-flow-018","type":"heading","text":"Workflow 8 bước"},{"id":"health-flow-019","type":"heading","text":"Master Prompt 1 — Lập hồ sơ sản phẩm và vùng claim an toàn"},{"id":"health-flow-020","type":"paragraph","text":"Trước khi nghĩ ý tưởng, hãy bắt ChatGPT tách dữ kiện sản phẩm khỏi câu quảng cáo."},{"id":"health-flow-021","type":"prompt","text":"Bạn là biên tập viên kiểm chứng nội dung sức khỏe và affiliate compliance reviewer.\n\nTôi sẽ cung cấp:\n- Tên và loại sản phẩm: [SẢN PHẨM]\n- Trang bán hàng chính thức: [URL]\n- Tài liệu nhà sản xuất: [DÁN NỘI DUNG]\n- Nguồn y khoa/nguồn cơ quan công quyền đã chọn: [DÁN URL HOẶC NỘI DUNG]\n- Thị trường và nền tảng đăng: [QUỐC GIA + YOUTUBE/TIKTOK/...]\n\nNhiệm vụ:\n1. Chỉ sử dụng dữ kiện có trong tài liệu tôi cung cấp; không tự bổ sung kiến thức từ trí nhớ.\n2. Tạo bảng CLAIM_LEDGER gồm:\n   CLAIM | LOẠI CLAIM | NGUỒN HỖ TRỢ | MỨC CHỨNG CỨ | CÁCH DIỄN ĐẠT AN TOÀN | CẤM DÙNG\n3. Phân loại từng claim:\n   - đặc tính vật lý có thể quan sát\n   - hỗ trợ thói quen\n   - claim sức khỏe cần nguồn\n   - claim điều trị/chẩn đoán không được dùng\n4. Đánh dấu mọi từ tuyệt đối như chữa khỏi, thải độc, phục hồi, bảo vệ hoàn toàn, cam kết, chắc chắn.\n5. Nếu thiếu bằng chứng, ghi rõ KHÔNG ĐỦ DỮ LIỆU thay vì đoán.\n6. Viết một câu công khai affiliate ngắn, rõ và không gây hiểu nhầm.\n\nKhông viết kịch bản ở bước này. Chỉ trả về claim ledger, vùng nội dung được phép và danh sách câu bị cấm."},{"id":"health-flow-022","type":"paragraph","text":"Với bình nước, vùng claim an toàn thường tập trung vào những đặc tính nhìn thấy được: dung tích, chất liệu theo công bố, nắp, vạch đánh dấu và khả năng hỗ trợ người dùng theo dõi thói quen. Không biến nó thành lời hứa chữa đau đầu, cải thiện thận hoặc “thải độc”."},{"id":"health-flow-023","type":"heading","text":"Master Prompt 2 — Tạo ý tưởng giáo dục trước, sản phẩm sau"},{"id":"health-flow-024","type":"prompt","text":"Bạn là creative strategist cho series video hoạt hình giáo dục sức khỏe dành cho người trưởng thành.\n\nSERIES CONCEPT:\n[DÁN CONCEPT]\n\nCLAIM_LEDGER ĐÃ DUYỆT:\n[DÁN CLAIM LEDGER]\n\nHãy đề xuất 12 ý tưởng video dọc 45–75 giây.\n\nQuy tắc:\n- Mỗi video chỉ giải thích một hành vi hoặc khái niệm sức khỏe phổ thông.\n- Không chẩn đoán từ triệu chứng.\n- Không dùng nỗi sợ bệnh tật để bán hàng.\n- Không cho nhân vật mặc áo blouse hoặc tự nhận là bác sĩ.\n- Không nhắc sản phẩm ở hook và phần lớn nội dung giáo dục.\n- Chỉ 4/12 ý tưởng được phép có CTA affiliate.\n- CTA phải dựa trên đặc tính sản phẩm đã có trong claim ledger.\n- Mỗi ý tưởng cần khác nhau về tình huống, xung đột và kết thúc; không chỉ thay tên bộ phận cơ thể.\n\nTrả về bảng:\nIDEA_ID | HOOK | KIẾN THỨC TRUNG TÂM | ẨN DỤ HOẠT HÌNH | NHÂN VẬT | RỦI RO CLAIM | CÓ AFFILIATE? | CTA AN TOÀN | NGUỒN CẦN KIỂM TRA\n\nCuối cùng, chọn 3 ý tưởng có giá trị giáo dục cao nhất và giải thích vì sao."},{"id":"health-flow-025","type":"heading","text":"Master Prompt 3 — Xây Character Bible đồng nhất"},{"id":"health-flow-026","type":"paragraph","text":"Thay vì mô tả lại nhân vật bằng câu khác nhau, hãy tạo một identity anchor và lặp nguyên văn trong tất cả prompt có nhân vật đó."},{"id":"health-flow-027","type":"prompt","text":"Bạn là character designer cho một series hoạt hình 3D giáo dục sức khỏe nguyên bản.\n\nHãy thiết kế tối đa 3 nhân vật dựa trên concept sau:\n[DÁN CONCEPT TẬP]\n\nYêu cầu:\n- Nhân vật biểu tượng hóa chức năng cơ thể nhưng không phải mô hình giải phẫu thực tế.\n- Dành cho người xem trưởng thành; thân thiện nhưng không quá trẻ con.\n- Không giống nhân vật, studio hoặc thương hiệu đã tồn tại.\n- Không mặc áo bác sĩ, không cầm dụng cụ y tế nếu không cần thiết.\n- Mỗi nhân vật có silhouette, bảng màu, khuôn mặt, trang phục và đạo cụ nhận diện khác nhau.\n\nTrả về:\n1. CHARACTER_BIBLE tiếng Việt\n2. IDENTITY_ANCHOR tiếng Anh 90–130 từ cho từng nhân vật\n3. VOICE_ANCHOR tiếng Anh gồm tuổi giọng, cao độ, tốc độ, năng lượng, accent trung tính và điều phải tránh\n4. WORLD_ANCHOR cho phòng điều phối\n5. VISUAL_ANCHOR cho toàn series\n6. NEGATIVE_ANCHOR gồm no text, no logo, no gore, no medical diagnosis, no white coat, no character drift, no duplicate limbs, no brand packaging\n\nCác anchor phải sẵn sàng để copy nguyên văn vào mọi prompt Google Flow."},{"id":"health-flow-028","type":"heading","text":"Master Prompt 4 — Viết kịch bản có cổng kiểm chứng"},{"id":"health-flow-029","type":"prompt","text":"Bạn là health education scriptwriter làm việc dưới sự giám sát của một fact-check editor.\n\nÝ TƯỞNG ĐƯỢC CHỌN:\n[DÁN Ý TƯỞNG]\n\nCLAIM_LEDGER:\n[DÁN CLAIM LEDGER]\n\nCHARACTER + WORLD + VOICE ANCHOR:\n[DÁN ANCHOR]\n\nHãy viết video dọc dài [45–75] giây, gồm [7–10] cảnh.\n\nCấu trúc:\n1. Hook tình huống trong 3 giây đầu, không hù dọa bệnh tật\n2. Vấn đề đời thường\n3. Ẩn dụ hoạt hình giải thích khái niệm\n4. Hai hành động phổ thông, thận trọng và phù hợp nguồn\n5. Tóm tắt không chẩn đoán\n6. CTA affiliate tùy chọn, chỉ dùng claim đã duyệt\n7. Câu công khai affiliate rõ ràng\n\nQuy tắc:\n- Mỗi cảnh chỉ có một hành động hình ảnh chính.\n- Mỗi câu thoại tối đa 14 từ để phù hợp clip ngắn.\n- Không nói sản phẩm phòng, chữa hoặc giảm bệnh.\n- Không so sánh sản phẩm với thuốc.\n- Không dùng “bác sĩ khuyên”, “khoa học chứng minh” nếu không có nguồn tương ứng.\n- Nếu claim không có trong ledger, thay bằng [CẦN KIỂM CHỨNG] và không đưa vào thoại cuối.\n- Có một câu: “Nội dung mang tính giáo dục chung, không thay thế tư vấn y tế.”\n\nTrả về bảng:\nSCENE_ID | DURATION | VISUAL_BEAT | DIALOGUE | FACT_ID | SOURCE | PRODUCT_VISIBLE? | DISCLOSURE | TRANSITION\n\nSau bảng, tạo CLAIM_AUDIT liệt kê từng câu sức khỏe và nguồn hỗ trợ của câu đó."},{"id":"health-flow-030","type":"heading","text":"Master Prompt 5 — Chuyển kịch bản thành prompt Google Flow"},{"id":"health-flow-031","type":"prompt","text":"Bạn là AI film director viết prompt cho Google Flow.\n\nINPUT:\n- Kịch bản đã qua kiểm chứng: [DÁN KỊCH BẢN]\n- Identity, Voice, World, Visual và Negative Anchor: [DÁN ANCHOR]\n- Tỷ lệ: 9:16\n\nTạo một FLOW_VIDEO_PROMPT tiếng Anh cho từng cảnh theo cấu trúc:\nA. Lặp nguyên văn IDENTITY_ANCHOR của mọi nhân vật xuất hiện\nB. Một hành động chính\nC. Biểu cảm và eye line\nD. Bối cảnh, foreground, midground, background\nE. Một chuyển động camera đơn giản\nF. Ánh sáng, màu sắc và vật liệu\nG. Thoại chính xác trong dấu ngoặc kép, tối đa một câu\nH. Lặp nguyên văn VOICE_ANCHOR nếu cảnh có thoại\nI. Âm thanh hành động và môi trường\nJ. First frame và end frame để nối cảnh\nK. Negative anchor\n\nQuy tắc:\n- Không tự thêm chữ, subtitle, logo hoặc bao bì thương hiệu.\n- Không thêm claim sức khỏe ngoài câu thoại đã duyệt.\n- Không thay đổi màu, khuôn mặt, giọng, đạo cụ hoặc tỷ lệ nhân vật.\n- Không gore, giải phẫu gây sốc hoặc hình ảnh hù dọa.\n- Một clip chỉ có một người nói.\n- Nếu câu thoại quá dài, đánh dấu SPLIT thay vì rút gọn làm sai nghĩa.\n\nTrả về:\nSCENE_ID | FLOW_VIDEO_PROMPT | FIRST_FRAME | END_FRAME | VOICE_CHECK | CLAIM_CHECK | RETRY_HINT"},{"id":"health-flow-032","type":"heading","text":"Master Prompt 6 — Viết CTA affiliate minh bạch"},{"id":"health-flow-033","type":"prompt","text":"Bạn là affiliate disclosure editor.\n\nThông tin sản phẩm:\n[DÁN ĐẶC TÍNH ĐƯỢC PHÉP TỪ CLAIM LEDGER]\n\nNgữ cảnh video:\n[DÁN TÓM TẮT]\n\nHãy tạo 5 CTA, mỗi CTA gồm:\n1. Một câu chuyển tiếp tự nhiên từ nội dung giáo dục\n2. Một câu mô tả đúng đặc tính sản phẩm, không thêm lợi ích y tế\n3. Một câu công khai affiliate rõ ràng\n4. Một câu khuyến khích người xem tự xem thông tin và lựa chọn phù hợp\n\nYêu cầu:\n- Không tạo khan hiếm giả, không đếm ngược, không cam kết kết quả.\n- Không dùng trải nghiệm cá nhân làm bằng chứng chữa bệnh.\n- Không nói “tốt cho gan/thận/tim/não” nếu claim ledger không có bằng chứng phù hợp.\n- Không giấu disclosure bằng hashtag mơ hồ.\n- Viết tự nhiên, không gây áp lực mua.\n\nChọn CTA an toàn nhất và giải thích từng claim đã lấy từ dòng nào trong ledger."},{"id":"health-flow-034","type":"paragraph","text":"Ví dụ CTA cho bình nước:"},{"id":"health-flow-035","type":"warning","text":"“Nếu bạn muốn một vật nhắc mình theo dõi thói quen uống nước, mình để mẫu bình có vạch giờ ở mô tả. Đây là liên kết affiliate; nếu bạn mua qua link, mình có thể nhận hoa hồng và giá của bạn không thay đổi. Hãy xem kỹ dung tích, chất liệu và chọn loại phù hợp nhu cầu của bạn.”"},{"id":"health-flow-036","type":"heading","text":"Master Prompt 7 — Kiểm duyệt y tế, nền tảng và nội dung AI"},{"id":"health-flow-037","type":"prompt","text":"Bạn là senior reviewer phụ trách health accuracy, platform policy và AI disclosure.\n\nHãy kiểm tra gói nội dung sau:\n[DÁN KỊCH BẢN + CLAIM LEDGER + FLOW PROMPTS + CTA + MÔ TẢ VIDEO]\n\nAudit theo 10 nhóm:\n1. Chẩn đoán hoặc suy luận bệnh từ triệu chứng\n2. Claim điều trị, phòng bệnh, thải độc hoặc phục hồi\n3. Claim tuyệt đối hoặc thiếu nguồn\n4. Sản phẩm bị trình bày như thuốc\n5. Hình ảnh giả dạng bác sĩ/chuyên gia\n6. CTA và disclosure affiliate\n7. Nội dung AI tổng hợp cần công khai\n8. Lỗi đồng nhất nhân vật/giọng nói\n9. Câu thoại không khớp nguồn\n10. Nội dung lặp lại, sản xuất hàng loạt hoặc thiếu giá trị biên tập\n\nTrả về bảng:\nITEM | PASS/REVISE/REMOVE | RỦI RO | ĐOẠN GỐC | PHIÊN BẢN SỬA | NGUỒN CẦN CÓ | NGƯỜI DUYỆT\n\nSau bảng, chỉ xuất bản bản FINAL_SCRIPT nếu:\n- không còn mục REMOVE\n- mọi claim sức khỏe đều có FACT_ID và nguồn\n- affiliate disclosure xuất hiện gần CTA\n- đã có ghi chú về nội dung AI khi phù hợp\n\nNếu chưa đạt, ghi BLOCKED và liệt kê chính xác dữ liệu còn thiếu."},{"id":"health-flow-038","type":"heading","text":"Ví dụ 6 cảnh: “Ca chiều thiếu nước”"},{"id":"health-flow-039","type":"paragraph","text":"Phần ví dụ dưới đây minh họa hình thức kể chuyện, không đặt mục tiêu tư vấn lượng nước cụ thể cho từng người."},{"id":"health-flow-040","type":"heading","text":"Cảnh 01 — Bảng điều phối nhấp nháy"},{"id":"health-flow-041","type":"prompt","text":"Vertical 9:16 original cinematic 3D animation inside a rounded body control station. A small teal brain operator with a faceted soft-rubber silhouette, large dark-brown adult eyes, navy utility vest and one silver earpiece sits before a hydration status console made only of abstract blue droplets, with no readable text. The operator notices one amber light pulsing slowly and leans forward once. Medium close-up, subtle camera push-in, clean cyan and warm coral lighting, soft mechanical ambience and one gentle alert tone. In a calm Vietnamese adult voice with medium-low pitch and measured pace, the character says: “Ca chiều rồi, mình kiểm tra lại thói quen uống nước nhé.” No diagnosis, no medical claim, no logo, no text, no gore, no copyrighted character."},{"id":"health-flow-042","type":"heading","text":"Cảnh 02 — Người dùng bị cuốn vào công việc"},{"id":"health-flow-043","type":"prompt","text":"Vertical 9:16 original cinematic 3D animation of an adult Vietnamese office worker at a tidy desk, wearing a beige shirt and dark-green trousers, focused on a laptop while an untouched clear water bottle sits within reach. One action only: the worker moves a finished task card aside and pauses. Static side camera, natural afternoon light, muted office ambience, no brand logo and no readable interface text. The narrator says in a neutral educational tone: “Khi tập trung, ta dễ quên những thói quen đơn giản.” Do not imply symptoms, disease, dehydration diagnosis or treatment."},{"id":"health-flow-044","type":"heading","text":"Cảnh 03 — Trạm điều phối đề xuất một tín hiệu"},{"id":"health-flow-045","type":"prompt","text":"Return to the identical body control station and repeat the exact teal brain operator identity. The operator presses one round blue reminder button; a single soft droplet icon lights up without text. Overhead three-quarter camera, one slow tilt down, subtle console click and quiet ventilation hum. The character says: “Một tín hiệu dễ thấy có thể giúp bạn nhớ kiểm tra lại.” Keep the statement behavioral and general. No numerical intake recommendation, no diagnosis, no product, no white coat, no medical device."},{"id":"health-flow-046","type":"heading","text":"Cảnh 04 — Hành động nhỏ"},{"id":"health-flow-047","type":"prompt","text":"The same adult office worker reaches for the clear bottle, checks it and takes one comfortable sip. One continuous action, realistic hand and liquid physics, close-up at desk height, afternoon window light and soft room tone. The narrator says: “Hãy lắng nghe nhu cầu của cơ thể và điều kiện của chính bạn.” No forced drinking, no quantity claim, no promise of improved organs or symptoms."},{"id":"health-flow-048","type":"heading","text":"Cảnh 05 — Sản phẩm xuất hiện đúng vai trò"},{"id":"health-flow-049","type":"prompt","text":"Clean product-neutral shot of a reusable transparent bottle with simple time-marker shapes but no readable words, no logo and no medical imagery, placed beside the laptop. The worker turns the bottle slightly to check its size and lid. Slow five-centimeter side dolly, soft natural light, quiet lid click. The narrator says: “Nếu thích công cụ nhắc thói quen, hãy chọn dung tích và chất liệu phù hợp.” Do not claim detoxification, disease prevention, organ protection or guaranteed hydration."},{"id":"health-flow-050","type":"heading","text":"Cảnh 06 — Disclosure và kết thúc"},{"id":"health-flow-051","type":"prompt","text":"The adult office worker places the bottle back within reach and returns calmly to work. The body control station appears as a small imaginative reflection in the bottle, using the same teal and coral palette. Static camera, soft office ambience, no music swell. The narrator says clearly: “Link ở mô tả là affiliate; mình có thể nhận hoa hồng, giá của bạn không đổi.” End with the bottle and worker in a balanced frame. No urgency, no medical outcome, no text, no logo."},{"id":"health-flow-052","type":"heading","text":"Mô tả video mẫu"},{"id":"health-flow-053","type":"prompt","text":"Một câu chuyện hoạt hình ngắn về cách tín hiệu môi trường có thể hỗ trợ ta nhớ những thói quen đời thường.\n\nNội dung mang tính giáo dục chung, không thay thế tư vấn y tế. Nhu cầu của mỗi người có thể khác nhau; nếu bạn có bệnh lý hoặc câu hỏi về sức khỏe, hãy trao đổi với người có chuyên môn phù hợp.\n\nLiên kết sản phẩm trong mô tả là affiliate. Nếu bạn mua qua link, kênh có thể nhận hoa hồng và giá của bạn không thay đổi. Hãy kiểm tra thông tin sản phẩm và lựa chọn theo nhu cầu của bạn.\n\nVideo có sử dụng hình ảnh/âm thanh tổng hợp bằng AI."},{"id":"health-flow-054","type":"heading","text":"Checklist trước khi xuất bản"},{"id":"health-flow-055","type":"checklist","text":"Mọi câu sức khỏe đều có FACT_ID và nguồn đã mở để kiểm tra.\nKhông suy luận bệnh từ dấu hiệu chung.\nKhông dùng “thải độc”, “chữa”, “phục hồi”, “cam kết” nếu không có căn cứ và quyền sử dụng phù hợp.\nSản phẩm không được trình bày như thuốc hoặc thay thế điều trị.\nDisclosure affiliate nằm gần CTA và dễ hiểu.\nĐã bật khai báo nội dung tổng hợp/chỉnh sửa khi nền tảng yêu cầu.\nKhông dùng hình ảnh bác sĩ, bệnh nhân hoặc lời chứng thực giả.\nNhân vật, giọng nói và màu sắc đồng nhất qua các clip.\nKhông có chữ AI sai chính tả, logo hoặc bao bì thương hiệu ngoài ý muốn.\nVideo có giá trị giáo dục và biên tập riêng, không chỉ thay tên cơ quan để nhân bản hàng loạt.\nCó người thật xem lại toàn bộ video trước khi đăng."},{"id":"health-flow-056","type":"heading","text":"Công thức xây kênh bền vững"},{"id":"health-flow-057","type":"paragraph","text":"Một quy trình đáng tin không phải:"},{"id":"health-flow-058","type":"code","text":"Chọn bệnh phổ biến → tạo nỗi sợ → gắn sản phẩm → nhân bản hàng trăm video","language":"text"},{"id":"health-flow-059","type":"paragraph","text":"Thay vào đó:"},{"id":"health-flow-060","type":"code","text":"Chọn một câu hỏi đời thường\n→ thu thập nguồn đáng tin\n→ lập claim ledger\n→ viết câu chuyện nguyên bản\n→ khóa nhân vật và giọng nói\n→ tạo clip trong Flow\n→ kiểm duyệt y tế + affiliate + AI disclosure\n→ xuất bản và cập nhật khi nguồn thay đổi","language":"text"},{"id":"health-flow-061","type":"paragraph","text":"ChatGPT giúp chuẩn hóa tư duy và kiểm tra cấu trúc; Google Flow giúp biến kịch bản thành hình ảnh. Trách nhiệm cuối cùng vẫn thuộc về người xuất bản: chọn nguồn, kiểm duyệt claim, công khai lợi ích thương mại và quyết định điều gì đủ an toàn để đưa tới người xem."}]$blocks$::jsonb,
  null,
  'draft',
  'blog',
  'Creative AI',
  'advanced',
  28,
  '["ChatGPT","Google Flow"]'::jsonb,
  false,
  'Video AI sức khỏe bằng ChatGPT và Google Flow',
  'Tạo video AI giáo dục sức khỏe với ChatGPT và Google Flow, kèm master prompt kiểm chứng claim, giữ nhân vật đồng nhất và làm affiliate minh bạch.',
  'Đội ngũ AINextGen',
  'Nội dung được biên tập và kiểm chứng bởi đội ngũ AINextGen.',
  $sources$[{"label":"Google Flow — công cụ làm phim AI","url":"https://labs.google/fx/tools/flow"},{"label":"OpenAI — hướng dẫn prompting","url":"https://developers.openai.com/api/docs/guides/prompting"},{"label":"YouTube — chính sách thông tin y tế sai lệch","url":"https://support.google.com/youtube/answer/13813322"},{"label":"YouTube — công khai nội dung tổng hợp hoặc chỉnh sửa","url":"https://support.google.com/youtube/answer/14328491"},{"label":"YouTube — quảng cáo trả phí và tài trợ","url":"https://support.google.com/youtube/answer/154235"},{"label":"FTC — công khai quan hệ quảng cáo cho người sáng tạo","url":"https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers"},{"label":"Video tham khảo ban đầu","url":"https://www.youtube.com/watch?v=LUF56HURU5c"}]$sources$::jsonb,
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
