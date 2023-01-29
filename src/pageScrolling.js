export function pageScrolling(gallery) {
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }