/**
 * 获取节点相对偏移数据
 * @param {HTMLElement} element 当前节点
 * @param {HTMLElement} parentElement 相对祖先节点(默认父节点)
 * @return {Obejct}
 */
 export function getOffset(element, parentElement) {
  const elementRect = element.getBoundingClientRect();
  const parentElementRect = parentElement === undefined ? element.parentNode.getBoundingClientRect() : parentElement.getBoundingClientRect();
  return {
    top: elementRect.top - parentElementRect.top,
    left: elementRect.left - parentElementRect.left,
    width: elementRect.width,
    height: elementRect.height
  }
}
