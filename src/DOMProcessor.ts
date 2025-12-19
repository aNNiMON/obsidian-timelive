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
        const newTab = this.shouldOpenInNewTab(e);
        this.app.workspace.openLinkText(href, ctx.sourcePath, newTab);
      });
    });
    return element;
  }

  private shouldOpenInNewTab(e: Event): boolean {
    if (
      e instanceof PointerEvent ||
      e instanceof MouseEvent ||
      e instanceof TouchEvent ||
      e instanceof KeyboardEvent
    ) {
      return (e.ctrlKey || e.metaKey);
    }
    return false;
  }
}
