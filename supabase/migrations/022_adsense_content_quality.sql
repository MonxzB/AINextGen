-- Fill missing trust signals without overwriting existing editorial work.

update public.articles
set author_bio = 'Đội ngũ AINextGen biên tập hướng dẫn từ tài liệu chính thức, chịu trách nhiệm về bản công khai và cập nhật khi công cụ hoặc chính sách thay đổi.',
    reviewed_at = coalesce(reviewed_at, now()),
    updated_at = now()
where nullif(btrim(author_bio), '') is null;

-- Repair absolute asset URLs left from the previous domain.
update public.articles
set cover_url = replace(cover_url, 'https://ainextgen.vn/', 'https://ainextgen.io.vn/'),
    updated_at = now()
where cover_url like 'https://ainextgen.vn/%';

update public.articles
set cover_url = 'https://ainextgen.io.vn/images/tutorials/tao-video-tu-dong-bang-code-remotion-ai-voice.webp',
    updated_at = now()
where slug = 'tao-video-tu-dong-bang-code-remotion-ai-voice'
  and nullif(btrim(cover_url), '') is null;

update public.articles
set seo_title = coalesce(seo_title, 'Phân tích cách kể chuyện tài liệu của kênh Fern'),
    seo_description = coalesce(seo_description, 'Phân tích cấu trúc mở bài, nhịp kể, hình ảnh và cách kiểm chứng nguồn trong video tài liệu; kèm checklist để phát triển phong cách riêng.'),
    source_references = source_references || jsonb_build_array(
      jsonb_build_object('label', 'YouTube — Chính sách nội dung nguyên bản', 'url', 'https://support.google.com/youtube/answer/1311392')
    ),
    updated_at = now()
where slug = 'tong-quan-kenh-youtube-fern-phong-cach-documentary-storytelling'
  and jsonb_array_length(coalesce(source_references, '[]'::jsonb)) = 1;

update public.articles
set source_references = case
      when tools ? 'Remotion' then jsonb_build_array(
        jsonb_build_object('label', 'Remotion — Tài liệu chính thức', 'url', 'https://www.remotion.dev/docs/'),
        jsonb_build_object('label', 'ElevenLabs — Tài liệu Text to Speech', 'url', 'https://elevenlabs.io/docs/overview/capabilities/text-to-speech'),
        jsonb_build_object('label', 'YouTube — Công bố nội dung tạo bằng AI', 'url', 'https://support.google.com/youtube/answer/14328491')
      )
      when tools ? 'Higgsfield AI' then jsonb_build_array(
        jsonb_build_object('label', 'Higgsfield — Tài liệu sản phẩm AI Video', 'url', 'https://higgsfield.ai/ai-video'),
        jsonb_build_object('label', 'Anthropic — Prompting best practices', 'url', 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables'),
        jsonb_build_object('label', 'YouTube — Công bố nội dung tạo bằng AI', 'url', 'https://support.google.com/youtube/answer/14328491')
      )
      when tools ? 'Magic Hour AI' then jsonb_build_array(
        jsonb_build_object('label', 'Magic Hour — Nền tảng tạo video AI', 'url', 'https://magichour.ai/'),
        jsonb_build_object('label', 'YouTube — Nội dung nguyên bản và chính sách kiếm tiền', 'url', 'https://support.google.com/youtube/answer/1311392'),
        jsonb_build_object('label', 'YouTube — Công bố nội dung tạo bằng AI', 'url', 'https://support.google.com/youtube/answer/14328491')
      )
      when tools ? 'YouTube Kids' then jsonb_build_array(
        jsonb_build_object('label', 'YouTube — Nội dung nguyên bản và chính sách kiếm tiền', 'url', 'https://support.google.com/youtube/answer/1311392'),
        jsonb_build_object('label', 'YouTube — Nội dung chất lượng cho trẻ em và gia đình', 'url', 'https://support.google.com/youtube/answer/10774223'),
        jsonb_build_object('label', 'YouTube — Nội dung dành cho trẻ em', 'url', 'https://support.google.com/youtube/answer/9684541')
      )
      when tools ? 'Canva' then jsonb_build_array(
        jsonb_build_object('label', 'Google Flow — Công cụ làm phim AI', 'url', 'https://labs.google/fx/tools/flow'),
        jsonb_build_object('label', 'Canva — Thỏa thuận cấp phép nội dung', 'url', 'https://www.canva.com/policies/content-license-agreement/'),
        jsonb_build_object('label', 'YouTube — Nội dung nguyên bản và chính sách kiếm tiền', 'url', 'https://support.google.com/youtube/answer/1311392')
      )
      when tools ? 'Claude AI' then jsonb_build_array(
        jsonb_build_object('label', 'Anthropic — Prompting best practices', 'url', 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables'),
        jsonb_build_object('label', 'Google Flow — Công cụ làm phim AI', 'url', 'https://labs.google/fx/tools/flow'),
        jsonb_build_object('label', 'YouTube — Công bố nội dung tạo bằng AI', 'url', 'https://support.google.com/youtube/answer/14328491')
      )
      else jsonb_build_array(
        jsonb_build_object('label', 'OpenAI — Cách viết prompt hiệu quả', 'url', 'https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt'),
        jsonb_build_object('label', 'Google Flow — Công cụ làm phim AI', 'url', 'https://labs.google/fx/tools/flow'),
        jsonb_build_object('label', 'YouTube — Nội dung nguyên bản và chính sách kiếm tiền', 'url', 'https://support.google.com/youtube/answer/1311392')
      )
    end,
    reviewed_at = coalesce(reviewed_at, now()),
    updated_at = now()
where source_url is null
  and jsonb_array_length(coalesce(source_references, '[]'::jsonb)) < 2;
