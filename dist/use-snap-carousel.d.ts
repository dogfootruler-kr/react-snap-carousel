interface SnapCarouselResult {
    readonly pages: number[][];
    readonly activePageIndex: number;
    readonly snapPointIndexes: Set<number>;
    readonly prev: () => void;
    readonly next: () => void;
    readonly goTo: (pageIndex: number) => void;
    readonly refresh: () => void;
    readonly scrollRef: (el: HTMLElement | null) => void;
}
interface SnapCarouselOptions {
    readonly axis?: 'x' | 'y';
    readonly initialPages?: number[][];
    readonly behavior?: ScrollBehavior;
}
declare const useSnapCarousel: ({ axis, initialPages, behavior }?: SnapCarouselOptions) => SnapCarouselResult;

export { SnapCarouselOptions, SnapCarouselResult, useSnapCarousel };
