import { BaseBoxShapeUtil, HTMLContainer } from "tldraw";
import type { C1ComponentShape } from "../shapes/C1ComponentShape";
import { ResizableContainer } from "../components/ResizableContainer";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import { AiIcon } from "../components/AiIcon";

export class C1ComponentShapeUtil extends BaseBoxShapeUtil<C1ComponentShape> {
  static override type = "c1-component" as const;

  getDefaultProps(): C1ComponentShape["props"] {
    return { w: 300, h: 150 };
  }

  component = (shape: C1ComponentShape) => {
    const isDarkMode = this.editor.user.getIsDarkMode();

    if (!shape.props.c1Response) {
      return (
        <HTMLContainer>
          <div className="w-full h-full flex flex-col gap-1 items-center justify-center border border-[#7F56D917] outline-[#0000000F] bg-[#7F56D914] rounded-xl text-primary">
            <AiIcon />
            <p className="text-md">Magic will happen here</p>
          </div>
        </HTMLContainer>
      );
    }

    return (
      <HTMLContainer style={{ overflow: "visible", pointerEvents: "all" }}>
        <ResizableContainer shape={shape}>
          <ThemeProvider mode={isDarkMode ? "dark" : "light"}>
            <C1Component
              c1Response={shape.props.c1Response}
              isStreaming={shape.props.isStreaming || false}
            />
          </ThemeProvider>
        </ResizableContainer>
      </HTMLContainer>
    );
  };

