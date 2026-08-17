---
title: "Tạo video ASMR hoạt hình chữa lành bằng ChatGPT và Google Flow"
slug: "tao-video-asmr-hoat-hinh-chatgpt-google-flow"
excerpt: "Quy trình gọn từ ý tưởng, kịch bản, bộ nhận diện nhân vật đến prompt tạo ảnh và video ASMR đồng nhất — chỉ với ChatGPT và Google Flow."
category: "Creative AI"
difficulty: "intermediate"
duration_minutes: 24
tools:
  - "ChatGPT"
  - "Google Flow"
seo_title: "Tạo video ASMR hoạt hình bằng ChatGPT và Google Flow"
seo_description: "Hướng dẫn tạo video ASMR hoạt hình chữa lành với ChatGPT và Google Flow, kèm master prompt viết kịch bản, tạo ảnh, chuyển động và kiểm tra đồng nhất."
author_name: "Đội ngũ AINextGen"
cover_prompt: "Original cozy hand-painted animated film scene, a tiny bakery glowing in a rainy indigo forest at night, an adult Vietnamese baker kneading dough beside a small charcoal cat, warm amber window light, soft watercolor background, tactile pencil linework, cinematic wide composition, peaceful ASMR mood, no text, no logo, no copyrighted characters, 16:9"
source_references:
  - label: "Google Flow — công cụ làm phim AI"
    url: "https://labs.google/fx/tools/flow"
  - label: "OpenAI — hướng dẫn prompting"
    url: "https://developers.openai.com/api/docs/guides/prompting"
  - label: "YouTube — chính sách kiếm tiền của kênh"
    url: "https://support.google.com/youtube/answer/1311392"
  - label: "Video tham khảo ban đầu"
    url: "https://www.youtube.com/watch?v=bcTrSm9KRm4"
---

# Tạo video ASMR hoạt hình chữa lành bằng ChatGPT và Google Flow

Video ASMR hoạt hình hấp dẫn không chỉ vì hình ảnh đẹp. Thứ giữ người xem ở lại là một thế giới có nhịp điệu riêng: tiếng mưa chạm mái ngói, bột bánh được nhào chậm rãi, ánh lửa phản chiếu trên đồ gốm và một câu chuyện rất nhỏ được kể mà không cần lời thoại.

Trong hướng dẫn này, chúng ta sẽ xây dựng toàn bộ quy trình chỉ với hai công cụ:

- **ChatGPT:** phát triển ý tưởng, “series bible”, kịch bản, shot list và prompt.
- **Google Flow:** tạo hình tham chiếu, tạo clip chuyển động và sắp xếp các cảnh thành video.

Mục tiêu không phải sao chép một bộ phim hoặc nhân vật nổi tiếng. Ta sẽ tạo một thế giới nguyên bản, dùng ngôn ngữ hình ảnh hoạt hình vẽ tay ấm áp, giàu chất liệu và có khả năng phát triển thành series lâu dài.

> **Lưu ý:** AI không bảo đảm lượt xem hoặc thu nhập. YouTube đánh giá tính nguyên bản và giá trị thực sự của nội dung. Việc tạo hàng loạt video gần như giống nhau có thể làm kênh khó phát triển hoặc không đủ điều kiện kiếm tiền.

## Thành phẩm chúng ta sẽ tạo

Ví dụ xuyên suốt bài là series **“Tiệm Bánh Trăng Mưa”**:

- **Nhân vật chính:** An, thợ làm bánh 24 tuổi, tóc đen búi thấp, tạp dề xanh rêu.
- **Bạn đồng hành:** Mun, mèo nhỏ màu than, mắt hổ phách.
- **Bối cảnh:** tiệm bánh gỗ nằm bên rìa khu rừng, hoạt động vào những đêm mưa.
- **Cảm xúc:** ấm áp, yên tĩnh, chữa lành, không lời thoại.
- **Âm thanh:** mưa, bếp lửa, đồ gốm, giấy gói bánh, tiếng bước chân và tiếng mèo rất nhẹ.

Video đầu tiên: **“Một đêm mưa ở tiệm bánh: An làm bánh sữa cho vị khách đến muộn.”**

## Vì sao video AI thường bị rời rạc?

Ba lỗi phổ biến nhất là:

1. Nhân vật đổi khuôn mặt, quần áo hoặc tỷ lệ giữa các cảnh.
2. Mỗi prompt dùng một phong cách khác nhau nên video giống tập hợp clip ngẫu nhiên.
3. Cảnh có quá nhiều hành động, khiến chuyển động lỗi và âm thanh hỗn loạn.

Cách khắc phục là khóa ba lớp trước khi tạo bất kỳ hình ảnh nào:

- **Identity Anchor:** mô tả nhân vật cố định.
- **Visual Anchor:** bảng màu, chất liệu, ánh sáng và ngôn ngữ máy quay cố định.
- **Audio Anchor:** nhóm âm thanh xuyên suốt và những thứ không được xuất hiện.

## Quy trình 7 bước

### Bước 1: Chọn một “nghi thức ASMR” nhỏ

Đừng bắt đầu bằng một cốt truyện quá lớn. Hãy chọn một hoạt động có âm thanh và chuyển động dễ cảm nhận:

- Làm bánh trong đêm mưa.
- Pha trà bên cửa sổ mùa đông.
- Sửa đồ gốm trong căn phòng đầy nắng.
- Chuẩn bị hộp cơm cho chuyến tàu sớm.
- Chăm sóc một khu vườn tí hon sau cơn bão.

Mỗi video chỉ nên có một mục tiêu cảm xúc và một hành động trung tâm.

### Bước 2: Dùng ChatGPT tạo “series bible”

Series bible là tài liệu gốc để mọi video giữ cùng thế giới, nhân vật và cảm giác. Sau khi tạo xong, hãy lưu lại và đưa vào đầu mỗi phiên làm việc mới.

## Master Prompt 1 — Xây concept series nguyên bản

```text
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
```

### Bước 3: Khóa nhân vật và phong cách

Sau khi ChatGPT trả kết quả, hãy yêu cầu rút gọn thành một khối mô tả có thể lặp nguyên văn trong mọi prompt.

## Master Prompt 2 — Tạo Identity Anchor và Visual Anchor

```text
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
```

Với dự án mẫu, Visual Anchor có thể là:

```text
Original cozy hand-painted animated film aesthetic, soft watercolor backgrounds, visible graphite linework, tactile wood and ceramic textures, warm amber practical light against deep indigo rain, restrained natural motion, cinematic composition, peaceful handcrafted atmosphere, consistent character proportions, no text, no logo, no copyrighted characters.
```

### Bước 4: Viết kịch bản theo cảnh

Một clip AI nên tập trung vào **một hành động chính**. Thay vì yêu cầu “An mở cửa, chạy vào bếp, nhào bột và nướng bánh”, hãy chia thành bốn cảnh ngắn.

## Master Prompt 3 — Kịch bản ASMR và shot list

```text
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
```

### Bước 5: Chuyển shot list thành prompt tạo ảnh trong Flow

Tạo ảnh khóa cho các cảnh quan trọng trước. Khi đã có hình nhân vật và bối cảnh đúng ý, dùng chúng làm tham chiếu cho các cảnh tiếp theo nếu chế độ Flow bạn đang dùng hỗ trợ ảnh tham chiếu.

## Master Prompt 4 — Prompt tạo ảnh cho Google Flow

```text
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
```

### Bước 6: Tạo prompt chuyển động và âm thanh trong Flow

Prompt video tốt cần nói rõ: vật gì chuyển động, chuyển động ra sao, máy quay làm gì và âm thanh nào nằm gần micro.

## Master Prompt 5 — Prompt image-to-video/text-to-video cho Flow

```text
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
```

### Bước 7: Kiểm tra trước khi xuất bản

Đừng tạo lại toàn bộ video khi chỉ một cảnh lỗi. Hãy dùng ChatGPT xác định chính xác phần prompt gây trôi nhân vật, sai vật lý hoặc quá nhiều hành động, rồi chỉ tạo lại cảnh đó.

## Master Prompt 6 — Kiểm tra chất lượng và sửa cảnh lỗi

```text
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
```

## Bộ prompt mẫu: “Tiệm Bánh Trăng Mưa”

### Cảnh 01 — Hook bên ngoài tiệm bánh

**Prompt ảnh:**

```text
An original hand-painted animated film frame of a tiny timber bakery glowing at the edge of a rain-soaked indigo forest at night. Warm amber light spills through two small windows onto wet stones. An adult Vietnamese baker named An is visible only as a calm silhouette behind the window, her black hair tied in a low bun and her moss-green apron clearly readable. A small charcoal cat with amber eyes sits beneath the awning. Soft watercolor foliage, visible graphite linework, tactile wood grain, gentle rain haze, cinematic wide establishing shot from slightly below eye level, peaceful handcrafted atmosphere, deep indigo and warm amber palette, no text, no logo, no copyrighted characters, 16:9.
```

**Prompt video:**

```text
Keep the bakery, window layout, character silhouettes and color palette identical to the reference image. Fine rain falls steadily and creates small circular ripples in the foreground puddles. The charcoal cat slowly turns one ear toward the bakery door; this is the only character action. Warm window light flickers almost imperceptibly. Static cinematic camera with a very slow two-percent push-in. Close rain taps on the wooden awning, distant soft thunder, quiet fire crackle from inside, no speech, no music. End with the cat looking toward the door. Preserve faces, architecture and lighting; avoid fast rain, camera shake, new objects or additional characters.
```

