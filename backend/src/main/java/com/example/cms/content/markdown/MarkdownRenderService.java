package com.example.cms.content.markdown;

import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

@Service
public class MarkdownRenderService {
    private final Parser parser = Parser.builder().build();
    private final HtmlRenderer renderer = HtmlRenderer.builder().build();
    public String render(String markdown) {
        String html = renderer.render(parser.parse(markdown == null ? "" : markdown));
        return Jsoup.clean(html, Safelist.relaxed().addTags("table", "thead", "tbody", "tr", "th", "td").addAttributes("a", "target", "rel"));
    }
}
