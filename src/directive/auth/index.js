export default {
  inserted( el, binding ) {
    el.removeEventListener( 'click', () => {} )
    el.addEventListener(
      'click',
      () => {
        // TODO: 校验权限
      },
      true
    ) // 阻止冒泡
  }
}