### Cảnh 02 — Nhào bột

**Prompt video:**

```text
Close-up of An's adult hands slowly folding soft milk-bread dough on a worn wooden worktable. Keep her moss-green apron, cream rolled sleeves, brass measuring spoon and warm amber side light unchanged. One continuous kneading cycle: press, fold, quarter-turn, rest. Flour particles move only when touched; the dough compresses with realistic weight and elasticity. Locked overhead camera. Intimate sounds of palms against dough, faint wooden table creak, rain muffled behind the window and low oven fire, no dialogue, no music. End with both hands resting beside the rounded dough, ready for the next shot. Avoid extra fingers, melting dough, fast motion, floating flour or changes to the utensils.
```

### Cảnh 03 — Mun chạm vào túi bột

**Prompt video:**

```text
The small charcoal cat Mun, with consistent amber eyes and a tiny nick on the left ear, reaches one paw toward a folded paper flour bag beside the worktable. The paw gently touches the bag once; the paper crinkles and a tiny dusting of flour falls onto the wooden floor. An remains softly out of focus in the background and does not change pose. Low floor-level camera, static composition, shallow depth of field, warm bakery light and cool rainy window light. Close paper crinkle, one soft paw step, distant kneading and rain, no speech, no music. End with Mun looking at the small flour mark. Avoid duplicate paws, jumping, bag deformation, face drift or new objects.
```

### Cảnh 04 — Bánh nở trong lò

**Prompt video:**

```text
Macro view through the small oven window as six milk buns slowly rise and turn golden. Keep the same ceramic baking tray and oven interior from the reference frame. The primary motion is a subtle, physically plausible expansion of the dough; secondary motion is gentle heat shimmer and a quiet pulse of orange firelight. Camera remains locked. Detailed oven crackle, a soft metal tick as the tray warms, muffled rain in the distance, no speech, no music. End on the fullest golden shape of the buns. Avoid rapid inflation, burning, liquid texture, moving tray or abrupt lighting changes.
```

### Cảnh 05 — Kết thúc có thể lặp

**Prompt video:**

```text
An places one warm milk bun on a small blue-gray ceramic plate beside the rainy window. Keep her adult face, low black hair bun, moss-green apron and all counter objects identical to previous shots. Steam curls upward in one slow ribbon while Mun settles beside the plate without touching it. Very slow side dolly of a few centimeters, ending on the window where rain reflections match the opening scene. Close ceramic contact, delicate paper wrap rustle, soft purring, rain on glass and low fire crackle, no dialogue, no music. End with the same amber window glow and rain rhythm used in Scene 01 to support a seamless loop. Avoid eating, sudden gestures, extra food, text, logos or character drift.
```

## Master Prompt 7 — Tiêu đề và thumbnail không giật tít quá mức

```text
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
```

## Checklist trước khi đăng

- [ ] Nhân vật giữ đúng khuôn mặt, tóc, trang phục và tỷ lệ.
- [ ] Mỗi clip chỉ có một hành động chính.
- [ ] Không có chữ, logo hoặc watermark do AI tự sinh.
- [ ] Hướng nhìn và vị trí đạo cụ khớp giữa hai cảnh liền nhau.
- [ ] Âm thanh đúng vật liệu và không có giọng nói bất ngờ.
- [ ] Cảnh mở đầu có hook hình ảnh trong vài giây đầu.
- [ ] Cảnh kết tạo cảm giác hoàn thành hoặc nối vòng được.
- [ ] Tiêu đề và thumbnail phản ánh đúng nội dung.
- [ ] Video có câu chuyện, lựa chọn sáng tạo và biên tập của riêng bạn.
- [ ] Không dùng nhân vật, logo, âm nhạc hoặc khung hình thuộc tác phẩm khác.

## Công thức có thể tái sử dụng

Bạn không cần tạo một “cỗ máy video tự động”. Một hệ thống tốt hơn là:

```text
Một thế giới nguyên bản
→ một series bible ổn định
→ một nghi thức ASMR cho mỗi tập
→ một hành động cho mỗi clip
→ khóa first frame/end frame
→ kiểm tra thủ công
→ chỉ tạo lại cảnh lỗi
```

Khi phần nền này đủ chắc, ChatGPT giúp bạn suy nghĩ có cấu trúc, còn Flow biến cấu trúc đó thành hình ảnh và chuyển động. Giá trị thật sự vẫn nằm ở lựa chọn sáng tạo, nhịp kể chuyện và khả năng giữ cho mỗi tập có một cảm xúc riêng.
