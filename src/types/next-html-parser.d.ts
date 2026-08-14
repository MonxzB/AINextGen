declare module "next/dist/compiled/node-html-parser" {
  export interface HTMLElement {
    tagName?: string;
    text: string;
    childNodes: HTMLElement[];
    querySelector(selector: string): HTMLElement | null;
    querySelectorAll(selector: string): HTMLElement[];
    getAttribute(name: string): string | undefined;
  }

  export function parse(html: string): HTMLElement;
}
