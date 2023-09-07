"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-snap-carousel.tsx
var use_snap_carousel_exports = {};
__export(use_snap_carousel_exports, {
  useSnapCarousel: () => useSnapCarousel
});
module.exports = __toCommonJS(use_snap_carousel_exports);
var import_react2 = require("react");

// src/use-isomorphic-layout-effect.tsx
var import_react = require("react");
var useIsomorphicLayoutEffect = typeof document !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;

// src/use-snap-carousel.tsx
var useSnapCarousel = ({
  axis = "x",
  initialPages = [],
  behavior = "smooth"
} = {}) => {
  const dimension = axis === "x" ? "width" : "height";
  const scrollDimension = axis === "x" ? "scrollWidth" : "scrollHeight";
  const clientDimension = axis === "x" ? "clientWidth" : "clientHeight";
  const nearSidePos = axis === "x" ? "left" : "top";
  const farSidePos = axis === "x" ? "right" : "bottom";
  const scrollPos = axis === "x" ? "scrollLeft" : "scrollTop";
  const [scrollEl, setScrollEl] = (0, import_react2.useState)(null);
  const [{ pages, activePageIndex }, setCarouselState] = (0, import_react2.useState)({
    pages: initialPages,
    activePageIndex: 0
  });
  const refreshActivePage = (0, import_react2.useCallback)(
    (pages2) => {
      if (!scrollEl) {
        return;
      }
      const hasScrolledToEnd = Math.floor(scrollEl[scrollDimension] - scrollEl[scrollPos]) <= scrollEl[clientDimension];
      if (hasScrolledToEnd) {
        setCarouselState({ pages: pages2, activePageIndex: pages2.length - 1 });
        return;
      }
      const items = Array.from(scrollEl.children);
      const scrollPort = scrollEl.getBoundingClientRect();
      const offsets = pages2.map((page) => {
        const leadIndex = page[0];
        const leadEl = items[leadIndex];
        assert(leadEl instanceof HTMLElement, "Expected HTMLElement");
        const scrollSpacing = getEffectiveScrollSpacing(
          scrollEl,
          leadEl,
          nearSidePos
        );
        const rect = leadEl.getBoundingClientRect();
        const offset = rect[nearSidePos] - scrollPort[nearSidePos] - scrollSpacing;
        return Math.abs(offset);
      });
      const minOffset = Math.min(...offsets);
      const nextActivePageIndex = offsets.indexOf(minOffset);
      setCarouselState({ pages: pages2, activePageIndex: nextActivePageIndex });
    },
    [scrollEl, clientDimension, nearSidePos, scrollDimension, scrollPos]
  );
  const refresh = (0, import_react2.useCallback)(() => {
    if (!scrollEl) {
      return;
    }
    const items = Array.from(scrollEl.children);
    const scrollPort = scrollEl.getBoundingClientRect();
    let currPageStartPos;
    const pages2 = items.reduce((acc, item, i) => {
      assert(item instanceof HTMLElement, "Expected HTMLElement");
      const currPage = acc[acc.length - 1];
      const rect = getOffsetRect(item, item.parentElement);
      if (!currPage || rect[farSidePos] - currPageStartPos > Math.ceil(scrollPort[dimension])) {
        acc.push([i]);
        const scrollSpacing = getEffectiveScrollSpacing(
          scrollEl,
          item,
          nearSidePos
        );
        currPageStartPos = rect[nearSidePos] - scrollSpacing;
      } else {
        currPage.push(i);
      }
      return acc;
    }, []);
    refreshActivePage(pages2);
  }, [refreshActivePage, scrollEl, dimension, farSidePos, nearSidePos]);
  useIsomorphicLayoutEffect(() => {
    refresh();
  }, [refresh]);
  (0, import_react2.useEffect)(() => {
    const handle = () => {
      refresh();
    };
    window.addEventListener("resize", handle);
    window.addEventListener("orientationchange", handle);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("orientationchange", handle);
    };
  }, [refresh]);
  (0, import_react2.useEffect)(() => {
    if (!scrollEl) {
      return;
    }
    const handle = () => {
      refreshActivePage(pages);
    };
    scrollEl.addEventListener("scroll", handle);
    return () => {
      scrollEl.removeEventListener("scroll", handle);
    };
  }, [refreshActivePage, pages, scrollEl]);
  const handleGoTo = (index) => {
    if (!scrollEl) {
      return;
    }
    const page = pages[index];
    if (!page) {
      return;
    }
    const items = Array.from(scrollEl.children);
    const leadIndex = page[0];
    const leadEl = items[leadIndex];
    if (!(leadEl instanceof HTMLElement)) {
      return;
    }
    const scrollSpacing = getEffectiveScrollSpacing(
      scrollEl,
      leadEl,
      nearSidePos
    );
    scrollEl.scrollTo({
      behavior,
      [nearSidePos]: getOffsetRect(leadEl, leadEl.parentElement)[nearSidePos] - scrollSpacing
    });
  };
  const handlePrev = () => {
    handleGoTo(activePageIndex - 1);
  };
  const handleNext = () => {
    handleGoTo(activePageIndex + 1);
  };
  const snapPointIndexes = (0, import_react2.useMemo)(
    () => new Set(pages.map((page) => page[0])),
    [pages]
  );
  return {
    prev: handlePrev,
    next: handleNext,
    goTo: handleGoTo,
    refresh,
    pages,
    activePageIndex,
    snapPointIndexes,
    scrollRef: setScrollEl
  };
};
var getOffsetRect = (el, relativeTo) => {
  const rect = _getOffsetRect(el);
  if (!relativeTo) {
    return rect;
  }
  const relativeRect = _getOffsetRect(relativeTo);
  return {
    left: rect.left - relativeRect.left,
    top: rect.top - relativeRect.top,
    right: rect.right - relativeRect.left,
    bottom: rect.bottom - relativeRect.top,
    width: rect.width,
    height: rect.height
  };
};
var _getOffsetRect = (el) => {
  const rect = el.getBoundingClientRect();
  let scrollLeft = 0;
  let scrollTop = 0;
  let parentEl = el.parentElement;
  while (parentEl) {
    scrollLeft += parentEl.scrollLeft;
    scrollTop += parentEl.scrollTop;
    parentEl = parentEl.parentElement;
  }
  const left = rect.left + scrollLeft;
  const top = rect.top + scrollTop;
  return {
    left,
    top,
    right: left + rect.width,
    bottom: top + rect.height,
    width: rect.width,
    height: rect.height
  };
};
var getScrollPaddingUsedValue = (el, pos) => {
  const style = window.getComputedStyle(el);
  const scrollPadding = style.getPropertyValue(`scroll-padding-${pos}`);
  if (scrollPadding === "auto") {
    return 0;
  }
  const invalidMsg = `Unsupported scroll padding value, expected <length> or <percentage> value, received ${scrollPadding}`;
  if (scrollPadding.endsWith("px")) {
    const value = parseInt(scrollPadding);
    assert(!Number.isNaN(value), invalidMsg);
    return value;
  }
  if (scrollPadding.endsWith("%")) {
    const value = parseInt(scrollPadding);
    assert(!Number.isNaN(value), invalidMsg);
    return el.clientWidth / 100 * value;
  }
  throw new RSCError(invalidMsg);
};
var getScrollMarginUsedValue = (el, pos) => {
  const style = window.getComputedStyle(el);
  const scrollMargin = style.getPropertyValue(`scroll-margin-${pos}`);
  const invalidMsg = `Unsupported scroll margin value, expected <length> value, received ${scrollMargin}`;
  assert(scrollMargin.endsWith("px"), invalidMsg);
  const value = parseInt(scrollMargin);
  assert(!Number.isNaN(value), invalidMsg);
  return value;
};
var getEffectiveScrollSpacing = (scrollEl, itemEl, pos) => {
  const scrollPadding = getScrollPaddingUsedValue(scrollEl, pos);
  const scrollMargin = getScrollMarginUsedValue(itemEl, pos);
  const rect = getOffsetRect(itemEl, itemEl.parentElement);
  return Math.min(scrollPadding + scrollMargin, rect[pos]);
};
function assert(value, message) {
  if (value) {
    return;
  }
  throw new RSCError(message);
}
var RSCError = class extends Error {
  constructor(message) {
    super(`[react-snap-carousel]: ${message}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSnapCarousel
});
