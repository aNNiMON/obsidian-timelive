import { App, MarkdownPostProcessorContext } from "obsidian";

export interface DOMProcessor {
  process(element: HTMLElement, ctx: MarkdownPostProcessorContext): HTMLElement;
}

export class CompoundDOMProcessor implements DOMProcessor {
  constructor(private processors: DOMProcessor[]) {}

  process(element: HTMLElement, ctx: MarkdownPostProcessorContext): HTMLElement {
    for (const processor of this.processors) {
      element = processor.process(element, ctx);
    }
    return element;
  }
}

export class InternalLinkProcessor implements DOMProcessor {
  constructor(private app: App) {}

  process(element: HTMLElement, ctx: MarkdownPostProcessorContext): HTMLElement {
    element.querySelectorAll("a[data-href].internal-link").forEach((link) => {
      const href = link.getAttribute("data-href");
      if (!href) return;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.app.workspace.openLinkText(href, ctx.sourcePath);
      });
    });
    return element;
  }
}