  indicator(shape: C1ComponentShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

const prefilledC1Response =
  "<content>{\n  &quot;component&quot;: {\n    &quot;component&quot;: &quot;Card&quot;,\n    &quot;props&quot;: {\n      &quot;children&quot;: [\n        {\n          &quot;component&quot;: &quot;CardHeader&quot;,\n          &quot;props&quot;: {\n            &quot;title&quot;: &quot;Travel Guide: Japan&quot;,\n            &quot;subtitle&quot;: &quot;Essential information for visiting Japan&quot;\n          }\n        },\n        {\n          &quot;component&quot;: &quot;Tabs&quot;,\n          &quot;props&quot;: {\n            &quot;children&quot;: [\n              {\n                &quot;value&quot;: &quot;highlights&quot;,\n                &quot;trigger&quot;: {\n                  &quot;text&quot;: &quot;Highlights&quot;,\n                  &quot;icon&quot;: {\n                    &quot;component&quot;: &quot;Icon&quot;,\n                    &quot;props&quot;: {\n                      &quot;name&quot;: &quot;star&quot;\n                    }\n                  }\n                },\n                &quot;content&quot;: [\n                  {\n                    &quot;component&quot;: &quot;ListBlock&quot;,\n                    &quot;props&quot;: {\n                      &quot;items&quot;: [\n                        {\n                          &quot;title&quot;: &quot;Mount Fuji&quot;,\n                          &quot;subtitle&quot;: &quot;Japan&#39;s iconic mountain and UNESCO World Heritage site&quot;,\n                          &quot;imageAlt&quot;: &quot;Mount Fuji&quot;\n                        },\n                        {\n                          &quot;title&quot;: &quot;Tokyo&quot;,\n                          &quot;subtitle&quot;: &quot;Ultra-modern capital with traditional charm&quot;,\n                          &quot;imageAlt&quot;: &quot;Tokyo cityscape&quot;\n                        },\n                        {\n                          &quot;title&quot;: &quot;Kyoto&quot;,\n                          &quot;subtitle&quot;: &quot;Ancient temples, gardens and geisha district&quot;,\n                          &quot;imageAlt&quot;: &quot;Kyoto temples&quot;\n                        },\n                        {\n                          &quot;title&quot;: &quot;Osaka&quot;,\n                          &quot;subtitle&quot;: &quot;Known for food culture and vibrant nightlife&quot;,\n                          &quot;imageAlt&quot;: &quot;Osaka street food&quot;\n                        }\n                      ]\n                    }\n                  }\n                ]\n              },\n              {\n                &quot;value&quot;: &quot;practical&quot;,\n                &quot;trigger&quot;: {\n                  &quot;text&quot;: &quot;Practical Info&quot;,\n                  &quot;icon&quot;: {\n                    &quot;component&quot;: &quot;Icon&quot;,\n                    &quot;props&quot;: {\n                      &quot;name&quot;: &quot;info&quot;\n                    }\n                  }\n                },\n                &quot;content&quot;: [\n                  {\n                    &quot;component&quot;: &quot;Accordion&quot;,\n                    &quot;props&quot;: {\n                      &quot;children&quot;: [\n                        {\n                          &quot;value&quot;: &quot;transport&quot;,\n                          &quot;trigger&quot;: {\n                            &quot;text&quot;: &quot;Transportation&quot;\n                          },\n                          &quot;content&quot;: [\n                            {\n                              &quot;component&quot;: &quot;TextContent&quot;,\n                              &quot;props&quot;: {\n                                &quot;textMarkdown&quot;: &quot;- Get a JR Rail Pass for inter-city travel (must buy before arriving in Japan)\\n- Use IC cards (Pasmo/Suica) for local transit\\n- Trains are punctual and extensive\\n- Taxis are clean but expensive&quot;\n                              }\n                            }\n                          ]\n                        },\n                        {\n                          &quot;value&quot;: &quot;currency&quot;,\n                          &quot;trigger&quot;: {\n                            &quot;text&quot;: &quot;Money &amp; Payments&quot;\n                          },\n                          &quot;content&quot;: [\n                            {\n                              &quot;component&quot;: &quot;TextContent&quot;,\n                              &quot;props&quot;: {\n                                &quot;textMarkdown&quot;: &quot;- Currency: Japanese Yen (¥)\\n- Many places still prefer cash\\n- ATMs at 7-Eleven always accept foreign cards\\n- Bring cash for smaller shops and restaurants&quot;\n                              }\n                            }\n                          ]\n                        },\n                        {\n                          &quot;value&quot;: &quot;etiquette&quot;,\n                          &quot;trigger&quot;: {\n                            &quot;text&quot;: &quot;Cultural Etiquette&quot;\n                          },\n                          &quot;content&quot;: [\n                            {\n                              &quot;component&quot;: &quot;TextContent&quot;,\n                              &quot;props&quot;: {\n                                &quot;textMarkdown&quot;: &quot;- Bow when greeting people\\n- Remove shoes before entering homes\\n- No tipping in restaurants\\n- Be quiet on public transport\\n- Don&#39;t eat while walking&quot;\n                              }\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  }\n                ]\n              },\n              {\n                &quot;value&quot;: &quot;when-to-visit&quot;,\n                &quot;trigger&quot;: {\n                  &quot;text&quot;: &quot;Best Time to Visit&quot;\n                },\n                &quot;content&quot;: [\n                  {\n                    &quot;component&quot;: &quot;TextContent&quot;,\n                    &quot;props&quot;: {\n                      &quot;textMarkdown&quot;: &quot;**Peak Seasons:**\\n\\n🌸 **Spring (March-May)**: Cherry blossom season, mild weather\\n🍁 **Fall (Sept-Nov)**: Beautiful autumn colors, comfortable temperatures\\n\\n**Other Seasons:**\\n\\n☀️ **Summer (June-Aug)**: Hot and humid, festival season\\n❄️ **Winter (Dec-Feb)**: Cold but clear, great for winter sports and hot springs&quot;\n                    }\n                  }\n                ]\n              }\n            ]\n          }\n        },\n        {\n          &quot;component&quot;: &quot;Callout&quot;,\n          &quot;props&quot;: {\n            &quot;variant&quot;: &quot;info&quot;,\n            &quot;title&quot;: &quot;Important Travel Tips&quot;,\n            &quot;description&quot;: &quot;Book accommodations well in advance, especially during cherry blossom season. Consider getting a pocket WiFi or SIM card for internet access. Download offline maps and translation apps.&quot;\n          }\n        },\n        {\n          &quot;component&quot;: &quot;FollowUpBlock&quot;,\n          &quot;props&quot;: {\n            &quot;followUpText&quot;: [\n              &quot;What are the must-try Japanese foods?&quot;,\n              &quot;Tell me more about Japanese festivals and events&quot;,\n              &quot;What are the best day trips from Tokyo?&quot;,\n              &quot;How can I experience traditional Japanese culture?&quot;\n            ]\n          }\n        }\n      ]\n    }\n  }\n}</content>";
