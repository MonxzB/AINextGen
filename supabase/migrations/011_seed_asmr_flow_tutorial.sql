-- Seed the editorially rewritten ChatGPT + Google Flow ASMR tutorial as a draft.
-- Safe to run again while the article remains a draft; published content is never overwritten.

insert into public.articles as existing (
  author_id, title, slug, excerpt, content, content_blocks, cover_url, status, article_type,
  category, difficulty, duration_minutes, tools, is_featured, seo_title, seo_description,
  author_name, author_bio, source_references, reviewed_at, published_at, updated_at
) values (
  (select id from public.users where role = 'admin' order by created_at asc limit 1),
  'Tạo video ASMR hoạt hình chữa lành bằng ChatGPT và Google Flow',
  'tao-video-asmr-hoat-hinh-chatgpt-google-flow',
  'Quy trình gọn từ ý tưởng, kịch bản, bộ nhận diện nhân vật đến prompt tạo ảnh và video ASMR đồng nhất — chỉ với ChatGPT và Google Flow.',
  $article$Video ASMR hoạt hình hấp dẫn không chỉ vì hình ảnh đẹp. Thứ giữ người xem ở lại là một thế giới có nhịp điệu riêng: tiếng mưa chạm mái ngói, bột bánh được nhào chậm rãi, ánh lửa phản chiếu trên đồ gốm và một câu chuyện rất nhỏ được kể mà không cần lời thoại.

Trong hướng dẫn này, chúng ta sẽ xây dựng toàn bộ quy trình chỉ với hai công cụ:

• ChatGPT: phát triển ý tưởng, “series bible”, kịch bản, shot list và prompt.
• Google Flow: tạo hình tham chiếu, tạo clip chuyển động và sắp xếp các cảnh thành video.

Mục tiêu không phải sao chép một bộ phim hoặc nhân vật nổi tiếng. Ta sẽ tạo một thế giới nguyên bản, dùng ngôn ngữ hình ảnh hoạt hình vẽ tay ấm áp, giàu chất liệu và có khả năng phát triển thành series lâu dài.

Lưu ý: AI không bảo đảm lượt xem hoặc thu nhập. YouTube đánh giá tính nguyên bản và giá trị thực sự của nội dung. Việc tạo hàng loạt video gần như giống nhau có thể làm kênh khó phát triển hoặc không đủ điều kiện kiếm tiền.

## Thành phẩm chúng ta sẽ tạo

Ví dụ xuyên suốt bài là series “Tiệm Bánh Trăng Mưa”:

• Nhân vật chính: An, thợ làm bánh 24 tuổi, tóc đen búi thấp, tạp dề xanh rêu.
• Bạn đồng hành: Mun, mèo nhỏ màu than, mắt hổ phách.
• Bối cảnh: tiệm bánh gỗ nằm bên rìa khu rừng, hoạt động vào những đêm mưa.
• Cảm xúc: ấm áp, yên tĩnh, chữa lành, không lời thoại.
• Âm thanh: mưa, bếp lửa, đồ gốm, giấy gói bánh, tiếng bước chân và tiếng mèo rất nhẹ.

Video đầu tiên: “Một đêm mưa ở tiệm bánh: An làm bánh sữa cho vị khách đến muộn.”

## Vì sao video AI thường bị rời rạc?

Ba lỗi phổ biến nhất là:

1. Nhân vật đổi khuôn mặt, quần áo hoặc tỷ lệ giữa các cảnh.
2. Mỗi prompt dùng một phong cách khác nhau nên video giống tập hợp clip ngẫu nhiên.
3. Cảnh có quá nhiều hành động, khiến chuyển động lỗi và âm thanh hỗn loạn.

Cách khắc phục là khóa ba lớp trước khi tạo bất kỳ hình ảnh nào:

• Identity Anchor: mô tả nhân vật cố định.
• Visual Anchor: bảng màu, chất liệu, ánh sáng và ngôn ngữ máy quay cố định.
• Audio Anchor: nhóm âm thanh xuyên suốt và những thứ không được xuất hiện.

## Quy trình 7 bước

## Bước 1: Chọn một “nghi thức ASMR” nhỏ

Đừng bắt đầu bằng một cốt truyện quá lớn. Hãy chọn một hoạt động có âm thanh và chuyển động dễ cảm nhận:

• Làm bánh trong đêm mưa.
• Pha trà bên cửa sổ mùa đông.
• Sửa đồ gốm trong căn phòng đầy nắng.
• Chuẩn bị hộp cơm cho chuyến tàu sớm.
• Chăm sóc một khu vườn tí hon sau cơn bão.

Mỗi video chỉ nên có một mục tiêu cảm xúc và một hành động trung tâm.

## Bước 2: Dùng ChatGPT tạo “series bible”

Series bible là tài liệu gốc để mọi video giữ cùng thế giới, nhân vật và cảm giác. Sau khi tạo xong, hãy lưu lại và đưa vào đầu mỗi phiên làm việc mới.

## Master Prompt 1 — Xây concept series nguyên bản

Bạn là creative director chuyên phát triển series hoạt hình ASMR không lời thoại.

Hãy xây dựng một concept series nguyên bản dựa trên thông tin sau:
- Khán giả: [KHÁN GIẢ MỤC TIÊU]
- Cảm xúc chính: [CHỮA LÀNH / ẤM ÁP / KỲ ẢO / HOÀI NIỆM]
- Hoạt động ASMR trung tâm: [LÀM BÁNH / PHA TRÀ / LÀM GỐM / LÀM VƯỜN]
- Thời lượng mỗi video: [SỐ PHÚT]
- Tỷ lệ khung hình: [16:9 hoặc 9:16]

Yêu cầu bắt buộc:
1. Tạo thế giới, nhân vật và câu chuyện hoàn toàn nguyên bản.
2. Không dùng tên studio, bộ phim hoặc nhân vật có bản quyền làm chỉ dẫn phong cách.
3. Không có lời thoại, thuyết minh hoặc chữ trên màn hình.
4. Mỗi tập phải có một nghi thức đời thường rõ ràng và một thay đổi cảm xúc nhỏ.
5. Thiết kế phải đủ đơn giản để giữ nhân vật đồng nhất qua nhiều cảnh AI.

Trả về theo cấu trúc:
A. Tên series và lời hứa nội dung trong một câu
B. Mô tả thế giới
C. Hồ sơ tối đa 2 nhân vật chính
D. Visual Anchor cố định
E. Audio Anchor cố định
F. 10 ý tưởng tập đầu tiên, mỗi ý tưởng gồm hook hình ảnh, hành động ASMR và đoạn kết cảm xúc
G. Danh sách yếu tố tuyệt đối không thay đổi giữa các tập

## Bước 3: Khóa nhân vật và phong cách

Sau khi ChatGPT trả kết quả, hãy yêu cầu rút gọn thành một khối mô tả có thể lặp nguyên văn trong mọi prompt.

## Master Prompt 2 — Tạo Identity Anchor và Visual Anchor

Dựa trên series bible bên dưới, hãy tạo bộ khóa đồng nhất để dùng cho công cụ tạo ảnh/video AI.

[DÁN SERIES BIBLE]

Hãy trả về đúng 5 phần:

1. CHARACTER_ANCHOR:
- Viết một đoạn tiếng Anh 70–110 từ.
- Mô tả tuổi trưởng thành, khuôn mặt, tóc, trang phục, màu sắc, tỷ lệ cơ thể và một đạo cụ nhận diện.
- Chỉ mô tả những chi tiết có thể nhìn thấy.

2. COMPANION_ANCHOR:
- Viết một đoạn tiếng Anh 30–60 từ cho nhân vật phụ hoặc thú đồng hành.

3. WORLD_ANCHOR:
- Mô tả kiến trúc, vật liệu, thời tiết và các đồ vật luôn có trong bối cảnh.

4. VISUAL_ANCHOR:
- Phong cách hoạt hình vẽ tay nguyên bản, màu nước mềm, nét chì hữu hình, ánh sáng điện ảnh dịu, chất liệu thủ công.
- Không nhắc tên họa sĩ, studio, phim hoặc thương hiệu.

5. NEGATIVE_ANCHOR:
- no text, no logo, no watermark, no extra fingers, no duplicate character, no costume change, no face drift, no modern plastic objects, no abrupt lighting change

Các anchor phải sẵn sàng để copy nguyên văn vào mọi prompt tiếp theo.

Với dự án mẫu, Visual Anchor có thể là:

Original cozy hand-painted animated film aesthetic, soft watercolor backgrounds, visible graphite linework, tactile wood and ceramic textures, warm amber practical light against deep indigo rain, restrained natural motion, cinematic composition, peaceful handcrafted atmosphere, consistent character proportions, no text, no logo, no copyrighted characters.

## Bước 4: Viết kịch bản theo cảnh

Một clip AI nên tập trung vào một hành động chính. Thay vì yêu cầu “An mở cửa, chạy vào bếp, nhào bột và nướng bánh”, hãy chia thành bốn cảnh ngắn.

## Master Prompt 3 — Kịch bản ASMR và shot list

Bạn là đạo diễn hoạt hình và sound designer cho video ASMR không lời thoại.

Thông tin dự án:
- Tên tập: [TÊN TẬP]
- Thời lượng mục tiêu: [THỜI LƯỢNG]
- Số cảnh: [SỐ CẢNH]
- Tỷ lệ: [16:9 hoặc 9:16]

SERIES BIBLE:
[DÁN SERIES BIBLE]

IDENTITY + VISUAL + AUDIO ANCHOR:
[DÁN CÁC ANCHOR]

Hãy viết một câu chuyện có cấu trúc:
1. Hook thị giác trong 5 giây đầu
2. Chuẩn bị
3. Nghi thức ASMR chính
4. Một trục trặc nhỏ, hiền hòa
5. Khoảnh khắc giải quyết
6. Cảnh kết tạo cảm giác trọn vẹn và có thể lặp mượt

Quy tắc:
- Không lời thoại, không narration, không chữ trên màn hình.
- Mỗi cảnh chỉ có một hành động chính và tối đa một chuyển động camera.
- Ưu tiên cận cảnh bàn tay, chất liệu, hơi nước, nước mưa, lửa và đồ gốm.
- Chuyển động phải chậm, có trọng lượng và phù hợp vật lý.
- Không tự thêm nhân vật ngoài series bible.

Trả về bảng gồm:
SCENE_ID | DURATION | STORY_BEAT | SUBJECT_ACTION | ENVIRONMENT | SHOT_SIZE | CAMERA | LIGHTING | ASMR_AUDIO | TRANSITION | CONTINUITY_NOTES

Sau bảng, viết thêm:
- Một câu tóm tắt nhịp cảm xúc của cả video
- Ba cảnh quan trọng nhất cần tạo hình tham chiếu trước
- Danh sách âm thanh phải giữ ổn định xuyên suốt

## Bước 5: Chuyển shot list thành prompt tạo ảnh trong Flow

Tạo ảnh khóa cho các cảnh quan trọng trước. Khi đã có hình nhân vật và bối cảnh đúng ý, dùng chúng làm tham chiếu cho các cảnh tiếp theo nếu chế độ Flow bạn đang dùng hỗ trợ ảnh tham chiếu.

## Master Prompt 4 — Prompt tạo ảnh cho Google Flow

Bạn là prompt designer cho Google Flow.

Nhiệm vụ: chuyển shot list thành prompt tạo ảnh nhất quán. Prompt cuối cùng phải viết bằng tiếng Anh, còn ghi chú giải thích viết bằng tiếng Việt.

CHARACTER_ANCHOR:
[DÁN NGUYÊN VĂN]

COMPANION_ANCHOR:
[DÁN NGUYÊN VĂN]

WORLD_ANCHOR:
[DÁN NGUYÊN VĂN]

VISUAL_ANCHOR:
[DÁN NGUYÊN VĂN]

NEGATIVE_ANCHOR:
[DÁN NGUYÊN VĂN]

SHOT LIST:
[DÁN SHOT LIST]

Với từng cảnh, trả về:
1. SCENE_ID
2. KEYFRAME_PROMPT — một đoạn tiếng Anh 120–180 từ theo thứ tự:
   subject identity → single frozen action → environment → foreground/midground/background → shot size → camera angle → lighting → color → material texture → continuity → aspect ratio
3. NEGATIVE_PROMPT
4. REFERENCE_NEEDED — ghi rõ nên dùng ảnh nhân vật, bối cảnh hay cả hai
5. CONSISTENCY_CHECK — 3 chi tiết phải đối chiếu với cảnh trước

Không dùng các cụm mơ hồ như “beautiful”, “masterpiece”, “best quality” nếu không mô tả bằng chi tiết nhìn thấy được.
Không nhắc tên studio, phim, họa sĩ hoặc nhân vật có bản quyền.

## Bước 6: Tạo prompt chuyển động và âm thanh trong Flow

Prompt video tốt cần nói rõ: vật gì chuyển động, chuyển động ra sao, máy quay làm gì và âm thanh nào nằm gần micro.

## Master Prompt 5 — Prompt image-to-video/text-to-video cho Flow

Bạn là AI film director chuyên viết prompt video ngắn có chuyển động tự nhiên và âm thanh ASMR.

INPUT:
- Shot list: [DÁN SHOT LIST]
- Các anchor cố định: [DÁN ANCHOR]
- Prompt ảnh/keyframe đã duyệt: [DÁN PROMPT HOẶC MÔ TẢ ẢNH]

Hãy tạo một VIDEO_PROMPT bằng tiếng Anh cho từng cảnh.

Cấu trúc bắt buộc của mỗi prompt:
A. Continuity: nhân vật, trang phục, đạo cụ và ánh sáng phải giữ nguyên từ keyframe
B. Primary motion: chỉ một hành động chính, mô tả tốc độ, hướng và trọng lượng
C. Secondary motion: tối đa hai chuyển động môi trường rất nhẹ
D. Camera: một chuyển động đơn giản hoặc camera tĩnh
E. Physics: mô tả phản ứng vật liệu như bột, hơi nước, vải, mưa hoặc lửa
F. Audio: âm thanh cận, âm nền xa và khoảng lặng
G. Ending frame: tư thế kết thúc giúp nối sang cảnh tiếp theo
H. Avoid: lỗi chuyển động và yếu tố không mong muốn

Quy tắc:
- Không thoại, không narration, không nhạc nền.
- Không jump cut trong cùng một clip.
- Không biến đổi khuôn mặt, trang phục, đạo cụ hoặc kiến trúc.
- Không thêm người hoặc động vật mới.
- Không camera bay nhanh, rung mạnh hoặc zoom đột ngột.
- Âm thanh phải thực tế và tương ứng đúng vật liệu đang xuất hiện.

Trả về bảng:
SCENE_ID | VIDEO_PROMPT | FIRST_FRAME | END_FRAME | AUDIO_PRIORITY | RETRY_HINT

## Bước 7: Kiểm tra trước khi xuất bản

Đừng tạo lại toàn bộ video khi chỉ một cảnh lỗi. Hãy dùng ChatGPT xác định chính xác phần prompt gây trôi nhân vật, sai vật lý hoặc quá nhiều hành động, rồi chỉ tạo lại cảnh đó.

## Master Prompt 6 — Kiểm tra chất lượng và sửa cảnh lỗi

Bạn là continuity supervisor và biên tập viên chất lượng cho video AI.

SERIES BIBLE + ANCHORS:
[DÁN TÀI LIỆU]

SHOT LIST GỐC:
[DÁN SHOT LIST]

MÔ TẢ KẾT QUẢ TỪNG CLIP:
[DÁN MÔ TẢ HOẶC GHI CHÚ LỖI]

Hãy kiểm tra theo 8 tiêu chí:
1. Khuôn mặt và tỷ lệ nhân vật
2. Trang phục và đạo cụ
3. Hướng chuyển động
4. Ánh sáng và thời gian trong ngày
5. Vị trí không gian
6. Tính hợp lý của vật lý
7. Nhịp ASMR và độ sạch của âm thanh
8. Khả năng nối first frame/end frame

Trả về bảng:
SCENE_ID | PASS/RETRY | LỖI CỤ THỂ | NGUYÊN NHÂN TRONG PROMPT | CÂU PROMPT SỬA | CÓ CẦN ĐỔI KEYFRAME KHÔNG

Chỉ đề xuất tạo lại những cảnh thực sự lỗi. Không thay đổi thiết kế đã khóa của nhân vật và thế giới.

## Bộ prompt mẫu: “Tiệm Bánh Trăng Mưa”

## Cảnh 01 — Hook bên ngoài tiệm bánh

Prompt ảnh:

An original hand-painted animated film frame of a tiny timber bakery glowing at the edge of a rain-soaked indigo forest at night. Warm amber light spills through two small windows onto wet stones. An adult Vietnamese baker named An is visible only as a calm silhouette behind the window, her black hair tied in a low bun and her moss-green apron clearly readable. A small charcoal cat with amber eyes sits beneath the awning. Soft watercolor foliage, visible graphite linework, tactile wood grain, gentle rain haze, cinematic wide establishing shot from slightly below eye level, peaceful handcrafted atmosphere, deep indigo and warm amber palette, no text, no logo, no copyrighted characters, 16:9.

Prompt video:

Keep the bakery, window layout, character silhouettes and color palette identical to the reference image. Fine rain falls steadily and creates small circular ripples in the foreground puddles. The charcoal cat slowly turns one ear toward the bakery door; this is the only character action. Warm window light flickers almost imperceptibly. Static cinematic camera with a very slow two-percent push-in. Close rain taps on the wooden awning, distant soft thunder, quiet fire crackle from inside, no speech, no music. End with the cat looking toward the door. Preserve faces, architecture and lighting; avoid fast rain, camera shake, new objects or additional characters.

## Cảnh 02 — Nhào bột

Prompt video:

Close-up of An's adult hands slowly folding soft milk-bread dough on a worn wooden worktable. Keep her moss-green apron, cream rolled sleeves, brass measuring spoon and warm amber side light unchanged. One continuous kneading cycle: press, fold, quarter-turn, rest. Flour particles move only when touched; the dough compresses with realistic weight and elasticity. Locked overhead camera. Intimate sounds of palms against dough, faint wooden table creak, rain muffled behind the window and low oven fire, no dialogue, no music. End with both hands resting beside the rounded dough, ready for the next shot. Avoid extra fingers, melting dough, fast motion, floating flour or changes to the utensils.

## Cảnh 03 — Mun chạm vào túi bột

Prompt video:

The small charcoal cat Mun, with consistent amber eyes and a tiny nick on the left ear, reaches one paw toward a folded paper flour bag beside the worktable. The paw gently touches the bag once; the paper crinkles and a tiny dusting of flour falls onto the wooden floor. An remains softly out of focus in the background and does not change pose. Low floor-level camera, static composition, shallow depth of field, warm bakery light and cool rainy window light. Close paper crinkle, one soft paw step, distant kneading and rain, no speech, no music. End with Mun looking at the small flour mark. Avoid duplicate paws, jumping, bag deformation, face drift or new objects.

## Cảnh 04 — Bánh nở trong lò

Prompt video:

Macro view through the small oven window as six milk buns slowly rise and turn golden. Keep the same ceramic baking tray and oven interior from the reference frame. The primary motion is a subtle, physically plausible expansion of the dough; secondary motion is gentle heat shimmer and a quiet pulse of orange firelight. Camera remains locked. Detailed oven crackle, a soft metal tick as the tray warms, muffled rain in the distance, no speech, no music. End on the fullest golden shape of the buns. Avoid rapid inflation, burning, liquid texture, moving tray or abrupt lighting changes.

## Cảnh 05 — Kết thúc có thể lặp

Prompt video:

An places one warm milk bun on a small blue-gray ceramic plate beside the rainy window. Keep her adult face, low black hair bun, moss-green apron and all counter objects identical to previous shots. Steam curls upward in one slow ribbon while Mun settles beside the plate without touching it. Very slow side dolly of a few centimeters, ending on the window where rain reflections match the opening scene. Close ceramic contact, delicate paper wrap rustle, soft purring, rain on glass and low fire crackle, no dialogue, no music. End with the same amber window glow and rain rhythm used in Scene 01 to support a seamless loop. Avoid eating, sudden gestures, extra food, text, logos or character drift.

## Master Prompt 7 — Tiêu đề và thumbnail không giật tít quá mức

Bạn là YouTube packaging strategist cho một series ASMR hoạt hình không lời thoại.

Nội dung tập:
[DÁN TÓM TẮT TẬP]

Hãy tạo:
1. 15 tiêu đề tiếng Việt
2. 15 tiêu đề tiếng Anh tự nhiên, không dịch máy
3. 5 concept thumbnail có bố cục rõ ở kích thước nhỏ
4. 3 câu mô tả video, mỗi câu dưới 160 ký tự

Tiêu chí:
- Gợi tò mò bằng tình huống và cảm giác, không hứa hẹn thu nhập.
- Không dùng “100%”, “bí mật”, “siêu đẳng cấp”, “kiếm tiền tự động” hoặc số liệu chưa kiểm chứng.
- Tiêu đề dưới 65 ký tự nếu có thể.
- Thumbnail chỉ có một chủ thể chính, một hành động và một điểm sáng tương phản.
- Không sao chép poster, nhân vật hoặc bố cục nhận diện của phim nổi tiếng.

Chấm từng tiêu đề theo thang 10 cho: rõ nội dung, cảm xúc, tính nguyên bản và khả năng hiểu khi lướt nhanh. Chọn 3 phương án tốt nhất và giải thích ngắn.

## Checklist trước khi đăng

Nhân vật giữ đúng khuôn mặt, tóc, trang phục và tỷ lệ.
Mỗi clip chỉ có một hành động chính.
Không có chữ, logo hoặc watermark do AI tự sinh.
Hướng nhìn và vị trí đạo cụ khớp giữa hai cảnh liền nhau.
Âm thanh đúng vật liệu và không có giọng nói bất ngờ.
Cảnh mở đầu có hook hình ảnh trong vài giây đầu.
Cảnh kết tạo cảm giác hoàn thành hoặc nối vòng được.
Tiêu đề và thumbnail phản ánh đúng nội dung.
Video có câu chuyện, lựa chọn sáng tạo và biên tập của riêng bạn.
Không dùng nhân vật, logo, âm nhạc hoặc khung hình thuộc tác phẩm khác.

## Công thức có thể tái sử dụng

Bạn không cần tạo một “cỗ máy video tự động”. Một hệ thống tốt hơn là:

Một thế giới nguyên bản
→ một series bible ổn định
→ một nghi thức ASMR cho mỗi tập
→ một hành động cho mỗi clip
→ khóa first frame/end frame
→ kiểm tra thủ công
→ chỉ tạo lại cảnh lỗi

Khi phần nền này đủ chắc, ChatGPT giúp bạn suy nghĩ có cấu trúc, còn Flow biến cấu trúc đó thành hình ảnh và chuyển động. Giá trị thật sự vẫn nằm ở lựa chọn sáng tạo, nhịp kể chuyện và khả năng giữ cho mỗi tập có một cảm xúc riêng.$article$,
  $blocks$[{"id":"asmr-flow-001","type":"paragraph","text":"Video ASMR hoạt hình hấp dẫn không chỉ vì hình ảnh đẹp. Thứ giữ người xem ở lại là một thế giới có nhịp điệu riêng: tiếng mưa chạm mái ngói, bột bánh được nhào chậm rãi, ánh lửa phản chiếu trên đồ gốm và một câu chuyện rất nhỏ được kể mà không cần lời thoại."},{"id":"asmr-flow-002","type":"paragraph","text":"Trong hướng dẫn này, chúng ta sẽ xây dựng toàn bộ quy trình chỉ với hai công cụ:"},{"id":"asmr-flow-003","type":"paragraph","text":"• ChatGPT: phát triển ý tưởng, “series bible”, kịch bản, shot list và prompt.\n• Google Flow: tạo hình tham chiếu, tạo clip chuyển động và sắp xếp các cảnh thành video."},{"id":"asmr-flow-004","type":"paragraph","text":"Mục tiêu không phải sao chép một bộ phim hoặc nhân vật nổi tiếng. Ta sẽ tạo một thế giới nguyên bản, dùng ngôn ngữ hình ảnh hoạt hình vẽ tay ấm áp, giàu chất liệu và có khả năng phát triển thành series lâu dài."},{"id":"asmr-flow-005","type":"warning","text":"Lưu ý: AI không bảo đảm lượt xem hoặc thu nhập. YouTube đánh giá tính nguyên bản và giá trị thực sự của nội dung. Việc tạo hàng loạt video gần như giống nhau có thể làm kênh khó phát triển hoặc không đủ điều kiện kiếm tiền."},{"id":"asmr-flow-006","type":"heading","text":"Thành phẩm chúng ta sẽ tạo"},{"id":"asmr-flow-007","type":"paragraph","text":"Ví dụ xuyên suốt bài là series “Tiệm Bánh Trăng Mưa”:"},{"id":"asmr-flow-008","type":"paragraph","text":"• Nhân vật chính: An, thợ làm bánh 24 tuổi, tóc đen búi thấp, tạp dề xanh rêu.\n• Bạn đồng hành: Mun, mèo nhỏ màu than, mắt hổ phách.\n• Bối cảnh: tiệm bánh gỗ nằm bên rìa khu rừng, hoạt động vào những đêm mưa.\n• Cảm xúc: ấm áp, yên tĩnh, chữa lành, không lời thoại.\n• Âm thanh: mưa, bếp lửa, đồ gốm, giấy gói bánh, tiếng bước chân và tiếng mèo rất nhẹ."},{"id":"asmr-flow-009","type":"paragraph","text":"Video đầu tiên: “Một đêm mưa ở tiệm bánh: An làm bánh sữa cho vị khách đến muộn.”"},{"id":"asmr-flow-010","type":"heading","text":"Vì sao video AI thường bị rời rạc?"},{"id":"asmr-flow-011","type":"paragraph","text":"Ba lỗi phổ biến nhất là:"},{"id":"asmr-flow-012","type":"paragraph","text":"1. Nhân vật đổi khuôn mặt, quần áo hoặc tỷ lệ giữa các cảnh.\n2. Mỗi prompt dùng một phong cách khác nhau nên video giống tập hợp clip ngẫu nhiên.\n3. Cảnh có quá nhiều hành động, khiến chuyển động lỗi và âm thanh hỗn loạn."},{"id":"asmr-flow-013","type":"paragraph","text":"Cách khắc phục là khóa ba lớp trước khi tạo bất kỳ hình ảnh nào:"},{"id":"asmr-flow-014","type":"paragraph","text":"• Identity Anchor: mô tả nhân vật cố định.\n• Visual Anchor: bảng màu, chất liệu, ánh sáng và ngôn ngữ máy quay cố định.\n• Audio Anchor: nhóm âm thanh xuyên suốt và những thứ không được xuất hiện."},{"id":"asmr-flow-015","type":"heading","text":"Quy trình 7 bước"},{"id":"asmr-flow-016","type":"heading","text":"Bước 1: Chọn một “nghi thức ASMR” nhỏ"},{"id":"asmr-flow-017","type":"paragraph","text":"Đừng bắt đầu bằng một cốt truyện quá lớn. Hãy chọn một hoạt động có âm thanh và chuyển động dễ cảm nhận:"},{"id":"asmr-flow-018","type":"paragraph","text":"• Làm bánh trong đêm mưa.\n• Pha trà bên cửa sổ mùa đông.\n• Sửa đồ gốm trong căn phòng đầy nắng.\n• Chuẩn bị hộp cơm cho chuyến tàu sớm.\n• Chăm sóc một khu vườn tí hon sau cơn bão."},{"id":"asmr-flow-019","type":"paragraph","text":"Mỗi video chỉ nên có một mục tiêu cảm xúc và một hành động trung tâm."},{"id":"asmr-flow-020","type":"heading","text":"Bước 2: Dùng ChatGPT tạo “series bible”"},{"id":"asmr-flow-021","type":"paragraph","text":"Series bible là tài liệu gốc để mọi video giữ cùng thế giới, nhân vật và cảm giác. Sau khi tạo xong, hãy lưu lại và đưa vào đầu mỗi phiên làm việc mới."},{"id":"asmr-flow-022","type":"heading","text":"Master Prompt 1 — Xây concept series nguyên bản"},{"id":"asmr-flow-023","type":"prompt","text":"Bạn là creative director chuyên phát triển series hoạt hình ASMR không lời thoại.\n\nHãy xây dựng một concept series nguyên bản dựa trên thông tin sau:\n- Khán giả: [KHÁN GIẢ MỤC TIÊU]\n- Cảm xúc chính: [CHỮA LÀNH / ẤM ÁP / KỲ ẢO / HOÀI NIỆM]\n- Hoạt động ASMR trung tâm: [LÀM BÁNH / PHA TRÀ / LÀM GỐM / LÀM VƯỜN]\n- Thời lượng mỗi video: [SỐ PHÚT]\n- Tỷ lệ khung hình: [16:9 hoặc 9:16]\n\nYêu cầu bắt buộc:\n1. Tạo thế giới, nhân vật và câu chuyện hoàn toàn nguyên bản.\n2. Không dùng tên studio, bộ phim hoặc nhân vật có bản quyền làm chỉ dẫn phong cách.\n3. Không có lời thoại, thuyết minh hoặc chữ trên màn hình.\n4. Mỗi tập phải có một nghi thức đời thường rõ ràng và một thay đổi cảm xúc nhỏ.\n5. Thiết kế phải đủ đơn giản để giữ nhân vật đồng nhất qua nhiều cảnh AI.\n\nTrả về theo cấu trúc:\nA. Tên series và lời hứa nội dung trong một câu\nB. Mô tả thế giới\nC. Hồ sơ tối đa 2 nhân vật chính\nD. Visual Anchor cố định\nE. Audio Anchor cố định\nF. 10 ý tưởng tập đầu tiên, mỗi ý tưởng gồm hook hình ảnh, hành động ASMR và đoạn kết cảm xúc\nG. Danh sách yếu tố tuyệt đối không thay đổi giữa các tập"},{"id":"asmr-flow-024","type":"heading","text":"Bước 3: Khóa nhân vật và phong cách"},{"id":"asmr-flow-025","type":"paragraph","text":"Sau khi ChatGPT trả kết quả, hãy yêu cầu rút gọn thành một khối mô tả có thể lặp nguyên văn trong mọi prompt."},{"id":"asmr-flow-026","type":"heading","text":"Master Prompt 2 — Tạo Identity Anchor và Visual Anchor"},{"id":"asmr-flow-027","type":"prompt","text":"Dựa trên series bible bên dưới, hãy tạo bộ khóa đồng nhất để dùng cho công cụ tạo ảnh/video AI.\n\n[DÁN SERIES BIBLE]\n\nHãy trả về đúng 5 phần:\n\n1. CHARACTER_ANCHOR:\n- Viết một đoạn tiếng Anh 70–110 từ.\n- Mô tả tuổi trưởng thành, khuôn mặt, tóc, trang phục, màu sắc, tỷ lệ cơ thể và một đạo cụ nhận diện.\n- Chỉ mô tả những chi tiết có thể nhìn thấy.\n\n2. COMPANION_ANCHOR:\n- Viết một đoạn tiếng Anh 30–60 từ cho nhân vật phụ hoặc thú đồng hành.\n\n3. WORLD_ANCHOR:\n- Mô tả kiến trúc, vật liệu, thời tiết và các đồ vật luôn có trong bối cảnh.\n\n4. VISUAL_ANCHOR:\n- Phong cách hoạt hình vẽ tay nguyên bản, màu nước mềm, nét chì hữu hình, ánh sáng điện ảnh dịu, chất liệu thủ công.\n- Không nhắc tên họa sĩ, studio, phim hoặc thương hiệu.\n\n5. NEGATIVE_ANCHOR:\n- no text, no logo, no watermark, no extra fingers, no duplicate character, no costume change, no face drift, no modern plastic objects, no abrupt lighting change\n\nCác anchor phải sẵn sàng để copy nguyên văn vào mọi prompt tiếp theo."},{"id":"asmr-flow-028","type":"paragraph","text":"Với dự án mẫu, Visual Anchor có thể là:"},{"id":"asmr-flow-029","type":"prompt","text":"Original cozy hand-painted animated film aesthetic, soft watercolor backgrounds, visible graphite linework, tactile wood and ceramic textures, warm amber practical light against deep indigo rain, restrained natural motion, cinematic composition, peaceful handcrafted atmosphere, consistent character proportions, no text, no logo, no copyrighted characters."},{"id":"asmr-flow-030","type":"heading","text":"Bước 4: Viết kịch bản theo cảnh"},{"id":"asmr-flow-031","type":"paragraph","text":"Một clip AI nên tập trung vào một hành động chính. Thay vì yêu cầu “An mở cửa, chạy vào bếp, nhào bột và nướng bánh”, hãy chia thành bốn cảnh ngắn."},{"id":"asmr-flow-032","type":"heading","text":"Master Prompt 3 — Kịch bản ASMR và shot list"},{"id":"asmr-flow-033","type":"prompt","text":"Bạn là đạo diễn hoạt hình và sound designer cho video ASMR không lời thoại.\n\nThông tin dự án:\n- Tên tập: [TÊN TẬP]\n- Thời lượng mục tiêu: [THỜI LƯỢNG]\n- Số cảnh: [SỐ CẢNH]\n- Tỷ lệ: [16:9 hoặc 9:16]\n\nSERIES BIBLE:\n[DÁN SERIES BIBLE]\n\nIDENTITY + VISUAL + AUDIO ANCHOR:\n[DÁN CÁC ANCHOR]\n\nHãy viết một câu chuyện có cấu trúc:\n1. Hook thị giác trong 5 giây đầu\n2. Chuẩn bị\n3. Nghi thức ASMR chính\n4. Một trục trặc nhỏ, hiền hòa\n5. Khoảnh khắc giải quyết\n6. Cảnh kết tạo cảm giác trọn vẹn và có thể lặp mượt\n\nQuy tắc:\n- Không lời thoại, không narration, không chữ trên màn hình.\n- Mỗi cảnh chỉ có một hành động chính và tối đa một chuyển động camera.\n- Ưu tiên cận cảnh bàn tay, chất liệu, hơi nước, nước mưa, lửa và đồ gốm.\n- Chuyển động phải chậm, có trọng lượng và phù hợp vật lý.\n- Không tự thêm nhân vật ngoài series bible.\n\nTrả về bảng gồm:\nSCENE_ID | DURATION | STORY_BEAT | SUBJECT_ACTION | ENVIRONMENT | SHOT_SIZE | CAMERA | LIGHTING | ASMR_AUDIO | TRANSITION | CONTINUITY_NOTES\n\nSau bảng, viết thêm:\n- Một câu tóm tắt nhịp cảm xúc của cả video\n- Ba cảnh quan trọng nhất cần tạo hình tham chiếu trước\n- Danh sách âm thanh phải giữ ổn định xuyên suốt"},{"id":"asmr-flow-034","type":"heading","text":"Bước 5: Chuyển shot list thành prompt tạo ảnh trong Flow"},{"id":"asmr-flow-035","type":"paragraph","text":"Tạo ảnh khóa cho các cảnh quan trọng trước. Khi đã có hình nhân vật và bối cảnh đúng ý, dùng chúng làm tham chiếu cho các cảnh tiếp theo nếu chế độ Flow bạn đang dùng hỗ trợ ảnh tham chiếu."},{"id":"asmr-flow-036","type":"heading","text":"Master Prompt 4 — Prompt tạo ảnh cho Google Flow"},{"id":"asmr-flow-037","type":"prompt","text":"Bạn là prompt designer cho Google Flow.\n\nNhiệm vụ: chuyển shot list thành prompt tạo ảnh nhất quán. Prompt cuối cùng phải viết bằng tiếng Anh, còn ghi chú giải thích viết bằng tiếng Việt.\n\nCHARACTER_ANCHOR:\n[DÁN NGUYÊN VĂN]\n\nCOMPANION_ANCHOR:\n[DÁN NGUYÊN VĂN]\n\nWORLD_ANCHOR:\n[DÁN NGUYÊN VĂN]\n\nVISUAL_ANCHOR:\n[DÁN NGUYÊN VĂN]\n\nNEGATIVE_ANCHOR:\n[DÁN NGUYÊN VĂN]\n\nSHOT LIST:\n[DÁN SHOT LIST]\n\nVới từng cảnh, trả về:\n1. SCENE_ID\n2. KEYFRAME_PROMPT — một đoạn tiếng Anh 120–180 từ theo thứ tự:\n   subject identity → single frozen action → environment → foreground/midground/background → shot size → camera angle → lighting → color → material texture → continuity → aspect ratio\n3. NEGATIVE_PROMPT\n4. REFERENCE_NEEDED — ghi rõ nên dùng ảnh nhân vật, bối cảnh hay cả hai\n5. CONSISTENCY_CHECK — 3 chi tiết phải đối chiếu với cảnh trước\n\nKhông dùng các cụm mơ hồ như “beautiful”, “masterpiece”, “best quality” nếu không mô tả bằng chi tiết nhìn thấy được.\nKhông nhắc tên studio, phim, họa sĩ hoặc nhân vật có bản quyền."},{"id":"asmr-flow-038","type":"heading","text":"Bước 6: Tạo prompt chuyển động và âm thanh trong Flow"},{"id":"asmr-flow-039","type":"paragraph","text":"Prompt video tốt cần nói rõ: vật gì chuyển động, chuyển động ra sao, máy quay làm gì và âm thanh nào nằm gần micro."},{"id":"asmr-flow-040","type":"heading","text":"Master Prompt 5 — Prompt image-to-video/text-to-video cho Flow"},{"id":"asmr-flow-041","type":"prompt","text":"Bạn là AI film director chuyên viết prompt video ngắn có chuyển động tự nhiên và âm thanh ASMR.\n\nINPUT:\n- Shot list: [DÁN SHOT LIST]\n- Các anchor cố định: [DÁN ANCHOR]\n- Prompt ảnh/keyframe đã duyệt: [DÁN PROMPT HOẶC MÔ TẢ ẢNH]\n\nHãy tạo một VIDEO_PROMPT bằng tiếng Anh cho từng cảnh.\n\nCấu trúc bắt buộc của mỗi prompt:\nA. Continuity: nhân vật, trang phục, đạo cụ và ánh sáng phải giữ nguyên từ keyframe\nB. Primary motion: chỉ một hành động chính, mô tả tốc độ, hướng và trọng lượng\nC. Secondary motion: tối đa hai chuyển động môi trường rất nhẹ\nD. Camera: một chuyển động đơn giản hoặc camera tĩnh\nE. Physics: mô tả phản ứng vật liệu như bột, hơi nước, vải, mưa hoặc lửa\nF. Audio: âm thanh cận, âm nền xa và khoảng lặng\nG. Ending frame: tư thế kết thúc giúp nối sang cảnh tiếp theo\nH. Avoid: lỗi chuyển động và yếu tố không mong muốn\n\nQuy tắc:\n- Không thoại, không narration, không nhạc nền.\n- Không jump cut trong cùng một clip.\n- Không biến đổi khuôn mặt, trang phục, đạo cụ hoặc kiến trúc.\n- Không thêm người hoặc động vật mới.\n- Không camera bay nhanh, rung mạnh hoặc zoom đột ngột.\n- Âm thanh phải thực tế và tương ứng đúng vật liệu đang xuất hiện.\n\nTrả về bảng:\nSCENE_ID | VIDEO_PROMPT | FIRST_FRAME | END_FRAME | AUDIO_PRIORITY | RETRY_HINT"},{"id":"asmr-flow-042","type":"heading","text":"Bước 7: Kiểm tra trước khi xuất bản"},{"id":"asmr-flow-043","type":"paragraph","text":"Đừng tạo lại toàn bộ video khi chỉ một cảnh lỗi. Hãy dùng ChatGPT xác định chính xác phần prompt gây trôi nhân vật, sai vật lý hoặc quá nhiều hành động, rồi chỉ tạo lại cảnh đó."},{"id":"asmr-flow-044","type":"heading","text":"Master Prompt 6 — Kiểm tra chất lượng và sửa cảnh lỗi"},{"id":"asmr-flow-045","type":"prompt","text":"Bạn là continuity supervisor và biên tập viên chất lượng cho video AI.\n\nSERIES BIBLE + ANCHORS:\n[DÁN TÀI LIỆU]\n\nSHOT LIST GỐC:\n[DÁN SHOT LIST]\n\nMÔ TẢ KẾT QUẢ TỪNG CLIP:\n[DÁN MÔ TẢ HOẶC GHI CHÚ LỖI]\n\nHãy kiểm tra theo 8 tiêu chí:\n1. Khuôn mặt và tỷ lệ nhân vật\n2. Trang phục và đạo cụ\n3. Hướng chuyển động\n4. Ánh sáng và thời gian trong ngày\n5. Vị trí không gian\n6. Tính hợp lý của vật lý\n7. Nhịp ASMR và độ sạch của âm thanh\n8. Khả năng nối first frame/end frame\n\nTrả về bảng:\nSCENE_ID | PASS/RETRY | LỖI CỤ THỂ | NGUYÊN NHÂN TRONG PROMPT | CÂU PROMPT SỬA | CÓ CẦN ĐỔI KEYFRAME KHÔNG\n\nChỉ đề xuất tạo lại những cảnh thực sự lỗi. Không thay đổi thiết kế đã khóa của nhân vật và thế giới."},{"id":"asmr-flow-046","type":"heading","text":"Bộ prompt mẫu: “Tiệm Bánh Trăng Mưa”"},{"id":"asmr-flow-047","type":"heading","text":"Cảnh 01 — Hook bên ngoài tiệm bánh"},{"id":"asmr-flow-048","type":"paragraph","text":"Prompt ảnh:"},{"id":"asmr-flow-049","type":"code","text":"An original hand-painted animated film frame of a tiny timber bakery glowing at the edge of a rain-soaked indigo forest at night. Warm amber light spills through two small windows onto wet stones. An adult Vietnamese baker named An is visible only as a calm silhouette behind the window, her black hair tied in a low bun and her moss-green apron clearly readable. A small charcoal cat with amber eyes sits beneath the awning. Soft watercolor foliage, visible graphite linework, tactile wood grain, gentle rain haze, cinematic wide establishing shot from slightly below eye level, peaceful handcrafted atmosphere, deep indigo and warm amber palette, no text, no logo, no copyrighted characters, 16:9.","language":"text"},{"id":"asmr-flow-050","type":"paragraph","text":"Prompt video:"},{"id":"asmr-flow-051","type":"code","text":"Keep the bakery, window layout, character silhouettes and color palette identical to the reference image. Fine rain falls steadily and creates small circular ripples in the foreground puddles. The charcoal cat slowly turns one ear toward the bakery door; this is the only character action. Warm window light flickers almost imperceptibly. Static cinematic camera with a very slow two-percent push-in. Close rain taps on the wooden awning, distant soft thunder, quiet fire crackle from inside, no speech, no music. End with the cat looking toward the door. Preserve faces, architecture and lighting; avoid fast rain, camera shake, new objects or additional characters.","language":"text"},{"id":"asmr-flow-052","type":"heading","text":"Cảnh 02 — Nhào bột"},{"id":"asmr-flow-053","type":"paragraph","text":"Prompt video:"},{"id":"asmr-flow-054","type":"code","text":"Close-up of An's adult hands slowly folding soft milk-bread dough on a worn wooden worktable. Keep her moss-green apron, cream rolled sleeves, brass measuring spoon and warm amber side light unchanged. One continuous kneading cycle: press, fold, quarter-turn, rest. Flour particles move only when touched; the dough compresses with realistic weight and elasticity. Locked overhead camera. Intimate sounds of palms against dough, faint wooden table creak, rain muffled behind the window and low oven fire, no dialogue, no music. End with both hands resting beside the rounded dough, ready for the next shot. Avoid extra fingers, melting dough, fast motion, floating flour or changes to the utensils.","language":"text"},{"id":"asmr-flow-055","type":"heading","text":"Cảnh 03 — Mun chạm vào túi bột"},{"id":"asmr-flow-056","type":"paragraph","text":"Prompt video:"},{"id":"asmr-flow-057","type":"code","text":"The small charcoal cat Mun, with consistent amber eyes and a tiny nick on the left ear, reaches one paw toward a folded paper flour bag beside the worktable. The paw gently touches the bag once; the paper crinkles and a tiny dusting of flour falls onto the wooden floor. An remains softly out of focus in the background and does not change pose. Low floor-level camera, static composition, shallow depth of field, warm bakery light and cool rainy window light. Close paper crinkle, one soft paw step, distant kneading and rain, no speech, no music. End with Mun looking at the small flour mark. Avoid duplicate paws, jumping, bag deformation, face drift or new objects.","language":"text"},{"id":"asmr-flow-058","type":"heading","text":"Cảnh 04 — Bánh nở trong lò"},{"id":"asmr-flow-059","type":"paragraph","text":"Prompt video:"},{"id":"asmr-flow-060","type":"code","text":"Macro view through the small oven window as six milk buns slowly rise and turn golden. Keep the same ceramic baking tray and oven interior from the reference frame. The primary motion is a subtle, physically plausible expansion of the dough; secondary motion is gentle heat shimmer and a quiet pulse of orange firelight. Camera remains locked. Detailed oven crackle, a soft metal tick as the tray warms, muffled rain in the distance, no speech, no music. End on the fullest golden shape of the buns. Avoid rapid inflation, burning, liquid texture, moving tray or abrupt lighting changes.","language":"text"},{"id":"asmr-flow-061","type":"heading","text":"Cảnh 05 — Kết thúc có thể lặp"},{"id":"asmr-flow-062","type":"paragraph","text":"Prompt video:"},{"id":"asmr-flow-063","type":"code","text":"An places one warm milk bun on a small blue-gray ceramic plate beside the rainy window. Keep her adult face, low black hair bun, moss-green apron and all counter objects identical to previous shots. Steam curls upward in one slow ribbon while Mun settles beside the plate without touching it. Very slow side dolly of a few centimeters, ending on the window where rain reflections match the opening scene. Close ceramic contact, delicate paper wrap rustle, soft purring, rain on glass and low fire crackle, no dialogue, no music. End with the same amber window glow and rain rhythm used in Scene 01 to support a seamless loop. Avoid eating, sudden gestures, extra food, text, logos or character drift.","language":"text"},{"id":"asmr-flow-064","type":"heading","text":"Master Prompt 7 — Tiêu đề và thumbnail không giật tít quá mức"},{"id":"asmr-flow-065","type":"prompt","text":"Bạn là YouTube packaging strategist cho một series ASMR hoạt hình không lời thoại.\n\nNội dung tập:\n[DÁN TÓM TẮT TẬP]\n\nHãy tạo:\n1. 15 tiêu đề tiếng Việt\n2. 15 tiêu đề tiếng Anh tự nhiên, không dịch máy\n3. 5 concept thumbnail có bố cục rõ ở kích thước nhỏ\n4. 3 câu mô tả video, mỗi câu dưới 160 ký tự\n\nTiêu chí:\n- Gợi tò mò bằng tình huống và cảm giác, không hứa hẹn thu nhập.\n- Không dùng “100%”, “bí mật”, “siêu đẳng cấp”, “kiếm tiền tự động” hoặc số liệu chưa kiểm chứng.\n- Tiêu đề dưới 65 ký tự nếu có thể.\n- Thumbnail chỉ có một chủ thể chính, một hành động và một điểm sáng tương phản.\n- Không sao chép poster, nhân vật hoặc bố cục nhận diện của phim nổi tiếng.\n\nChấm từng tiêu đề theo thang 10 cho: rõ nội dung, cảm xúc, tính nguyên bản và khả năng hiểu khi lướt nhanh. Chọn 3 phương án tốt nhất và giải thích ngắn."},{"id":"asmr-flow-066","type":"heading","text":"Checklist trước khi đăng"},{"id":"asmr-flow-067","type":"checklist","text":"Nhân vật giữ đúng khuôn mặt, tóc, trang phục và tỷ lệ.\nMỗi clip chỉ có một hành động chính.\nKhông có chữ, logo hoặc watermark do AI tự sinh.\nHướng nhìn và vị trí đạo cụ khớp giữa hai cảnh liền nhau.\nÂm thanh đúng vật liệu và không có giọng nói bất ngờ.\nCảnh mở đầu có hook hình ảnh trong vài giây đầu.\nCảnh kết tạo cảm giác hoàn thành hoặc nối vòng được.\nTiêu đề và thumbnail phản ánh đúng nội dung.\nVideo có câu chuyện, lựa chọn sáng tạo và biên tập của riêng bạn.\nKhông dùng nhân vật, logo, âm nhạc hoặc khung hình thuộc tác phẩm khác."},{"id":"asmr-flow-068","type":"heading","text":"Công thức có thể tái sử dụng"},{"id":"asmr-flow-069","type":"paragraph","text":"Bạn không cần tạo một “cỗ máy video tự động”. Một hệ thống tốt hơn là:"},{"id":"asmr-flow-070","type":"code","text":"Một thế giới nguyên bản\n→ một series bible ổn định\n→ một nghi thức ASMR cho mỗi tập\n→ một hành động cho mỗi clip\n→ khóa first frame/end frame\n→ kiểm tra thủ công\n→ chỉ tạo lại cảnh lỗi","language":"text"},{"id":"asmr-flow-071","type":"paragraph","text":"Khi phần nền này đủ chắc, ChatGPT giúp bạn suy nghĩ có cấu trúc, còn Flow biến cấu trúc đó thành hình ảnh và chuyển động. Giá trị thật sự vẫn nằm ở lựa chọn sáng tạo, nhịp kể chuyện và khả năng giữ cho mỗi tập có một cảm xúc riêng."}]$blocks$::jsonb,
  null,
  'draft',
  'blog',
  'Creative AI',
  'intermediate',
  24,
  '["ChatGPT","Google Flow"]'::jsonb,
  false,
  'Tạo video ASMR hoạt hình bằng ChatGPT và Google Flow',
  'Hướng dẫn tạo video ASMR hoạt hình chữa lành với ChatGPT và Google Flow, kèm master prompt viết kịch bản, tạo ảnh, chuyển động và kiểm tra đồng nhất.',
  'Đội ngũ AINextGen',
  'Nội dung được biên tập và kiểm chứng bởi đội ngũ AINextGen.',
  $sources$[{"label":"Google Flow — công cụ làm phim AI","url":"https://labs.google/fx/tools/flow"},{"label":"OpenAI — hướng dẫn prompting","url":"https://developers.openai.com/api/docs/guides/prompting"},{"label":"YouTube — chính sách kiếm tiền của kênh","url":"https://support.google.com/youtube/answer/1311392"},{"label":"Video tham khảo ban đầu","url":"https://www.youtube.com/watch?v=bcTrSm9KRm4"}]$sources$::jsonb,
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
